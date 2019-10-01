import React from 'react'
import { shallow } from 'enzyme'

import HeaderSearch from './HeaderSearch'
import { extractIdEndpoint } from '../../../store/redux-first-router/actions'
import useSlug from '../../../app/utils/useSlug'
import { LABELS } from '../../services/auto-suggest/auto-suggest'

jest.mock('../../../store/redux-first-router/actions')
jest.mock('../../../app/utils/useSlug')

describe('The HeaderSearch component', () => {
  const typedQuery = 'foo'
  const mockOnDataSearch = jest.fn()
  const mockOnDatasetSearch = jest.fn()
  const mockOnArticleSearch = jest.fn()
  const mockOnPublicationSearch = jest.fn()
  const mockOpenDataSuggestion = jest.fn()
  const mockOpenDatasetSuggestion = jest.fn()
  const mockOpenEditorialSuggestion = jest.fn()

  const props = {
    typedQuery,
    view: 'split',
    isMapActive: false,
    onCleanDatasetOverview: jest.fn(),
    onDatasetSearch: mockOnDatasetSearch,
    onDataSearch: mockOnDataSearch,
    onArticleSearch: mockOnArticleSearch,
    onPublicationSearch: mockOnPublicationSearch,
    openDataSuggestion: mockOpenDataSuggestion,
    openDatasetSuggestion: mockOpenDatasetSuggestion,
    openEditorialSuggestion: mockOpenEditorialSuggestion,
    onGetSuggestions: jest.fn(),
    onSuggestionActivate: jest.fn(),
  }

  let component
  beforeEach(() => {
    component = shallow(<HeaderSearch {...props} />)

    extractIdEndpoint.mockImplementationOnce(() => ['id1', 'id2', 'id3'])
    useSlug.mockImplementationOnce(() => 'foo')
  })

  describe('submits the form', () => {
    it('and opens the data search tab', () => {
      const autosuggest = component.find('AutoSuggest')

      // execute this.onFormSubmit()
      autosuggest.props().onSubmit()

      expect(mockOnDataSearch).toHaveBeenCalledWith(typedQuery)
    })

    it('and opens the dataset search tab', () => {
      const autosuggest = component.find('AutoSuggest')

      // execute this.onFormSubmit()
      autosuggest.props().onSubmit(LABELS.DATASETS)

      expect(mockOnDatasetSearch).toHaveBeenCalledWith(typedQuery)
    })

    it('and opens the article search tab', () => {
      const autosuggest = component.find('AutoSuggest')

      // execute this.onFormSubmit()
      autosuggest.props().onSubmit(LABELS.ARTICLES)

      expect(mockOnArticleSearch).toHaveBeenCalledWith(typedQuery)
    })

    it('and opens the publication search tab', () => {
      const autosuggest = component.find('AutoSuggest')

      // execute this.onFormSubmit()
      autosuggest.props().onSubmit(LABELS.PUBLICATIONS)

      expect(mockOnPublicationSearch).toHaveBeenCalledWith(typedQuery)
    })
  })

  describe('selects a suggestion', () => {
    it('opens a data page from the suggestions', () => {
      const suggestion = {
        uri: 'foo/foo/GgCm07EqNVIpwQ',
        label: 'foo',
        index: 1,
        category: 'Straatnamen',
      }

      const autosuggest = component.find('AutoSuggest')

      // execute this.onSuggestionSelection()
      autosuggest.props().onSuggestionSelection(suggestion)

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
      }

      const autosuggest = component.find('AutoSuggest')

      // execute this.onSuggestionSelection()
      autosuggest.props().onSuggestionSelection(suggestion)

      expect(mockOpenDatasetSuggestion).toHaveBeenCalledWith({
        id: 'id3',
        slug: 'foo',
        typedQuery: 'foo',
      })
    })

    it('opens a editorial page from the suggestions', () => {
      const suggestion = {
        uri: 'jsonapi/node/article/GgCm07EqNVIpwQ',
        label: 'foo',
        index: 1,
        category: 'Straatnamen',
      }

      const autosuggest = component.find('AutoSuggest')

      // execute this.onSuggestionSelection()
      autosuggest.props().onSuggestionSelection(suggestion)

      expect(mockOpenEditorialSuggestion).toHaveBeenCalledWith(
        {
          id: 'id3',
          slug: 'foo',
        },
        'id2',
      )
    })
  })
})
