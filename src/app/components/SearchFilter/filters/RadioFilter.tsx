import { Label, Radio, RadioGroup } from '@amsterdam/asc-ui'
import React from 'react'
import { FilterProps } from '../models'
import { formatAllOptionLabel, formatOptionLabel } from '../utils'

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
        <Radio
          id={allControlId}
          value=""
          variant="primary"
          checked={selection.length === 0}
          onChange={onChange}
        />
      </Label>
      {options.map((option) => {
        const controlId = `${type}-${option.id}`

        return (
          <Label key={controlId} htmlFor={controlId} label={formatOptionLabel(option, hideCount)}>
            <Radio
              id={controlId}
              value={option.id}
              variant="primary"
              checked={selection.includes(option.id)}
              onChange={onChange}
            />
          </Label>
        )
      })}
    </RadioGroup>
  )
}

export default RadioFilter
