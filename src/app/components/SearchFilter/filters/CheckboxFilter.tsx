import { Checkbox, Label } from '@amsterdam/asc-ui'
import type { FunctionComponent } from 'react'
import type { FilterProps } from '../models'
import { formatOptionLabel } from '../utils'

const CheckboxFilter: FunctionComponent<FilterProps> = ({
  type,
  options,
  hideCount,
  selection,
  onSelectionChange,
}) => {
  function onChange(event: React.FormEvent<HTMLInputElement>) {
    const { value: changedValue } = event.currentTarget
    const newSelection = selection.includes(changedValue)
      ? selection.filter((value) => value !== changedValue)
      : [...selection, changedValue]

    onSelectionChange(newSelection)
  }

  return (
    <>
      {options.map((option) => {
        const controlId = `${type}-${option.id}`

        return (
          <Label key={controlId} htmlFor={controlId} label={formatOptionLabel(option, hideCount)}>
            <Checkbox
              id={controlId}
              variant="primary"
              checked={selection.includes(option.id)}
              onChange={onChange}
              {...({ value: option.id } as any)}
            />
          </Label>
        )
      })}
    </>
  )
}

export default CheckboxFilter
