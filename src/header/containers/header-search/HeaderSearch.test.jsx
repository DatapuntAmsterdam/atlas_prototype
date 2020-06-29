import React from 'react'
import { shallow } from 'enzyme'
import HeaderSearch from './HeaderSearch'
import { extractIdEndpoint } from '../../../store/redux-first-router/actions'
import useSlug from '../../../app/utils/useSlug'
import { CmsType } from '../../../shared/config/cms.config'
import SearchType from '../../../app/pages/SearchPage/constants'
import { MORE_RESULTS_INDEX } from '../../services/auto-suggest/auto-suggest'

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}))

jest.mock('../../../store/redux-first-router/actions')
jest.mock('../../../app/utils/useSlug')

const mockOnSpecialSearch = jest.fn()
jest.mock('../../../app/pages/SearchPage/config', () => ({
  special: {
    label: 'Special label',
    type: 'special',
    to: () => mockOnSpecialSearch,
  },
}))

describe('The HeaderSearch component', () => {
  const typedQuery = 'foo'
  const mockOnSearch = jest.fn()
  const mockOpenDataSuggestion = jest.fn()
  const mockOpenDatasetSuggestion = jest.fn()
  const mockOpenEditorialSuggestion = jest.fn()
  const mockOnSuggestionActivate = jest.fn()
  const mockOnGetSuggestions = jest.fn()

  const props = {
    typedQuery,
    view: 'split',
    onCleanDatasetOverview: jest.fn(),
    onSearch: mockOnSearch,
    openDataSuggestion: mockOpenDataSuggestion,
    openDatasetSuggestion: mockOpenDatasetSuggestion,
    openEditorialSuggestion: mockOpenEditorialSuggestion,
    onGetSuggestions: mockOnGetSuggestions,
    onSuggestionActivate: mockOnSuggestionActivate,
  }

  let component
  beforeEach(() => {
    component = shallow(<HeaderSearch {...props} />)

    extractIdEndpoint.mockImplementationOnce(() => ['id1', 'id2', 'id3'])
    useSlug.mockImplementationOnce(() => 'foo')
  })

  describe('submits the form', () => {
    it('and opens the data search tab', () => {
      const autosuggest = component.find('[data-test="search-form"]')

      autosuggest.simulate('submit', {
        preventDefault: () => {},
        stopPropagation: () => {},
      })

      expect(mockOnSearch).toHaveBeenCalledWith(typedQuery)
    })

    it('and opens the correct search page', () => {
      component = shallow(<HeaderSearch {...{ ...props, pageType: CmsType.Special }} />)
      const autosuggest = component.find('[data-test="search-form"]')

      autosuggest.simulate('submit', {
        preventDefault: () => {},
        stopPropagation: () => {},
      })

      expect(mockDispatch).toHaveBeenCalledWith(mockOnSpecialSearch)
    })
  })

  describe('selects a suggestion', () => {
    beforeEach(() => {
      component = shallow(
        <HeaderSearch
          {...{
            ...props,
            suggestions: [
              {
                content: {},
              },
            ],
          }}
        />,
      )
    })

    it('opens a data page from the suggestions', () => {
      const suggestion = {
        uri: 'foo/foo/GgCm07EqNVIpwQ',
        label: 'foo',
        index: 1,
        category: 'Straatnamen',
        type: undefined, // No type defined, so always uses data
      }

      // Find the searchbar and open it to display the autosuggest component
      const searchBar = component.find('SearchBar')
      searchBar.props().onChange({ currentTarget: typedQuery })

      // Select the suggest from autosuggest
      const autosuggest = component.find('AutoSuggest')
      autosuggest.props().onSuggestionSelection(suggestion, {
        preventDefault: () => {},
        stopPropagation: () => {},
      })

      expect(mockOpenDataSuggestion).toHaveBeenCalledWith(
        {
          category: suggestion.category,
          endpoint: suggestion.uri,
          typedQuery: 'foo',
        },
        props.view,
      )
    })

    it('opens a dataset from the suggestions', () => {
      const suggestion = {
        uri: 'dcatd/datasets/GgCm07EqNVIpwQ',
        label: 'foo',
        index: 1,
        category: 'Straatnamen',
        type: SearchType.Dataset,
      }

      // Find the searchbar and open it to display the autosuggest component
      const searchBar = component.find('SearchBar')
      searchBar.props().onChange({ currentTarget: typedQuery })

      // Select the suggest from autosuggest
      const autosuggest = component.find('AutoSuggest')
      autosuggest.props().onSuggestionSelection(suggestion, {
        preventDefault: () => {},
        stopPropagation: () => {},
      })

      expect(mockOpenDatasetSuggestion).toHaveBeenCalledWith({
        id: 'id3',
        slug: 'foo',
        typedQuery: 'foo',
      })
    })

    it('opens a editorial page from the suggestions', () => {
      extractIdEndpoint.mockReset()
      extractIdEndpoint.mockImplementationOnce(() => ['', CmsType.Article, 'id3'])

      const suggestion = {
        uri: `jsonapi/node/${CmsType.Article}/GgCm07EqNVIpwQ`,
        label: 'foo',
        index: 1,
        category: 'Straatnamen',
        type: CmsType.Article,
      }

      // Find the searchbar and open it to display the autosuggest component
      const searchBar = component.find('SearchBar')
      searchBar.props().onChange({ currentTarget: typedQuery })

      // Select the suggest from autosuggest
      const autosuggest = component.find('AutoSuggest')
      autosuggest.props().onSuggestionSelection(suggestion, {
        preventDefault: () => {},
        stopPropagation: () => {},
      })

      expect(mockOpenEditorialSuggestion).toHaveBeenCalledWith(
        {
          id: 'id3',
          slug: 'foo',
        },
        CmsType.Article,
        '',
      )
    })

    it('opens a editorial page from the suggestions with a subtype', () => {
      const MOCK_SUBTYPE = 'foo2'

      extractIdEndpoint.mockReset()
      extractIdEndpoint.mockImplementationOnce(() => ['', CmsType.Special, 'id3'])

      const suggestion = {
        uri: `jsonapi/node/${CmsType.Special}/GgCm07EqNVIpwQ`,
        label: `foo (${MOCK_SUBTYPE})`,
        index: 1,
        category: 'Straatnamen',
        type: CmsType.Special,
      }

      // Find the searchbar and open it to display the autosuggest component
      const searchBar = component.find('SearchBar')
      searchBar.props().onChange({ currentTarget: typedQuery })

      // Select the suggest from autosuggest
      const autosuggest = component.find('AutoSuggest')
      autosuggest.props().onSuggestionSelection(suggestion, {
        preventDefault: () => {},
        stopPropagation: () => {},
      })

      expect(mockOpenEditorialSuggestion).toHaveBeenCalledWith(
        {
          id: 'id3',
          slug: 'foo',
        },
        CmsType.Special,
        MOCK_SUBTYPE,
      )
    })

    it('opens a search overview page when ellipsis is clicked', () => {
      const suggestion = {
        uri: 'foo/foo/GgCm07EqNVIpwQ',
        label: 'foo',
        index: MORE_RESULTS_INDEX,
        category: 'Straatnamen',
        type: CmsType.Special,
      }

      // Find the searchbar and open it to display the autosuggest component
      const searchBar = component.find('SearchBar')
      searchBar.props().onChange({ currentTarget: typedQuery })

      // Select the suggest from autosuggest
      const autosuggest = component.find('AutoSuggest')
      autosuggest.props().onSuggestionSelection(suggestion, {
        preventDefault: () => {},
        stopPropagation: () => {},
      })

      expect(mockDispatch).toHaveBeenCalledWith(mockOnSpecialSearch)
    })
  })

  describe('navigateSuggestions keydown events', () => {
    beforeEach(() => {
      component = shallow(
        <HeaderSearch
          {...{
            ...props,
            numberOfSuggestions: 1,
            suggestions: [
              {
                content: [
                  {
                    uri: 'foo/foo/GgCm07EqNVIpwQ',
                    label: 'foo',
                    index: MORE_RESULTS_INDEX,
                    category: 'Straatnamen',
                    type: CmsType.Special,
                  },
                ],
              },
            ],
          }}
        />,
      )

      mockOnSuggestionActivate.mockClear()
      mockOnGetSuggestions.mockClear()
    })

    it('should handle arrow up key', () => {
      // Find the searchbar and open it to display the autosuggest component
      const searchBar = component.find('SearchBar')

      searchBar.props().onChange({ currentTarget: typedQuery })
      searchBar.props().onKeyDown({
        keyCode: 38,
        preventDefault: () => {},
      })

      // Select the suggest from autosuggest
      const autosuggest = component.find('AutoSuggest')

      expect(autosuggest.exists()).toBe(true)
      expect(mockOnSuggestionActivate).not.toHaveBeenCalled() // no suggestion is selected
    })

    it('should handle arrow down key', () => {
      // Find the searchbar and open it to display the autosuggest component
      const searchBar = component.find('SearchBar')

      searchBar.props().onChange({ currentTarget: typedQuery })
      searchBar.props().onKeyDown({
        keyCode: 40,
        preventDefault: () => {},
      })

      // Select the suggest from autosuggest
      const autosuggest = component.find('AutoSuggest')

      expect(autosuggest.exists()).toBe(true)
      expect(mockOnSuggestionActivate).toHaveBeenCalled() // suggestion is selected
    })

    it('should handle escape key', () => {
      // Find the searchbar and open it to display the autosuggest component
      const searchBar = component.find('SearchBar')

      searchBar.props().onChange({ currentTarget: typedQuery })
      searchBar.props().onKeyDown({
        keyCode: 27,
        preventDefault: () => {},
      })

      // Select the suggest from autosuggest
      const autosuggest = component.find('AutoSuggest')

      expect(autosuggest.exists()).toBe(false)
      expect(mockOnGetSuggestions).toHaveBeenCalledWith('', null) // clear the search
    })

    it('should handle enter key', () => {
      // Find the searchbar and open it to display the autosuggest component
      const searchBar = component.find('SearchBar')

      searchBar.props().onChange({ currentTarget: typedQuery })
      searchBar.props().onKeyDown({
        keyCode: 13,
        preventDefault: () => {},
      })

      // Select the suggest from autosuggest
      const autosuggest = component.find('AutoSuggest')

      expect(autosuggest.exists()).toBe(true)
      expect(mockOnSearch).toHaveBeenCalled()
    })

    it('should handle enter key with filter on', () => {
      component = null

      component = shallow(
        <HeaderSearch
          {...{
            ...props,
            pageType: CmsType.Special,
            numberOfSuggestions: 1,
            suggestions: [
              {
                content: [{}],
              },
            ],
          }}
        />,
      )

      // Find the searchbar and open it to display the autosuggest component
      const searchBar = component.find('SearchBar')

      searchBar.props().onChange({ currentTarget: typedQuery })
      searchBar.props().onKeyDown({
        keyCode: 13,
        preventDefault: () => {},
      })

      // Select the suggest from autosuggest
      const autosuggest = component.find('AutoSuggest')

      expect(autosuggest.exists()).toBe(true)
      expect(mockDispatch).toHaveBeenCalledWith(mockOnSpecialSearch)
    })

    it('should handle any other key and do nothing', () => {
      const preventDefaultMock = jest.fn()

      // Find the searchbar and open it to display the autosuggest component
      const searchBar = component.find('SearchBar')

      searchBar.props().onChange({ currentTarget: typedQuery })
      searchBar.props().onKeyDown({
        keyCode: 44,
        preventDefault: preventDefaultMock,
      })

      expect(preventDefaultMock).not.toHaveBeenCalled()
    })
  })
})
