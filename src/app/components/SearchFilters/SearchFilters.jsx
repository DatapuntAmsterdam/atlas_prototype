import React, { memo } from 'react'
import { Checkbox, Label, RadioGroup, Radio } from '@datapunt/asc-ui'
import FilterBox from '../FilterBox'

export const TYPES = {
  check: 'check',
  radio: 'radio',
}

const SearchFilters = ({
  availableFilters,
  activeFilters,
  addActiveFilter,
  removeActiveFilter,
  removeAllActiveFilters,
  hideCount,
}) => {
  const { options, label, totalCount, filterType, type } = availableFilters

  const currentFilters = (activeFilters.find(({ type: _type }) => type === _type) || {}).values

  const hasFilters = options && !!options.length
  const isRadio = filterType === 'string'

  const onChange = e => {
    const { value, checked } = e.target

    if (checked) {
      addActiveFilter(type, value, isRadio)
    } else {
      removeActiveFilter(type, value)
    }
  }

  let Wrapper = React.Fragment
  let WrapperProps = {}
  let RadioOrCheckbox = Checkbox

  if (isRadio) {
    Wrapper = RadioGroup
    WrapperProps = {
      name: `radio-group-${label.toLowerCase()}`,
    }

    RadioOrCheckbox = Radio
  }

  const isChecked = enumType => {
    if (currentFilters) {
      return Array.isArray(currentFilters)
        ? currentFilters.includes(enumType)
        : currentFilters === enumType
    }
    return false
  }

  return (
    <FilterBox label={label}>
      <Wrapper {...WrapperProps}>
        {hasFilters && (
          <>
            {isRadio && (
              <Label
                htmlFor={`type:${type}`}
                label={`Alles ${!!totalCount && !hideCount ? `(${totalCount})` : ''}`}
              >
                <Radio
                  checked={!currentFilters || !currentFilters.length}
                  variant="primary"
                  value={type}
                  onChange={() => removeAllActiveFilters(type)}
                  id={`type:${type}`}
                />
              </Label>
            )}
            {options.map(({ label: optionLabel, id, count, enumType }) => (
              <Label
                key={id}
                tabIndex={-1}
                disabled={count === 0}
                htmlFor={`type:${id}`}
                label={`${optionLabel} ${!!count && !hideCount ? `(${count})` : ''}`}
              >
                <RadioOrCheckbox
                  checked={isChecked(enumType || id)}
                  variant="primary"
                  value={enumType || id}
                  onChange={e => onChange(e, !!enumType)}
                  id={`type:${id}`}
                />
              </Label>
            ))}
          </>
        )}
      </Wrapper>
    </FilterBox>
  )
}

export default memo(SearchFilters)
