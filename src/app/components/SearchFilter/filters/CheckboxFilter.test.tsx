import { screen, cleanup, fireEvent, render } from '@testing-library/react'
import type { FilterOption } from '../../../models/filter'
import type { FilterProps } from '../models'
import CheckboxFilter from './CheckboxFilter'

describe('CheckboxFilter', () => {
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

  it('should render a list of options without selection', () => {
    const props: FilterProps = { ...defaultProps, options }
    render(<CheckboxFilter {...props} />)

    const firstNode = screen.getByLabelText('First') as HTMLInputElement
    const secondNode = screen.getByLabelText('Second') as HTMLInputElement
    const lastNode = screen.getByLabelText('Last') as HTMLInputElement
    ;[firstNode, secondNode, lastNode].forEach((node, index) => {
      const option = options[index]

      expect(node.tagName).toEqual('INPUT')
      expect(node.type).toEqual('checkbox')
      expect(node.value).toBe(option.id)
      expect(node).not.toBeChecked()
    })
  })

  it('should render a list of options with selection', () => {
    const selection = ['second']
    const props: FilterProps = { ...defaultProps, options, selection }
    render(<CheckboxFilter {...props} />)
    const secondNode = screen.getByLabelText('Second') as HTMLInputElement

    expect(secondNode).toBeChecked()
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
    render(<CheckboxFilter {...props} />)

    fireEvent.click(screen.getByLabelText('Last'))

    expect(selectionChangeMock).toHaveBeenCalledWith(['first', 'last'])
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
    render(<CheckboxFilter {...props} />)

    fireEvent.click(screen.getByLabelText('First'))

    expect(selectionChangeMock).toHaveBeenCalledWith([])
  })
})
