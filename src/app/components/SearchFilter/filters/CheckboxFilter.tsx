import React from 'react'
import { Checkbox, Label } from '@datapunt/asc-ui'
import { FilterProps } from '../models'
import { getOptionValue, formatOptionLabel } from '../utils'

const CheckboxFilter: React.FC<FilterProps> = ({
  type,
  options,
  hideCount,
  selection,
  onSelectionChange,
}) => {
  function onChange(event: React.FormEvent<HTMLInputElement>) {
    const { value: changedValue } = event.currentTarget
    const newSelection = selection.includes(changedValue)
      ? selection.filter(value => value !== changedValue)
      : [...selection, changedValue]

    onSelectionChange(newSelection)
  }

  return (
    <>
      {options.map(option => {
        const controlId = `${type}-${option.id}`
        const value = getOptionValue(option)

        return (
          <Label key={controlId} htmlFor={controlId} label={formatOptionLabel(option, hideCount)}>
            <Checkbox
              id={controlId}
              value={value}
              checked={selection.includes(value)}
              onChange={onChange}
            />
          </Label>
        )
      })}
    </>
  )
}

export default CheckboxFilter
