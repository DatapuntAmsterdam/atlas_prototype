import { screen, cleanup, fireEvent, render } from '@testing-library/react'
import type { FilterOption } from '../../../models/filter'
import type { FilterProps } from '../models'
import SelectFilter from './SelectFilter'

describe('SelectFilter', () => {
  beforeEach(cleanup)

  const defaultProps: FilterProps = {
    type: 'test',
    label: 'Test',
    options: [],
    totalCount: 999,
    hideCount: true,
    selection: [],
    onSelectionChange: () => {},
  }

  const options: FilterOption[] = [
    { id: 'first', label: 'First', count: 0 },
    { id: 'second', label: 'Second', count: 0 },
    { id: 'last', label: 'Last', count: 0 },
  ]

  it('should render an option to disable the filter and select it by default', () => {
    render(<SelectFilter {...defaultProps} />)
    const node = screen.getAllByText('Alles')[0] as HTMLOptionElement

    expect(node.tagName).toEqual('OPTION')
    expect(node).toHaveValue('')
    expect(node.selected).toEqual(true)
  })

  it('should render a list of options without selection', () => {
    const props: FilterProps = { ...defaultProps, options }
    render(<SelectFilter {...props} />)

    const firstNode = screen.getAllByText('First')[0] as HTMLOptionElement
    const secondNode = screen.getAllByText('Second')[0] as HTMLOptionElement
    const lastNode = screen.getAllByText('Last')[0] as HTMLOptionElement
    ;[firstNode, secondNode, lastNode].forEach((node, index) => {
      const option = options[index]

      expect(node.tagName).toEqual('OPTION')
      expect(node).toHaveValue(option.id)
      expect(node.selected).toEqual(false)
    })
  })

  it('should render a list of options with selection', () => {
    const selection = ['second']
    const props: FilterProps = { ...defaultProps, options, selection }
    render(<SelectFilter {...props} />)
    const secondNode = screen.getAllByText('Second')[0] as HTMLOptionElement

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
    render(<SelectFilter {...props} />)
    const selectNode = screen.getByTestId('test')

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
    render(<SelectFilter {...props} />)
    const selectNode = screen.getByTestId('test')

    fireEvent.change(selectNode, { target: { value: '' } })

    expect(selectionChangeMock).toHaveBeenCalledWith([])
  })
})
