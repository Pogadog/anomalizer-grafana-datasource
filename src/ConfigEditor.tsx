import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import update from 'immutability-helper';

const { FormField } = LegacyForms;

import { defaultOptions, Options } from './types';
import { defaults } from 'lodash';

interface Props extends DataSourcePluginOptionsEditorProps<Options> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {
  onEndpointChange = (event: ChangeEvent<HTMLInputElement>) => {

    this.props.onOptionsChange(update(this.props.options, { jsonData: {endpoint: {$set: event.target.value}} }));

    console.log("nice");

  };

  render = () => {

    let options = defaults(this.props.options.jsonData, defaultOptions);

    console.log("options", options);

    return (
      <div className="gf-form-group">
        <div className="gf-form">
          <FormField
            label="Endpoint"
            labelWidth={6}
            inputWidth={20}
            onChange={this.onEndpointChange}
            value={options.endpoint}
            placeholder="https://engine.anomalizer.app"
          />
        </div>

        
      </div>
    );
  }
}
