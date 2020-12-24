import { shallow } from 'enzyme'
import SearchResultsOverview from './SearchResultsOverview'

jest.mock('./config', () => ({
  foo: {
    label: 'This is foo',
    to: jest.fn(),
    resolver: 'foo',
    type: 'foo',
  },
  foo2: {
    label: 'This is foo2',
    to: jest.fn(),
    resolver: 'foo2',
    type: 'foo2',
  },
}))

describe('SearchResultsOverview', () => {
  describe('should render the correct results component for the search page ', () => {
    let component

    it('when no results', () => {
      component = shallow(<SearchResultsOverview results={[]} />)

      expect(component.find(`[data-test='NoSearchResults']`).exists()).toBeTruthy()
    })

    it('when no results for each type', () => {
      component = shallow(
        <SearchResultsOverview
          results={[
            {
              results: [],
            },
          ]}
          errors={[]}
        />,
      )

      expect(component).toEqual({})
    })

    describe('when results for each type', () => {
      const mockTypes = ['foo', 'foo2']

      const mockResults = mockTypes.map((type) => ({
        key: type,
        totalCount: 1,
        results: [{ id: 'foo' }],
      }))

      it('renders correct number of components', () => {
        component = shallow(
          <SearchResultsOverview results={mockResults} totalCount={1} errors={[]} />,
        )

        expect(component.length).toBe(mockTypes.length)
      })

      it('renders the components for each type', () => {
        const pageType = mockTypes[mockTypes.length - 1]

        const pageComponent = component.at(mockTypes.length - 1)
        const pageResults = mockResults.find((result) => result.key === pageType)

        // Heading
        expect(pageComponent.find('SearchHeading').exists()).toBeTruthy()
        expect(pageComponent.find('SearchHeading').props().label).toContain(pageType)
        expect(pageComponent.find('SearchHeading').props().label).toContain(pageResults.totalCount)

        // Results body
        expect(pageComponent.find(`[data-test="${pageType}"]`).exists()).toBeTruthy()

        // Link
        expect(pageComponent.find('SearchLink').exists()).toBeTruthy()
        expect(pageComponent.find('SearchLink').props().label).toContain(pageType)
      })

      it('renders an error message when needed', () => {
        const mockErrors = [{ message: 'Some error', path: ['foo2'] }]
        const mockResultsWithError = [{ key: 'foo2', totalCount: 0, results: [] }]

        component = shallow(
          <SearchResultsOverview
            results={mockResultsWithError}
            errors={mockErrors}
            totalCount={1}
          />,
        )

        expect(component.find('ErrorMessage').exists()).toBeTruthy()
      })
    })
  })
})
