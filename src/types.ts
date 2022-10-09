import { DataQuery, DataSourceJsonData } from '@grafana/data';

export type hrConversionFlags = 'toHumanReadable' | 'fromHumanReadable';
export interface SortByParameters {
    nonHumanReadable: 'alpha' | 'max' | 'rmax' | 'mean' | 'rstd' | 'spike'
    humanReadable: 'Alpha' | 'Max' | '-Max' | 'Mean' | 'RSTD' | 'Spike'
}

export type MetricType = 'timeseries' | 'scatter';

export interface Query extends DataQuery {
  primaryPanelFilter?: string;
  primaryPanelFilterInvert: boolean;
  secondaryPanelFilter?: string;
  secondaryPanelFilterInvert: boolean;
  sortBy: SortByParameters["nonHumanReadable"];
  metricType: MetricType
}

export const defaultQuery: Partial<Query> = {
  primaryPanelFilterInvert: false,
  secondaryPanelFilterInvert: false,
  sortBy: 'rstd',
  metricType: 'timeseries',
};

export const defaultOptions: Partial<Options> = {
  endpoint: "https://engine.anomalizer.app"
}

export interface Options extends DataSourceJsonData {
  endpoint: string;
  primaryServerFilter?: string;
  secondaryServerFilter?: string;

}

export type DistributionTypes = "gaussian" | "left-tailed" | "right-tailed" | "bi-modal";
export const DistributionTypesAsConst = ["gaussian", "left-tailed", "right-tailed", "bi-modal"];

export interface MetricImage {
    cardinality: string
    features: {
        cluster?: number,
        clusters?: string[]
        noisy?: {
            snr: number
        },
        normalized_features?: number,
        increasing?: {
            increase: number
        },
        decreasing?: {
            decrease: number
        },
        distribution?: {
            [key: string]: DistributionTypes
        },
        hockeystick: {
            increasing?: number,
            decreasing?: number
        }
    },
    weight: number,
    id: string
    img: string
    metric: string
    plot: "timeseries" | "scatter"
    prometheus: string
    stats: {
        [key: string]: number
    }
    status: "normal" | "warning" | "critical"
    tags: Array<{
        [key: string]: string
    }>
    type: string
}


