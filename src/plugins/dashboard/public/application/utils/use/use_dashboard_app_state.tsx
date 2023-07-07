/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import EventEmitter from 'events';
import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { map } from 'rxjs/operators';
import { connectToQueryState, opensearchFilters } from '../../../../../data/public';
import { migrateLegacyQuery } from '../../lib/migrate_legacy_query';
import { DashboardServices } from '../../../types';

import { DashboardAppStateContainer } from '../../../types';
import { migrateAppState, getAppStateDefaults } from '../../lib';
import { createDashboardAppState } from '../create_dashboard_app_state';

/**
 * This effect is responsible for instantiating the dashboard app state container,
 * which is in sync with "_a" url param
 */
export const useDashboardAppState = (
  services: DashboardServices,
  eventEmitter: EventEmitter,
  instance: any
) => {
  const [appState, setAppState] = useState<DashboardAppStateContainer | undefined>();

  useEffect(() => {
    if (instance) {
      const { dashboardConfig, usageCollection, opensearchDashboardsVersion } = services;
      const hideWriteControls = dashboardConfig.getHideWriteControls();
      const stateDefaults = migrateAppState(
        getAppStateDefaults(instance, hideWriteControls),
        opensearchDashboardsVersion,
        usageCollection
      );

      const { stateContainer, stopStateSync } = createDashboardAppState({
        stateDefaults,
        osdUrlStateStorage: services.osdUrlStateStorage,
        services,
        instance,
      });

      const { filterManager, queryString } = services.data.query;

      // sync initial app state from state container to managers
      filterManager.setAppFilters(cloneDeep(stateContainer.getState().filters));
      queryString.setQuery(migrateLegacyQuery(stateContainer.getState().query));

      // setup syncing of app filters between app state and query services
      const stopSyncingAppFilters = connectToQueryState(
        services.data.query,
        {
          set: ({ filters, query }) => {
            stateContainer.transitions.set('filters', filters || []);
            stateContainer.transitions.set('query', query || queryString.getDefaultQuery());
          },
          get: () => ({
            filters: stateContainer.getState().filters,
            query: migrateLegacyQuery(stateContainer.getState().query),
          }),
          state$: stateContainer.state$.pipe(
            map((state) => ({
              filters: state.filters,
              query: queryString.formatQuery(state.query),
            }))
          ),
        },
        {
          filters: opensearchFilters.FilterStateStore.APP_STATE,
          query: true,
        }
      );

      setAppState(stateContainer);

      return () => {
        stopStateSync();
        stopSyncingAppFilters();
      };
    }
  }, [eventEmitter, instance, services]);

  return { appState };
};
