import { ChangeEvent, useCallback } from 'react'
import styled from 'styled-components'
import { breakpoint, Label, Select } from '@amsterdam/asc-ui'
import { useLocation, useHistory } from 'react-router-dom'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import useLegacyDataselectionConfig from '../../../../components/DataSelection/useLegacyDataselectionConfig'
import config, { DataSelectionType } from '../../config'

const StyledSelect = styled(Select)`
  @media screen and ${breakpoint('min-width', 'tabletS')} {
    min-height: 44px;
  }
`
const StyledLabel = styled(Label)`
  display: none;
  & + * {
    margin-right: 10px;
  }
`

const DataSelectionSelectBox = () => {
  const location = useLocation()
  const history = useHistory()
  const { trackEvent } = useMatomo()
  const { currentDatasetType } = useLegacyDataselectionConfig()
  const handleOnChangeType = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value as DataSelectionType
    trackEvent({
      category: 'dataselection',
      action: 'dropdown',
      name: config[selectedOption].title,
    })
    history.push({
      pathname: config[selectedOption].path,
      search: location.search,
    })
  }, [])

  if (!currentDatasetType) {
    // eslint-disable-next-line no-console
    console.warn('DataSelectionSelectBox should be only used on dataselection pages')
    return null
  }

  return (
    <>
      <StyledLabel htmlFor="dataSelectionSelectBox" label="Type:" position="left" />
      <StyledSelect
        id="dataSelectionSelectBox"
        data-testid="dataSelectionSelectBox"
        value={currentDatasetType.toUpperCase()}
        onChange={handleOnChangeType}
      >
        {Object.entries(config).map(([dataSelectionType, { title }]) => (
          <option key={dataSelectionType} value={dataSelectionType}>
            {title}
          </option>
        ))}
      </StyledSelect>
    </>
  )
}

export default DataSelectionSelectBox
