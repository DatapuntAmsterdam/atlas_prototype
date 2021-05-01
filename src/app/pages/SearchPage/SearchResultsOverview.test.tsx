import { screen, render } from '@testing-library/react'
import SearchResultsOverview from './SearchResultsOverview'
import withAppContext from '../../utils/withAppContext'
import { ERROR_MESSAGE_TEST_ID } from '../../components/ErrorMessage/ErrorMessage'

jest.mock('./config', () => ({
  foo: {
    label: 'This is foo',
    to: jest.fn(),
    resolver: 'foo',
    type: 'foo',
    component: () => <div data-testid="componentFoo" />,
  },
  foo2: {
    label: 'This is foo2',
    to: jest.fn(),
    resolver: 'foo2',
    type: 'foo2',
    component: () => <div data-testid="componentFoo2" />,
  },
}))

describe('SearchResultsOverview', () => {
  it('should render NoSearchResults component when no results are given', () => {
    const { rerender } = render(
      <SearchResultsOverview
        loading={false}
        totalCount={0}
        query="some query"
        results={[]}
        errors={[]}
      />,
    )

    expect(screen.getByTestId('noSearchResults')).toBeInTheDocument()

    rerender(
      <SearchResultsOverview
        loading={false}
        totalCount={0}
        query="some query"
        errors={[]}
        results={[
          {
            results: [],
          },
        ]}
      />,
    )

    expect(screen.getByTestId('noSearchResults')).toBeInTheDocument()
  })

  describe('with results', () => {
    const mockTypes = ['foo', 'foo2']

    const mockResults = mockTypes.map((type) => ({
      key: type,
      totalCount: 1,
      results: [{ id: 'foo' }],
    }))

    it('renders correct number of components', () => {
      render(
        withAppContext(
          <SearchResultsOverview
            loading={false}
            query="some query"
            results={mockResults}
            totalCount={1}
            errors={[]}
          />,
        ),
      )

      expect(screen.queryAllByTestId('searchResultItem').length).toBe(mockTypes.length)
    })

    it('renders the components for each type', () => {
      render(
        withAppContext(
          <SearchResultsOverview
            loading={false}
            query="some query"
            results={mockResults}
            totalCount={3}
            errors={[]}
          />,
        ),
      )

      const searchHeading = screen.getAllByTestId('searchHeading')
      // Heading
      expect(searchHeading.length).toBe(2)
      expect(searchHeading[0]).toHaveTextContent('This is foo (1)')
      expect(searchHeading[1]).toHaveTextContent('This is foo2 (1)')

      // Results body
      expect(screen.getByTestId('componentFoo')).toBeInTheDocument()
      expect(screen.getByTestId('componentFoo2')).toBeInTheDocument()

      // Links
      expect(screen.getAllByTestId('searchLink')[0]).toHaveTextContent(
        "Resultaten tonen binnen de categorie 'This is foo'",
      )

      expect(screen.getAllByTestId('searchLink')[1]).toHaveTextContent(
        "Resultaten tonen binnen de categorie 'This is foo2'",
      )
    })

    it('renders an error message when needed', () => {
      const mockErrors = [{ message: 'Some error', path: ['foo2'] }]
      const mockResultsWithError = [{ key: 'foo2', totalCount: 0, results: [] }]

      render(
        withAppContext(
          <SearchResultsOverview
            query="some query"
            loading={false}
            results={mockResultsWithError}
            errors={mockErrors}
            totalCount={1}
          />,
        ),
      )

      expect(screen.getByTestId(ERROR_MESSAGE_TEST_ID)).toBeInTheDocument()
    })
  })
})
