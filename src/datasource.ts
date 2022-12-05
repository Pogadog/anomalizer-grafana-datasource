

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame
} from '@grafana/data';

// TS validator not finding the runtime lib
//@ts-ignore
import { getBackendSrv, FetchResponse } from "@grafana/runtime"


import { Query, Options, MetricImage } from './types';

export class DataSource extends DataSourceApi<Query, Options> {

  instanceSettings: DataSourceInstanceSettings<Options>;

  constructor(instanceSettings: DataSourceInstanceSettings<Options>) {
    super(instanceSettings);
    this.instanceSettings = instanceSettings;
  }

  setImageCache = (images: MetricImage) => {
    
  }

  retrieveImageCache = () => {

  }

  request = async (url: string, method: 'GET' | 'POST', params?: {[key: string]: string}) => {

    let complete = false;

    let timeout = 1000;

    do {

      try {
        let r = await getBackendSrv().datasourceRequest({
          method,
          url,
        })
        complete = true;
        return r;
      } catch (e) {
        await new Promise(res => setTimeout(res, timeout));
        timeout *= 1.2;
      }
     
    } while (complete === false);

    return null;

  }

  async query(options: DataQueryRequest<Query>): Promise<DataQueryResponse> {

    let images = (await this.request(this.instanceSettings.jsonData.endpoint + '/images',  "GET"))?.data;

    //let cache = {};

    Object.keys(images).map(imageId => {
        let image = {...images[imageId]};
        delete image.img;
        delete image.metric;
        delete image.id;
    })


    let data = options.targets.map(target => {

      let targetImages = {...images}

      if (target.primaryPanelFilter || target.secondaryPanelFilter) {
        for (let chartId in targetImages) {

            let chart: MetricImage = targetImages[chartId];

            let searchString = chart.metric + ',' + JSON.stringify(chart.tags) + ',' + JSON.stringify({status: chart.status}) + ',' + chart.type + ',' + JSON.stringify({ features: chart.features }) + ',' + JSON.stringify({ cardinality: chart.cardinality }) + ',' + JSON.stringify({ plot: chart.plot });  
            
            try {

                if (target.primaryPanelFilter) {
                if (target.primaryPanelFilterInvert) {
                    if (searchString.match(`${target.primaryPanelFilter}`)) {
                        delete targetImages[chartId];
                        continue;
                    }
                } else {
                    if (!searchString.match(`${target.primaryPanelFilter}`)) {
                        delete targetImages[chartId];
                        continue;
                        }
                    }
                }

                if (target.secondaryPanelFilter) {
                if (target.secondaryPanelFilterInvert) {
                    if (searchString.match(`${target.secondaryPanelFilter}`)) {
                        delete targetImages[chartId];
                        continue;
                    }
                } else {
                    if (!searchString.match(`${target.secondaryPanelFilter}`)) {
                        delete targetImages[chartId];
                        continue;
                    }
                }
                }

            } catch (e) {

                delete targetImages[chartId];
                continue;
            }

        }
      }

    let sortedMetrics: {[key: string]: MetricImage[]} = {
        critical: [],
        warning: [],
        normal: []
    }

    for (let metricId in targetImages) {

        let chart = targetImages[metricId];

        let weight = (
            target.sortBy === 'alpha' ? -chart.metric.charCodeAt(0): 
            target.sortBy === 'spike' ? chart.stats.spike: 
            target.sortBy === 'rstd' ? chart.stats.rstd : 
            target.sortBy === 'max' ? chart.stats.max : 
            target.sortBy === 'rmax' ? chart.stats.rmax : 
            target.sortBy === 'mean' ? chart.stats.mean : 
            chart.stats.std) + Math.abs((chart.features.increasing?.increase ?? 0) + (chart.features.decreasing?.decrease ?? 0)) + (Math.abs(chart.features.hockeystick?.increasing || chart.features.hockeystick?.increasing || 0)); 

        chart.weight = weight;

        sortedMetrics[images[metricId].status].push(chart);
    }

    for (let status in sortedMetrics) {

        // timeseries or scatter
        sortedMetrics[status] = sortedMetrics[status].filter(metric => {
            return metric.plot === target.metricType;
        })

        // sort based on weight
        sortedMetrics[status] = sortedMetrics[status].sort((a, b) => {
            if ( a.weight < b.weight ){
                return 1;
            }
            if ( a.weight > b.weight ){
                return -1;
            }

            return 0;
        })
    }

    return new MutableDataFrame({
        name: 'anomalizer',
        refId: target.refId,
        fields: [
            { name: 'Images', values: [[...sortedMetrics.critical, ...sortedMetrics.warning, ...sortedMetrics.normal]], config: { custom: { instanceSettings: this.instanceSettings } } }
        ],
    });

    });

    return { data };
  }

  async testDatasource() {

    let r = await this.request(this.instanceSettings.jsonData.endpoint,  "GET");

    if (r?.ok) {
      return {
        status: 'success',
        message: 'Connection to remote OK',
      };
    } else {
      return {
        status: 'error',
        message: 'Connection to remote failed. Check the entered endpoint.',
      };
    }
    
  }
}
