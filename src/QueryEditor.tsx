import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { Label, LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, Query, Options } from './types';
import update from 'immutability-helper';

const { FormField, Select } = LegacyForms;

type Props = QueryEditorProps<DataSource, Query, Options>;

export class QueryEditor extends PureComponent<Props> {

  onChange = (id: string, v: string | boolean | number | undefined) => {
    this.props.onChange(update(this.props.query, {[id]: {$set: v}}));
    this.props.onRunQuery();
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);

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

        




      </div>
    );
  }
}
