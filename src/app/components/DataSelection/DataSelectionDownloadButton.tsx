import { useSelector } from 'react-redux'
import { Button, themeSpacing } from '@amsterdam/asc-ui'
import { Download } from '@amsterdam/asc-assets'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import environment from '../../../environment'
import DATA_SELECTION_CONFIG from '../../../shared/services/data-selection/data-selection-config'
import { encodeQueryParams } from '../../../shared/services/query-string-parser/query-string-parser'
import { getAccessToken } from '../../../shared/services/auth/auth'
import { getGeometryFilter } from '../../../shared/ducks/data-selection/selectors'
import { ActiveFilter, DatasetType } from './types'

export interface DataSelectionDownloadButtonProps {
  dataset: DatasetType
  activeFilters: ActiveFilter[]
}

const StyledButton = styled(Button)`
  margin-left: ${themeSpacing(4)};
`

const DataSelectionDownloadButton: FunctionComponent<DataSelectionDownloadButtonProps> = ({
  dataset,
  activeFilters,
}) => {
  const geometryFilter = useSelector(getGeometryFilter)
  const { trackEvent } = useMatomo()
  const filterParams = []
  let url = `${environment.API_ROOT}${
    DATA_SELECTION_CONFIG.datasets[dataset].ENDPOINT_EXPORT ?? ''
  }`

  DATA_SELECTION_CONFIG.datasets[dataset].FILTERS.forEach((filter: { slug: string }) => {
    if (typeof activeFilters[filter.slug] === 'string') {
      filterParams.push(`${filter.slug}=${window.encodeURIComponent(activeFilters[filter.slug])}`)
    }
  })

  if (geometryFilter?.markers !== undefined) {
    filterParams.push(
      // @ts-ignore
      `shape=${JSON.stringify(geometryFilter.markers.map(([lat, lng]) => [lng, lat]))}`,
    )
  }

  if (dataset === DatasetType.Hr) {
    filterParams.push(DATA_SELECTION_CONFIG.datasets[dataset].ENDPOINT_EXPORT_PARAM)
  }

  if (filterParams.length) {
    url += `?${filterParams.join('&')}`
  }

  const token = getAccessToken()

  const params = {}
  if (token) {
    // @ts-ignore
    params.access_token = token
  }

  const queryStart = url.indexOf('?') !== -1 ? '&' : '?'
  const paramString = encodeQueryParams(params)
  const queryString = paramString ? queryStart + paramString : ''
  const downloadUrl = `${url}${queryString}`

  return (
    <StyledButton
      forwardedAs="a"
      variant="primary"
      href={downloadUrl}
      iconSize={21}
      iconLeft={<Download />}
      onClick={() => {
        trackEvent({
          category: 'Download-tabel',
          action: `dataselectie-download-${DATA_SELECTION_CONFIG.datasets[
            dataset
          ].TITLE.toLowerCase()}`,
        })
      }}
      title="Downloaden als kommagescheiden bestand"
    >
      Downloaden
    </StyledButton>
  )
}

export default DataSelectionDownloadButton
