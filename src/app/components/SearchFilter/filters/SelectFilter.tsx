import React from 'react'
import { Select } from '@datapunt/asc-ui'
import { FilterProps } from '../models'
import { formatOptionLabel, formatAllOptionLabel } from '../utils'

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

        return (
          <option key={controlId} value={option.id} selected={selection.includes(option.id)}>
            {formatOptionLabel(option, hideCount)}
          </option>
        )
      })}
    </Select>
  )
}

export default SelectFilter
