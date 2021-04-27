import React, { useCallback } from 'react'
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
  const handleOnChangeType = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value as DataSelectionType
    trackEvent({
      category: 'dataselection',
      action: 'dropdown',
      name: config[selectedOption].title,
    })
    history.push({
      pathname: config[currentDatasetType.toUpperCase()].path,
      search: location.search,
    })
  }, [])

  return (
    <>
      <StyledLabel htmlFor="sort-select" label="Type:" position="left" />
      <StyledSelect
        id="sort-select"
        data-testid="sort-select"
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
