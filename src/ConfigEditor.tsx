import React, { PureComponent } from 'react';
import { LegacyForms, Select } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import update from 'immutability-helper';

const { FormField } = LegacyForms;

import { defaultOptions, Options } from './types';
import { defaults } from 'lodash';

interface Props extends DataSourcePluginOptionsEditorProps<Options> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {
 
  render = () => {

    let options = defaults(this.props.options.jsonData, defaultOptions);

    return (
    <div className="gf-form-group">
        <div className="gf-form" style={{ display: 'flex', flexDirection: 'column' }} >
            <FormField
                label="Endpoint"
                labelWidth={6}
                inputWidth={20}
                onChange={event => {
                    this.props.onOptionsChange(update(this.props.options, { jsonData: {endpoint: {$set: event.target.value}} }));
                }}
                value={options.endpoint}
                placeholder="https://engine.anomalizer.app"
            />

            <div style={{ height: 20 }} />
            <div style={{ flexDirection: 'row' }} >

            <FormField
                label="Primary Server Filter"
                labelWidth={10}
                inputWidth={20}
                onChange={event => {
                    this.props.onOptionsChange(update(this.props.options, { jsonData: {primaryServerFilter: {$set: event.target.value}} }));
                }}
                value={options.primaryServerFilter}
                placeholder="foo"
            />

            <div style={{ height: 5 }} />

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
                label: options.invertPrimaryServerFilter ? 'and results should NOT match this' : 'and results should match this',
                value: options.invertPrimaryServerFilter
                }}
                    onChange={event => {
                        this.props.onOptionsChange(update(this.props.options, { jsonData: {invertPrimaryServerFilter: {$set: event.value ?? false}} }));
                    }}
            />
            <div style={{ height: 20 }} />

            <div style={{ flexDirection: 'row' }} >
                <FormField
                    label="Secondary Server Filter"
                    labelWidth={10}
                    inputWidth={20}
                    onChange={event => {
                        this.props.onOptionsChange(update(this.props.options, { jsonData: {secondaryServerFilter: {$set: event.target.value}} }));
                    }}
                    value={options.secondaryServerFilter}
                    placeholder="bar"
                />

                <div style={{ height: 5 }} />

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
                    label: options.invertSecondaryServerFilter ? 'and results should NOT match this' : 'and results should match this',
                    value: options.invertSecondaryServerFilter
                    }}
                    onChange={event => {
                        this.props.onOptionsChange(update(this.props.options, { jsonData: {invertSecondaryServerFilter: {$set: event.value ?? false}} }));
                    }}
                />
            </div>
            
        </div>

        
        </div>
      </div>
    );
  }
}
