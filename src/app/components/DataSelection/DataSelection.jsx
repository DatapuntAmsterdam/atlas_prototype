/* eslint-disable global-require */
import React from 'react'
import PropTypes from 'prop-types'
import { AngularWrapper } from 'react-angular'
import classNames from 'classnames'
import { Alert, Paragraph, themeSpacing, Heading } from '@datapunt/asc-ui'
import styled from 'styled-components'
import DATA_SELECTION_CONFIG from '../../../shared/services/data-selection/data-selection-config'
import LoadingIndicator from '../../../shared/components/loading-indicator/LoadingIndicator'
import DataSelectionActiveFilters from '../../containers/DataSelectionActiveFiltersContainer'
import { VIEW_MODE } from '../../../shared/ducks/ui/ui'
import { VIEWS_TO_PARAMS } from '../../../shared/ducks/data-selection/constants'
import DataSelectionTable from './DataSelectionTable/DataSelectionTable'
import DataSelectionList from './DataSelectionList/DataSelectionList'
import ShareBar from '../ShareBar/ShareBar'
import { DEFAULT_LOCALE } from '../../../shared/config/locale.config'
import { SCOPES } from '../../../shared/services/auth/auth'
import LoginLinkContainer from '../Links/LoginLink/LoginLinkContainer'
import NotificationLevel from '../../models/notification'

let angularInstance = null

if (typeof window !== 'undefined') {
  require('../../angularModules')
  angularInstance = require('angular')
}

const StyledAlert = styled(Alert)`
  margin-bottom: ${themeSpacing(5)};
`

const DataSelection = ({
  view,
  isLoading,
  dataset,
  activeFilters,
  user,
  userScopes,
  setPage,
  authError,
  geometryFilter,
  results: { numberOfRecords, filters: availableFilters, numberOfPages, data },
  page: currentPage,
}) => {
  // Local state
  const showHeader = view === VIEW_MODE.SPLIT || !isLoading
  const showFilters = view !== VIEW_MODE.SPLIT && numberOfRecords > 0
  const { MAX_AVAILABLE_PAGES, MAX_NUMBER_OF_CLUSTERED_MARKERS } = DATA_SELECTION_CONFIG.datasets[
    dataset
  ]

  const showMessageMaxPages = MAX_AVAILABLE_PAGES && currentPage > MAX_AVAILABLE_PAGES
  const showMessageClusteredMarkers =
    view === VIEW_MODE.SPLIT && numberOfRecords > MAX_NUMBER_OF_CLUSTERED_MARKERS

  const datasetScope = DATA_SELECTION_CONFIG.datasets[dataset].AUTH_SCOPE
  const authScopeError = datasetScope ? !userScopes.includes(datasetScope) : false

  const widthClass = classNames({
    'u-col-sm--12': !showFilters,
    'u-col-sm--9': showFilters,
  })

  return (
    <div className="c-data-selection c-dashboard__content">
      <div className="c-data-selection-content qa-data-selection-content">
        {angularInstance && (
          <AngularWrapper
            moduleName="dpDataSelectionHeaderWrapper"
            component="dpDataSelectionHeader"
            dependencies={['atlas']}
            angularInstance={require('angular')}
            bindings={{
              dataset,
              availableFilters,
              geometryFilter,
              filters: activeFilters,
              isLoading,
              numberOfRecords,
              showHeader,
              user,
              view: VIEWS_TO_PARAMS[view],
            }}
          />
        )}

        {isLoading && <LoadingIndicator />}

        {!isLoading && <DataSelectionActiveFilters />}

        {!isLoading && !numberOfRecords && !authError && !authScopeError ? (
          <>
            <Paragraph>Geen resultaten van deze soort</Paragraph>
            <Paragraph>Tip: verwijder een of meer criteria</Paragraph>
          </>
        ) : (
          ''
        )}

        {!isLoading && !authError && !authScopeError && (
          <div className="u-grid qa-data-grid">
            <div className="u-row">
              {showFilters && (
                <div className="u-col-sm--3 c-data-selection__available-filters">
                  {dataset === 'hr' && angularInstance && (
                    <AngularWrapper
                      moduleName="dpSbiFilterWrapper"
                      component="dpSbiFilter"
                      angularInstance={angularInstance}
                      dependencies={['atlas']}
                      bindings={{
                        availableFilters,
                        activeFilters,
                      }}
                    />
                  )}
                  {angularInstance && (
                    <AngularWrapper
                      moduleName="dpDataSelectionAvailableFiltersWrapper"
                      component="dpDataSelectionAvailableFilters"
                      dependencies={['atlas']}
                      angularInstance={angularInstance}
                      bindings={{
                        availableFilters,
                        activeFilters,
                      }}
                      interpolateBindings={{
                        dataset,
                      }}
                    />
                  )}
                </div>
              )}
              <div className={widthClass}>
                {showMessageMaxPages && (
                  <StyledAlert level={NotificationLevel.Attention} compact dismissible>
                    <Heading forwardedAs="h3">Deze pagina kan niet worden getoond</Heading>
                    <Paragraph>
                      {`Alleen de eerste ${MAX_AVAILABLE_PAGES} pagina's kunnen worden weergegeven
                        (om technische redenen). Bij downloaden worden wel alle resultaten
                        opgenomen.`}
                    </Paragraph>
                    <Paragraph>
                      Tip: Gebruik de download-knop om alle resultaten te bekijken. Of voeg meer
                      filtercriteria toe voor specifiekere resultaten.
                    </Paragraph>
                  </StyledAlert>
                )}
                {showMessageClusteredMarkers && (
                  <StyledAlert level={NotificationLevel.Attention} compact>
                    <Paragraph>
                      {`Deze resultaten worden niet getoond op de kaart, omdat deze niet meer dan ${MAX_NUMBER_OF_CLUSTERED_MARKERS.toLocaleString(
                        DEFAULT_LOCALE,
                      )} resultaten tegelijk kan weergeven (om technische redenen).`}
                    </Paragraph>
                    <Paragraph>
                      Tip: Bekijk de lijst resultaten in kleinere delen. Dit kan door een voor een
                      filtercriteria toe te voegen (bijv. de verschillende wijken uit de selectie).
                    </Paragraph>
                  </StyledAlert>
                )}

                {numberOfRecords > 0 ? (
                  <div>
                    {view === VIEW_MODE.FULL && <DataSelectionTable content={data} />}
                    {view === VIEW_MODE.SPLIT && <DataSelectionList content={data} />}
                    {angularInstance && (
                      <AngularWrapper
                        moduleName="dpDataSelectionPaginationWrapper"
                        component="dpDataSelectionPagination"
                        dependencies={['atlas']}
                        angularInstance={angularInstance}
                        bindings={{
                          currentPage,
                          numberOfPages,
                          setPage,
                        }}
                      />
                    )}
                    {view === VIEW_MODE.FULL && (
                      <div className="u-row">
                        <div className="u-col-sm--12">
                          <div className="u-margin__top--4">
                            <ShareBar />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        )}
        {!isLoading && (authError || authScopeError) && (
          <Alert level={NotificationLevel.Attention} compact dismissible>
            <Paragraph>
              {datasetScope === SCOPES['BRK/RSN']
                ? `Medewerkers met speciale bevoegdheden kunnen inloggen om kadastrale objecten met
            zakelijk rechthebbenden te bekijken. `
                : `Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken. `}
            </Paragraph>
            <LoginLinkContainer />
          </Alert>
        )}
      </div>
    </div>
  )
}

DataSelection.defaultProps = {
  results: {},
}

DataSelection.propTypes = {
  view: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  dataset: PropTypes.string.isRequired,
  activeFilters: PropTypes.shape({}).isRequired,
  geometryFilter: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  userScopes: PropTypes.arrayOf(PropTypes.string).isRequired,
  authError: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  results: PropTypes.shape({
    numberOfRecords: PropTypes.number,
    filters: PropTypes.arrayOf(PropTypes.object),
    numberOfPages: PropTypes.number,
    data: PropTypes.object,
  }),
}

export default DataSelection
