import React from 'react'
import { RadioGroup, Radio, Label } from '@datapunt/asc-ui'
import { FilterProps } from '../models'
import { getOptionValue, formatOptionLabel, formatAllOptionLabel } from '../utils'

const RadioFilter: React.FC<FilterProps> = ({
  type,
  options,
  totalCount,
  hideCount,
  selection,
  onSelectionChange,
}) => {
  function onChange(event: React.FormEvent<HTMLInputElement>) {
    const { value: changedValue } = event.currentTarget

    if (changedValue === '') {
      onSelectionChange([])
    } else {
      onSelectionChange([changedValue])
    }
  }

  const allControlId = `${type}-all`

  return (
    <RadioGroup name={type}>
      <Label htmlFor={allControlId} label={formatAllOptionLabel(totalCount, hideCount)}>
        <Radio id={allControlId} value="" checked={selection.length === 0} onChange={onChange} />
      </Label>
      {options.map(option => {
        const controlId = `${type}-${option.id}`
        const value = getOptionValue(option)

        return (
          <Label key={controlId} htmlFor={controlId} label={formatOptionLabel(option, hideCount)}>
            <Radio
              id={controlId}
              value={value}
              checked={selection.includes(value)}
              onChange={onChange}
            />
          </Label>
        )
      })}
    </RadioGroup>
  )
}

export default RadioFilter
