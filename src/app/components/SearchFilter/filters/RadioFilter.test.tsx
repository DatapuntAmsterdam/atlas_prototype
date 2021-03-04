import { cleanup, fireEvent, render } from '@testing-library/react'
import { FilterOption } from '../../../models/filter'
import { FilterProps } from '../models'
import RadioFilter from './RadioFilter'

describe('RadioFilter', () => {
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

  it('renders an option to disable the filter and select it by default', () => {
    const { getByLabelText } = render(<RadioFilter {...defaultProps} />)

    const node = getByLabelText('Alles') as HTMLInputElement

    expect(node.tagName).toEqual('INPUT')
    expect(node.type).toEqual('radio')
    expect(node.getAttribute('value')).toEqual('')
    expect(node.checked).toEqual(true)
  })

  it('renders a list of options without selection', () => {
    const props: FilterProps = { ...defaultProps, options }
    const { getByLabelText } = render(<RadioFilter {...props} />)

    const firstNode = getByLabelText('First') as HTMLInputElement
    const secondNode = getByLabelText('Second') as HTMLInputElement
    const lastNode = getByLabelText('Last') as HTMLInputElement
    ;[firstNode, secondNode, lastNode].forEach((node, index) => {
      const option = options[index]

      expect(node.tagName).toEqual('INPUT')
      expect(node.type).toEqual('radio')
      expect(node.getAttribute('value')).toEqual(option.id)
      expect(node.checked).toEqual(false)
    })
  })

  it('renders a list of options with selection', () => {
    const selection = ['second']
    const props: FilterProps = { ...defaultProps, options, selection }
    const { getByLabelText } = render(<RadioFilter {...props} />)
    const secondNode = getByLabelText('Second') as HTMLInputElement

    expect(secondNode.checked).toEqual(true)
  })

  it('handles changes in selection', () => {
    const selection = ['first']
    const selectionChangeMock = jest.fn()
    const props: FilterProps = {
      ...defaultProps,
      options,
      selection,
      onSelectionChange: selectionChangeMock,
    }
    const { getByLabelText } = render(<RadioFilter {...props} />)

    fireEvent.click(getByLabelText('Last'))

    expect(selectionChangeMock).toHaveBeenCalledWith(['last'])
  })

  it('handles changes in selection to the default', () => {
    const selection = ['first']
    const selectionChangeMock = jest.fn()
    const props: FilterProps = {
      ...defaultProps,
      options,
      selection,
      onSelectionChange: selectionChangeMock,
    }
    const { getByLabelText } = render(<RadioFilter {...props} />)

    fireEvent.click(getByLabelText('Alles'))

    expect(selectionChangeMock).toHaveBeenCalledWith([])
  })

  it('shows the total count for the overview option if no selection is present', () => {
    const props: FilterProps = { ...defaultProps, options, hideCount: false }
    const { getByLabelText } = render(<RadioFilter {...props} />)

    expect(getByLabelText('Alles (999)')).toBeDefined()
  })

  it('hides the total count for the overview option if a selection is present', () => {
    const selection = ['first']
    const props: FilterProps = { ...defaultProps, options, selection, hideCount: false }
    const { getByLabelText } = render(<RadioFilter {...props} />)

    expect(getByLabelText('Alles')).toBeDefined()
  })
})
