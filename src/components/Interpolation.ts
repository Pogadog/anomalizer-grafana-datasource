import { SortByParameters, hrConversionFlags } from "types";

export const transformMetricType = (operation: hrConversionFlags, v: string | undefined): string => {

    if (!v) {
        return '';
    }

    if (operation === 'toHumanReadable') {
        switch (v) {
            case 'timeseries':
                return 'Time Series';
            case 'scatter':
                return 'Scatter'
            default:
                throw new Error('Invalid nonHR parameter ' + v);
        }
    } else if (operation === 'fromHumanReadable') {
        switch (v) {
            case 'Time Series':
                return 'timeseries';
            case 'Scatter':
                return 'scatter';
            default:
                throw new Error('Invalid HR parameter ' + v);
        }
    } else {
        throw new Error('Invalid operation ' + operation);
    }

}

export const transformSortBy = (operation: hrConversionFlags, v: string | undefined): SortByParameters["humanReadable"] | SortByParameters["nonHumanReadable"] | string => {

    if (!v) {
        return '';
    }

    if (operation === 'toHumanReadable') {
        switch (v) {
            case 'alpha':
                return 'Alpha';
            case 'max':
                return 'Max';
            case 'rmax':
                return '-Max';
            case 'mean':
                return 'Mean';
            case 'rstd':
                return 'RSTD';
            case 'spike':
                return 'Spike';
            default:
                throw new Error('Invalid nonHR parameter ' + v);
        }
    } else if (operation === 'fromHumanReadable') {
        switch (v) {
            case 'Alpha': 
                return 'alpha';
            case 'Max': 
                return 'max';
            case '-Max':
                return 'rmax';
            case 'Mean':
                return 'mean';
            case 'RSTD':
                return 'rstd';
            case 'Spike':
                return 'spike';
            default:
                throw new Error('Invalid HR parameter ' + v);
        }
    } else {
        throw new Error('Invalid operation ' + operation);
    }
}
