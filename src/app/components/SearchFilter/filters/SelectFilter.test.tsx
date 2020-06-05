import { cleanup, fireEvent, render } from '@testing-library/react'
import React from 'react'
import { FilterOption } from '../../../models/filter'
import { FilterProps } from '../models'
import SelectFilter from './SelectFilter'

describe('SelectFilter', () => {
  beforeEach(cleanup)

  const defaultProps = {
    type: 'test',
    options: [],
    totalCount: 999,
    hideCount: true,
    selection: [],
  }

  const options: FilterOption[] = [
    { id: 'first', label: 'First', count: 0 },
    { id: 'second', label: 'Second', count: 0 },
    { id: 'last', label: 'Last', count: 0 },
  ]

  it('should render an option to disable the filter and select it by default', () => {
    const props: FilterProps = { ...defaultProps, onSelectionChange: () => {} }
    const { getAllByText } = render(<SelectFilter {...props} />)
    const node = getAllByText('Alles')[0] as HTMLOptionElement

    expect(node.tagName).toEqual('OPTION')
    expect(node.getAttribute('value')).toEqual('')
    expect(node.selected).toEqual(true)
  })

  it('should render a list of options without selection', () => {
    const props: FilterProps = { ...defaultProps, options, onSelectionChange: () => {} }
    const { getAllByText } = render(<SelectFilter {...props} />)

    const firstNode = getAllByText('First')[0] as HTMLOptionElement
    const secondNode = getAllByText('Second')[0] as HTMLOptionElement
    const lastNode = getAllByText('Last')[0] as HTMLOptionElement
    ;[firstNode, secondNode, lastNode].forEach((node, index) => {
      const option = options[index]

      expect(node.tagName).toEqual('OPTION')
      expect(node.getAttribute('value')).toEqual(option.id)
      expect(node.selected).toEqual(false)
    })
  })

  it('should render a list of options with selection', () => {
    const selection = ['second']
    const props: FilterProps = { ...defaultProps, options, selection, onSelectionChange: () => {} }
    const { getAllByText } = render(<SelectFilter {...props} />)
    const secondNode = getAllByText('Second')[0] as HTMLOptionElement

    expect(secondNode.selected).toEqual(true)
  })

  it('should handle changes in selection', () => {
    const selection = ['first']
    const selectionChangeMock = jest.fn()
    const props: FilterProps = {
      ...defaultProps,
      options,
      selection,
      onSelectionChange: selectionChangeMock,
    }
    const { getByTestId } = render(<SelectFilter {...props} />)
    const selectNode = getByTestId('test')

    fireEvent.change(selectNode, { target: { value: 'last' } })

    expect(selectionChangeMock).toHaveBeenCalledWith(['last'])
  })

  it('should handle changes in selection to the default', () => {
    const selection = ['first']
    const selectionChangeMock = jest.fn()
    const props: FilterProps = {
      ...defaultProps,
      options,
      selection,
      onSelectionChange: selectionChangeMock,
    }
    const { getByTestId } = render(<SelectFilter {...props} />)
    const selectNode = getByTestId('test')

    fireEvent.change(selectNode, { target: { value: '' } })

    expect(selectionChangeMock).toHaveBeenCalledWith([])
  })
})
