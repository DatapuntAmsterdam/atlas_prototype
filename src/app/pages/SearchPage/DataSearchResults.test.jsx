import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import DataCard, { DataList } from '../../components/DataCard'
import withAppContext from '../../utils/withAppContext'
import DataSearchResults from './DataSearchResults'

jest.mock('../../components/DataCard')

const mockedDataCard = mocked(DataCard)
const mockedDataList = mocked(DataList)

describe('DataSearchResults', () => {
  beforeEach(() => {
    mockedDataCard.mockImplementation(({ children }) => (
      <div data-testid="dataCard">{children}</div>
    ))

    mockedDataList.mockImplementation(({ children }) => (
      <div data-testid="dataList">{children}</div>
    ))
  })

  it('shows the compact card component', () => {
    render(
      withAppContext(
        <DataSearchResults
          compact
          results={[
            {
              count: 1,
              results: [1, 2, 3],
            },
          ]}
          errors={[]}
        />,
      ),
    )

    expect(screen.queryByTestId('authAlert')).not.toBeInTheDocument()
    expect(screen.getByTestId('dataCard')).toBeInTheDocument()
  })

  it('shows the list card component', () => {
    render(
      withAppContext(
        <DataSearchResults
          results={[
            {
              count: 1,
              results: [1, 2, 3],
            },
          ]}
          errors={[]}
        />,
      ),
    )

    expect(screen.queryByTestId('authAlert')).not.toBeInTheDocument()
    expect(screen.getByTestId('dataList')).toBeInTheDocument()
  })

  it('shows the list card component with unauthorized message', () => {
    const errors = [
      {
        message: '',
        path: ['dataSearch'],
        extensions: { code: 'UNAUTHORIZED', label: 'foo' },
      },
    ]

    render(
      withAppContext(
        <DataSearchResults
          errors={errors}
          results={[
            {
              count: 1,
              type: 'foo',
              results: [],
            },
          ]}
        />,
      ),
    )

    expect(screen.getByTestId('authAlert')).toBeInTheDocument()
  })

  it('shows the no results component', () => {
    const { rerender } = render(
      withAppContext(<DataSearchResults query="Fubar" results={[]} errors={[]} />),
    )

    expect(screen.getByTestId('noResults')).toBeInTheDocument()

    // Or no component at all
    rerender(
      withAppContext(
        <DataSearchResults
          results={[
            {
              count: 1,
              results: [],
            },
          ]}
          errors={[]}
        />,
      ),
    )

    expect(screen.queryByTestId('noResults')).not.toBeInTheDocument()
  })
})
