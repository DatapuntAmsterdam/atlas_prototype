import { Alert, Container, Heading, Paragraph, themeSpacing } from '@amsterdam/asc-ui'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import usePromise, { isPending, isRejected } from '@amsterdam/use-promise'
import styled from 'styled-components'
import { FunctionComponent } from 'react'
import { getDataSelectionPage } from '../../../shared/ducks/data-selection/selectors'
import DataSelectionActiveFilters from './DataSelectionActiveFilters'
import { ViewMode, viewParam } from '../../pages/MapPage/query-params'
import useParam from '../../utils/useParam'
import LoginLink from '../Links/LoginLink/LoginLink'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import ShareBar from '../ShareBar/ShareBar'
import DataSelectionList from './DataSelectionList'
import DataSelectionTable from './DataSelectionTable'
import LegacyPagination from './LegacyPagination'
import DataSelectionFilters from './DataSelectionFilters'
import DataSelectionSbiFilters from './DataSelectionSbiFilters'
import useFetchLegacyDataSelectionData from './useFetchLegacyDataSelectionData'
import { useDataSelection } from './DataSelectionContext'
import DataSelectionHeader from './DataSelectionHeader'
import { AuthError } from '../../../shared/services/api/customError'
import useFetchLegacyDataSelectionMarkers from './useFetchLegacyDataSelectionMarkers'

const StyledAlert = styled(Alert)`
  margin-bottom: ${themeSpacing(5)};
`

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  margin: ${themeSpacing(4, 0)};
  padding: ${themeSpacing(0, 4)};
`

const DataSelectionContent: FunctionComponent = () => {
  const [view] = useParam(viewParam)
  const page = useSelector(getDataSelectionPage)
  const { activeFilters, totalResults } = useDataSelection()
  const { fetchData } = useFetchLegacyDataSelectionData()
  const { fetchMarkers } = useFetchLegacyDataSelectionMarkers()

  const result = usePromise((signal) => fetchData(signal), [
    view, // view can change: table or map view AKA Full or Split mode
    page, // Pagination page
    activeFilters, // Enabling or disabling filters
  ])

  usePromise((signal) => fetchMarkers(signal), [result])

  if (isPending(result)) {
    return <LoadingSpinner />
  }

  if (isRejected(result)) {
    if (result.reason instanceof AuthError) {
      return (
        <Alert level="info" dismissible>
          <Paragraph>{result.reason.message}</Paragraph>
          <LoginLink />
        </Alert>
      )
    }

    return (
      <Alert level="warning" dismissible>
        {result.reason.message}
      </Alert>
    )
  }

  const {
    numberOfPages,
    data,
    showSbiFilers,
    messageMaxPages,
    messageClusteredMarkers,
  } = result.value

  const showFilters = view === ViewMode.Full && totalResults > 0
  return (
    <>
      <DataSelectionActiveFilters />

      {!totalResults && (
        <>
          <Paragraph>Geen resultaten van deze soort</Paragraph>
          <Paragraph>Tip: verwijder een of meer criteria</Paragraph>
        </>
      )}

      <div className="u-grid qa-data-grid">
        <div className="u-row">
          {showFilters && (
            <div className="u-col-sm--3 c-data-selection__available-filters">
              {showSbiFilers && <DataSelectionSbiFilters />}
              <DataSelectionFilters />
            </div>
          )}
          <div
            className={classNames({
              'u-col-sm--12': !showFilters,
              'u-col-sm--9': showFilters,
            })}
          >
            {messageMaxPages && (
              <StyledAlert level="info" dismissible>
                <Heading forwardedAs="h3">Deze pagina kan niet worden getoond</Heading>
                <Paragraph>{messageMaxPages}</Paragraph>
                <Paragraph>
                  Tip: Gebruik de download-knop om alle resultaten te bekijken. Of voeg meer
                  filtercriteria toe voor specifiekere resultaten.
                </Paragraph>
              </StyledAlert>
            )}
            {messageClusteredMarkers && (
              <StyledAlert level="info">
                <Paragraph>{messageClusteredMarkers}</Paragraph>
                <Paragraph>
                  Tip: Bekijk de lijst resultaten in kleinere delen. Dit kan door een voor een
                  filtercriteria toe te voegen (bijv. de verschillende wijken uit de selectie).
                </Paragraph>
              </StyledAlert>
            )}

            {totalResults > 0 ? (
              <div>
                {view === ViewMode.Full && <DataSelectionTable content={data} />}
                {view === ViewMode.Split && <DataSelectionList content={data} />}
                <LegacyPagination currentPage={page} numberOfPages={numberOfPages} />
                {view === ViewMode.Full && (
                  <div className="u-row">
                    <div className="u-col-sm--12">
                      <div className="u-margin__top--4">
                        <ShareBar />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}

const DataSelection = () => (
  <StyledContainer className="c-data-selection">
    <div className="c-data-selection-content qa-data-selection-content">
      <DataSelectionHeader />
      <DataSelectionContent />
    </div>
  </StyledContainer>
)

export default DataSelection
