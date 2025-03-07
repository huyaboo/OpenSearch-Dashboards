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
import { getFlattenedObject } from '@osd/std';
import { EuiCodeBlock, EuiDescriptionList, EuiSpacer } from '@elastic/eui';
import { ShardFailure } from './shard_failure_types';
import { ShardFailureDescriptionHeader } from './shard_failure_description_header';

/**
 * Provides pretty formatting of a given key string
 * e.g. formats "this_key.is_nice" to "This key is nice"
 * @param key
 */
export function formatKey(key: string): string {
  const nameCapitalized = key.charAt(0).toUpperCase() + key.slice(1);
  return nameCapitalized.replace(/[\._]/g, ' ');
}
/**
 * Adds a EuiCodeBlock to values of  `script` and `script_stack` key
 * Values of other keys are handled a strings
 * @param value
 * @param key
 */
export function formatValueByKey(value: unknown, key: string): string | JSX.Element {
  if (key === 'script' || key === 'script_stack') {
    const valueScript = Array.isArray(value) ? value.join('\n') : String(value);
    return (
      <EuiCodeBlock language="java" paddingSize="s" isCopyable>
        {valueScript}
      </EuiCodeBlock>
    );
  } else {
    return String(value);
  }
}

export function ShardFailureDescription(props: ShardFailure) {
  const flattendReason = getFlattenedObject(props.reason);

  const listItems = Object.entries(flattendReason).map(([key, value]) => ({
    title: formatKey(key),
    description: formatValueByKey(value, key),
  }));

  return (
    <div>
      <ShardFailureDescriptionHeader {...props} />
      <EuiSpacer size="m" />
      <EuiDescriptionList
        listItems={listItems}
        type="column"
        compressed
        className="shardFailureModal__desc"
        data-test-subj="shardFailureModalDescription"
        titleProps={{ className: 'shardFailureModal__descTitle' }}
        descriptionProps={{ className: 'shardFailureModal__descValue' }}
      />
    </div>
  );
}
