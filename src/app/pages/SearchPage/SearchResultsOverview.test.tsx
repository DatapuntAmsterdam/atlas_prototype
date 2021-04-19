import { render } from '@testing-library/react'
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
    const { getByTestId, rerender } = render(
      <SearchResultsOverview
        loading={false}
        totalCount={0}
        query="some query"
        results={[]}
        errors={[]}
      />,
    )

    expect(getByTestId('noSearchResults')).toBeDefined()

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

    expect(getByTestId('noSearchResults')).toBeDefined()
  })

  describe('with results', () => {
    const mockTypes = ['foo', 'foo2']

    const mockResults = mockTypes.map((type) => ({
      key: type,
      totalCount: 1,
      results: [{ id: 'foo' }],
    }))

    it('renders correct number of components', () => {
      const { queryAllByTestId } = render(
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

      expect(queryAllByTestId('searchResultItem').length).toBe(mockTypes.length)
    })

    it('renders the components for each type', () => {
      const { getAllByTestId, getByTestId } = render(
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

      const searchHeading = getAllByTestId('searchHeading')
      // Heading
      expect(searchHeading.length).toBe(2)
      expect(searchHeading[0].textContent).toContain('This is foo (1)')
      expect(searchHeading[1].textContent).toContain('This is foo2 (1)')

      // Results body
      expect(getByTestId('componentFoo')).toBeDefined()
      expect(getByTestId('componentFoo2')).toBeDefined()

      // Links
      expect(getAllByTestId('searchLink')[0].textContent).toContain(
        "Resultaten tonen binnen de categorie 'This is foo'",
      )

      expect(getAllByTestId('searchLink')[1].textContent).toContain(
        "Resultaten tonen binnen de categorie 'This is foo2'",
      )
    })

    it('renders an error message when needed', () => {
      const mockErrors = [{ message: 'Some error', path: ['foo2'] }]
      const mockResultsWithError = [{ key: 'foo2', totalCount: 0, results: [] }]

      const { getByTestId } = render(
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

      expect(getByTestId(ERROR_MESSAGE_TEST_ID)).toBeDefined()
    })
  })
})
