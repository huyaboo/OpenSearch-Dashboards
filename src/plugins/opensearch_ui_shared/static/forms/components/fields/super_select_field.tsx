/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import { EuiCompressedFormRow, EuiCompressedSuperSelect, EuiSuperSelectProps } from '@elastic/eui';

import { FieldHook, getFieldValidityAndErrorMessage } from '../../hook_form_lib';

interface Props {
  field: FieldHook;
  euiFieldProps: {
    options: EuiSuperSelectProps<any>['options'];
    [key: string]: any;
  };
  idAria?: string;
  [key: string]: any;
}

export const SuperSelectField = ({ field, euiFieldProps = { options: [] }, ...rest }: Props) => {
  const { isInvalid, errorMessage } = getFieldValidityAndErrorMessage(field);

  return (
    <EuiCompressedFormRow
      label={field.label}
      helpText={typeof field.helpText === 'function' ? field.helpText() : field.helpText}
      error={errorMessage}
      isInvalid={isInvalid}
      fullWidth
      data-test-subj={rest['data-test-subj']}
      describedByIds={rest.idAria ? [rest.idAria] : undefined}
    >
      <EuiCompressedSuperSelect
        fullWidth
        valueOfSelected={field.value as string}
        onChange={(value) => {
          field.setValue(value);
        }}
        isInvalid={isInvalid}
        data-test-subj="select"
        {...euiFieldProps}
      />
    </EuiCompressedFormRow>
  );
};
