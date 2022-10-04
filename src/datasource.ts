

import {
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  Field,
  MutableDataFrame
} from '@grafana/data';

import { getBackendSrv } from "@grafana/runtime"

import { Query, Options, MetricImage } from './types';

export class DataSource extends DataSourceApi<Query, Options> {

  instanceSettings: DataSourceInstanceSettings<Options>;

  constructor(instanceSettings: DataSourceInstanceSettings<Options>) {
    super(instanceSettings);
    this.instanceSettings = instanceSettings;
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


  }

  async query(options: DataQueryRequest<Query>): Promise<DataQueryResponse> {

    let images = (await this.request(this.instanceSettings.jsonData.endpoint + '/images',  "GET")).data;

    let data = options.targets.map(target => {

      if (target.primaryPanelFilter || target.secondaryPanelFilter) {
        for (let chartId in images) {

            let chart: MetricImage = images[chartId];

            let searchString = chart.metric + ',' + JSON.stringify(chart.tags) + ',' + JSON.stringify({status: chart.status}) + ',' + chart.type + ',' + JSON.stringify({ features: chart.features }) + ',' + JSON.stringify({ cardinality: chart.cardinality }) + ',' + JSON.stringify({ plot: chart.plot });  
            
            try {

                if (target.primaryPanelFilter) {
                  if (target.primaryPanelFilterInvert) {
                    if (searchString.match(`${target.primaryPanelFilter}`)) {
                      delete images[chartId];
                      continue;
                    }
                  } else {
                    if (!searchString.match(`${target.primaryPanelFilter}`)) {
                      delete images[chartId];
                      continue;
                    }
                  }
                }

                

                if (target.secondaryPanelFilter) {
                  if (target.secondaryPanelFilterInvert) {
                    if (searchString.match(`${target.secondaryPanelFilter}`)) {
                        delete images[chartId];
                        continue;
                      }
                  } else {
                      if (!searchString.match(`${target.secondaryPanelFilter}`)) {
                        delete images[chartId];
                        continue;
                      }
                  }
                }

                

                

            } catch (e) {

                delete images[chartId];
                continue;
            }

        }
    }

    console.log("after filter", images);  


    return new MutableDataFrame({
      name: 'anomalizer',
      refId: target.refId,
      fields: [
        { name: 'Images', values: [images], config: { custom: { instanceSettings: this.instanceSettings } } }
      ],
    });

    });

    return { data };
  }

  async testDatasource() {

    let r = await this.request(this.instanceSettings.jsonData.endpoint,  "GET");

    if (r.ok) {
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
