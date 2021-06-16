import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import DataCard, { DataList } from '../../components/DataCard'
import withAppContext from '../../utils/withAppContext'
import DataSearchResults, { CombinedDataResult } from './DataSearchResults'

jest.mock('../../components/DataCard')

const mockedDataCard = mocked(DataCard)
const mockedDataList = mocked(DataList)

const mockDataResult: CombinedDataResult = {
  count: 1,
  label: 'any label',
  results: [
    {
      endpoint: 'string',
      id: 'string',
      label: 'string',
      subtype: 'string',
      type: 'string',
      __typename: 'DataResult',
    },
  ],
  type: 'adressen',
  __typename: 'CombinedDataResult',
}

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
          page="1"
          withPagination={false}
          query="some query"
          compact
          results={[mockDataResult]}
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
          page="1"
          withPagination={false}
          query="some query"
          compact={false}
          results={[mockDataResult]}
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
        extensions: { code: 'UNAUTHORIZED', label: 'foo', type: 'type' },
      },
    ]

    render(
      withAppContext(
        <DataSearchResults
          page="1"
          withPagination={false}
          query="some query"
          compact={false}
          errors={errors}
          results={[
            {
              count: 1,
              results: [],
              type: 'adressen',
              label: 'some label',
              __typename: 'CombinedDataResult',
            },
          ]}
        />,
      ),
    )

    expect(screen.getByTestId('authAlert')).toBeInTheDocument()
  })

  it('shows the no results component', () => {
    const { rerender } = render(
      withAppContext(
        <DataSearchResults
          page="1"
          compact={false}
          withPagination={false}
          query="Fubar"
          results={[]}
          errors={[]}
        />,
      ),
    )

    expect(screen.getByTestId('noResults')).toBeInTheDocument()

    // Or no component at all
    rerender(
      withAppContext(
        <DataSearchResults
          page="1"
          query="Fubar"
          compact={false}
          withPagination={false}
          results={[
            {
              count: 1,
              results: [],
              type: 'adressen',
              label: 'some label',
              __typename: 'CombinedDataResult',
            },
          ]}
          errors={[]}
        />,
      ),
    )

    expect(screen.queryByTestId('noResults')).not.toBeInTheDocument()
  })
})
