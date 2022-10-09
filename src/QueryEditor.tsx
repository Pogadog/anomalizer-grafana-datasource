import defaults from 'lodash/defaults';

import React, { PureComponent } from 'react';
import { Label, LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, Query, Options } from './types';
import update from 'immutability-helper';

import { transformMetricType, transformSortBy } from 'components/Interpolation';


const { FormField, Select } = LegacyForms;

type Props = QueryEditorProps<DataSource, Query, Options>;

export class QueryEditor extends PureComponent<Props> {

  onChange = (id: string, v: string | boolean | number | undefined) => {
    this.props.onChange(update(this.props.query, {[id]: {$set: v}}));
    this.props.onRunQuery();
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);

    let sortByOptions = ['alpha', 'max', 'rmax', 'mean', 'rstd', 'spike'];

    let metricTypeOptions = ['timeseries', 'scatter'];

    return (
      <div className="gf-form" style={{ display: 'flex', flexDirection: 'column' }} >

        <div style={{ display: 'flex', flexDirection: 'row' }} >
          <FormField

            value={query.primaryPanelFilter}
            onChange={e => this.onChange('primaryPanelFilter', e.target.value)}
            label="Primary Panel Filter"
            tooltip="The primary metric filter to be performed inside the Datasource"
            labelWidth={100}
            width={400}
          />

          <Select
            options={[
              {
                label: 'and results should match this',
                value: false
              },
              {
                label: 'and results should NOT match this',
                value: true
              }
            ]}
            value={{
              label: query.primaryPanelFilterInvert ? "and results should NOT match this" : "and results should match this",
              value: query.primaryPanelFilterInvert
            }}
            onChange={e => this.onChange('primaryPanelFilterInvert', e.value)}
          />
        </div>

        <div style={{ height: 5 }} />

        <div style={{ display: 'flex', flexDirection: 'row' }} >
          <FormField

            value={query.secondaryPanelFilter}
            onChange={e => this.onChange('secondaryPanelFilter', e.target.value)}
            label="Secondary Panel Filter"
            tooltip="The secondary metric filter to be performed inside the Datasource"
            labelWidth={100}
            width={400}

          />

          <Select
            options={[
              {
                label: 'and results should match this',
                value: false
              },
              {
                label: 'and results should NOT match this',
                value: true
              }
            ]}
            value={{
              label: query.secondaryPanelFilterInvert ? "and results should NOT match this" : "and results should match this",
              value: query.secondaryPanelFilterInvert
            }}
            onChange={e => this.onChange('secondaryPanelFilterInvert', e.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', marginTop: 5 }} >
          <Label className='gf-form-label' style={{ paddingLeft: 5, paddingRight: 5, marginRight: 5, color: '#c7d0d9' }} >Sort Metrics By</Label>

          <div style={{ width: 5 }} />
          
          <Select
            options={sortByOptions.map(v => {
              return {
                label: transformSortBy('toHumanReadable', v),
                value: query.sortBy === v
              }
            })}
            value={(() => {
              return {
                label: query.sortBy ? transformSortBy('toHumanReadable', query.sortBy) : 'RSTD',
                value: true
              }
            })()}
            onChange={e => this.onChange('sortBy', transformSortBy('fromHumanReadable', e.label))}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', marginTop: 5 }} >
          <Label className='gf-form-label' style={{ paddingLeft: 5, paddingRight: 5, marginRight: 5, color: '#c7d0d9' }} >Metric Type</Label>

          <div style={{ width: 5 }} />
          
          <Select
            options={metricTypeOptions.map(v => {
              return {
                label: transformMetricType('toHumanReadable', v),
                value: query.metricType === v
              }
            })}
            value={(() => {
              return {
                label: query.metricType ? transformMetricType('toHumanReadable', query.metricType) : 'RSTD',
                value: true
              }
            })()}
            onChange={e => this.onChange('metricType', transformMetricType('fromHumanReadable', e.label))}
          />
        </div>




      </div>
    );
  }
}
