import { Download } from '@amsterdam/asc-assets'
import { Button, themeSpacing } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { FunctionComponent, useMemo } from 'react'
import styled from 'styled-components'
import environment from '../../../environment'
import { getAccessToken } from '../../../shared/services/auth/auth'
import DATA_SELECTION_CONFIG from '../../../shared/services/data-selection/data-selection-config'
import joinUrl from '../../utils/joinUrl'
import type { ActiveFilter } from './types'
import { DatasetType } from './types'

export interface DataSelectionDownloadButtonProps {
  dataset: DatasetType
  activeFilters: ActiveFilter[]
}

const StyledButton = styled(Button)`
  margin-left: ${themeSpacing(4)};
`

export const DOWNLOAD_BUTTON_TEST_ID = 'dataSelectionDownloadButton'

const DataSelectionDownloadButton: FunctionComponent<DataSelectionDownloadButtonProps> = ({
  dataset,
  activeFilters,
}) => {
  const { trackEvent } = useMatomo()
  const downloadUrl = useMemo(() => {
    const url = new URL(
      joinUrl(
        [environment.API_ROOT, DATA_SELECTION_CONFIG.datasets[dataset].ENDPOINT_EXPORT ?? ''],
        true,
      ),
    )

    const filters = DATA_SELECTION_CONFIG.datasets[dataset].FILTERS

    filters.forEach((filter) => {
      const activeFilter = activeFilters.find(({ key }) => key === filter.slug)

      if (activeFilter) {
        url.searchParams.set(filter.slug, activeFilter.value)
      }
    })

    const shape = activeFilters.find(({ key }) => key === 'shape')

    if (shape) {
      url.searchParams.set('shape', shape.value)
    }

    const exportParam = DATA_SELECTION_CONFIG.datasets[dataset].ENDPOINT_EXPORT_PARAM

    if (dataset === DatasetType.Hr && exportParam) {
      url.searchParams.set(...exportParam)
    }

    const token = getAccessToken()

    if (token) {
      url.searchParams.set('access_token', token)
    }

    return url.toString()
  }, [dataset, activeFilters])

  return (
    <StyledButton
      data-testid={DOWNLOAD_BUTTON_TEST_ID}
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
