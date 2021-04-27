import { MapPanelContent } from '@amsterdam/arm-core'
import usePromise, { isPending, isRejected } from '@amsterdam/use-promise'
import { Table } from '@amsterdam/asc-assets'
import {
  Alert,
  Button,
  CompactPager,
  Heading,
  Link,
  themeSpacing,
  useMatchMedia,
} from '@amsterdam/asc-ui'
import { Link as RouterLink, useHistory } from 'react-router-dom'
import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react'
import ReduxRouterLink from 'redux-first-router-link'
import styled, { createGlobalStyle } from 'styled-components'
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner'
import config, { DataSelectionType } from '../../config'
import { Overlay } from '../../types'
import { useDataSelectionContext } from './DataSelectionContext'
import { routing } from '../../../../routes'
import useBuildQueryString from '../../../../utils/useBuildQueryString'
import {
  drawToolOpenParam,
  polygonParam,
  polylineParam,
  ViewMode,
  viewParam,
} from '../../query-params'
import useParam from '../../../../utils/useParam'
import useLegacyDataselectionConfig from '../../../../components/DataSelection/useLegacyDataselectionConfig'
import { fetchWithToken } from '../../../../../shared/services/api/api'
import { normalizeData } from './normalize'
import DataSelectionSelectBox from './DataSelectionSelectBox'
import GeneralErrorAlert from '../../../../components/Alerts/GeneralErrorAlert'

const ResultLink = styled(ReduxRouterLink)`
  width: 100%;
  margin-bottom: ${themeSpacing(2)};
`

const StyledMapPanelContent = styled(MapPanelContent)`
  width: 100%;
  height: 100%;
`

const GlobalStyle = createGlobalStyle`
.arm-highlight-icon {
  z-index: 999 !important;
}
`

const StyledCompactPager = styled(CompactPager)`
  margin-top: ${themeSpacing(5)};
  width: 100%;
`

const ResultsHeading = styled(Heading)`
  margin: ${themeSpacing(2)} 0;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const TableRouterLink = styled(RouterLink)`
  flex-shrink: 0;
`

const StyledAlert = styled(Alert)`
  margin-top: ${themeSpacing(2)};
`

export interface DrawResultsProps {
  currentOverlay: Overlay
}

const Results: FunctionComponent<{
  setTotalResults: Dispatch<SetStateAction<number | undefined>>
}> = ({ setTotalResults }) => {
  const [paginationPage, setPaginationPage] = useState(1)
  const [polygon] = useParam(polygonParam)
  const { currentDatasetType, currentDatasetConfig } = useLegacyDataselectionConfig()

  const result = usePromise(async () => {
    if (polygon?.polygon) {
      const searchParams = new URLSearchParams({
        shape: JSON.stringify(polygon?.polygon.map(({ lat, lng }) => [lng, lat])),
        size: '20',
        page: paginationPage.toString(),
      })

      const data = await fetchWithToken(
        `${
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          config[currentDatasetType.toUpperCase()]?.endpointData ?? ''
        }?${searchParams.toString()}`,
      )
      const normalizedResults = normalizeData(
        currentDatasetType.toUpperCase() as DataSelectionType,
        data,
      )
      setTotalResults(normalizedResults.totalCount)
      return normalizedResults
    }
    return { results: [], totalCount: 0 }
  }, [polygon, currentDatasetConfig, currentDatasetType, paginationPage, setTotalResults])

  if (isPending(result)) {
    return <LoadingSpinner size={30} />
  }

  if (isRejected(result)) {
    return <GeneralErrorAlert />
  }

  return (
    <>
      {result.value.results.map(({ id: locationId, name: locationName }) => (
        <Link
          to={config[currentDatasetType.toUpperCase()].toDetailAction(locationId)}
          as={ResultLink}
          inList
          key={locationId}
        >
          {locationName}
        </Link>
      ))}
      {result.value.totalCount > 20 && (
        <StyledCompactPager
          page={paginationPage}
          pageSize={20}
          collectionSize={result.value.totalCount}
          onPageChange={setPaginationPage}
        />
      )}
    </>
  )
}

const DrawResults: FunctionComponent<DrawResultsProps> = ({ currentOverlay }) => {
  const { distanceText } = useDataSelectionContext()
  const history = useHistory()
  const [totalResults, setTotalResults] = useState<number>()

  const [showDesktopVariant] = useMatchMedia({ minBreakpoint: 'tabletM' })

  const { currentDatasetType } = useLegacyDataselectionConfig()

  const { buildQueryString } = useBuildQueryString()

  return (
    <StyledMapPanelContent
      title={totalResults ? `Resultaten: ${totalResults}` : null}
      animate
      stackOrder={currentOverlay === Overlay.Results ? 2 : 1}
      onClose={() => {
        history.push({
          pathname: routing.dataSearchGeo_TEMP.path,
          search: buildQueryString(undefined, [polylineParam, polygonParam, drawToolOpenParam]),
        })
      }}
    >
      <GlobalStyle />

      <Wrapper>
        <DataSelectionSelectBox />

        <Button
          as={TableRouterLink}
          variant="primaryInverted"
          type="button"
          title="Resultaten in tabel weergeven"
          /* @ts-ignore */
          to={{
            pathname: config[currentDatasetType.toUpperCase()].path,
            search: buildQueryString([[viewParam, ViewMode.Full]]),
          }}
          {...(showDesktopVariant
            ? { iconLeft: <Table /> }
            : { icon: <Table />, iconSize: 25, size: 40 })}
        >
          {showDesktopVariant && 'Tabel weergeven'}
        </Button>
      </Wrapper>

      {distanceText && (
        // @ts-ignore
        <ResultsHeading as="h5" styleAs="h3">
          Locatie: ingetekend ({distanceText})
        </ResultsHeading>
      )}
      <Results setTotalResults={setTotalResults} />
      {totalResults === 0 && <StyledAlert level="info">Er zijn geen resultaten</StyledAlert>}
    </StyledMapPanelContent>
  )
}

export default DrawResults
