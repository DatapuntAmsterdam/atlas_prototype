import { screen, render } from '@testing-library/react'
import DetailTable from './DetailTable'
import { DetailResultItemType } from '../../../../map/types/details'

describe('DetailTable', () => {
  it('should render a table', () => {
    render(
      <DetailTable
        item={{
          type: DetailResultItemType.Table,
          headings: [{ key: 'aKey', title: 'A heading' }],
          values: [{ aKey: 'A value' }],
        }}
      />,
    )

    expect(screen.getByTestId('detailTable')).toBeInTheDocument()
  })

  it('should show a paragraph that no results have been found', () => {
    const { container } = render(
      <DetailTable
        item={{
          type: DetailResultItemType.Table,
          headings: [{ key: 'aKey', title: 'A heading' }],
          values: [],
        }}
      />,
    )

    expect(container.firstChild?.textContent).toBe('Geen resultaten gevonden')
  })
})
