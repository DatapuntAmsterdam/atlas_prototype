import React from 'react'
import { Select } from '@datapunt/asc-ui'
import { FilterProps } from '../models'
import { getOptionValue, formatOptionLabel, formatAllOptionLabel } from '../utils'

const SelectFilter: React.FC<FilterProps> = ({
  type,
  options,
  totalCount,
  hideCount,
  selection,
  onSelectionChange,
}) => {
  function onChange(event: React.FormEvent<HTMLSelectElement>) {
    const { value: changedValue } = event.currentTarget

    if (changedValue === '') {
      onSelectionChange([])
    } else {
      onSelectionChange([changedValue])
    }
  }

  return (
    <Select id={type} onChange={onChange}>
      <option key={`${type}-all`} value="" selected={selection.length === 0}>
        {formatAllOptionLabel(totalCount, hideCount)}
      </option>
      {options.map(option => {
        const controlId = `${type}-${option.id}`
        const value = getOptionValue(option)

        return (
          <option key={controlId} value={value} selected={selection.includes(value)}>
            {formatOptionLabel(option, hideCount)}
          </option>
        )
      })}
    </Select>
  )
}

export default SelectFilter
