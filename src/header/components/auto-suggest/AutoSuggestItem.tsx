import escapeStringRegexp from 'escape-string-regexp'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Link, { To } from 'redux-first-router-link'
import SEARCH_PAGE_CONFIG from '../../../app/pages/SearchPage/config'
import SearchType from '../../../app/pages/SearchPage/constants'
import useSlug from '../../../app/utils/useSlug'
import { CmsType } from '../../../shared/config/cms.config'
import { getViewMode, VIEW_MODE } from '../../../shared/ducks/ui/ui'
import PARAMETERS from '../../../store/parameters'
import { decodeLayers } from '../../../store/queryParameters'
import {
  extractIdEndpoint,
  toArticleDetail,
  toCollectionDetail,
  toDatasetDetail,
  toDataSuggestion,
  toMapWithLegendOpen,
  toPublicationDetail,
  toSpecialDetail,
} from '../../../store/redux-first-router/actions'
import { MORE_RESULTS_INDEX } from '../../services/auto-suggest/auto-suggest'
import { Suggestion } from '../HeaderSearch'

type AutoSuggestItemProps = {
  content: string
  searchCategory: string
  suggestion: Suggestion
  highlightValue: string
}

const AutoSuggestItem: React.FC<AutoSuggestItemProps> = ({
  content,
  suggestion,
  searchCategory,
  highlightValue,
}) => {
  const highlightedSuggestion =
    content &&
    content.replace(
      new RegExp(`(${escapeStringRegexp(highlightValue.trim())})`, 'gi'),
      '<span class="auto-suggest__dropdown__highlight">$1</span>',
    )
  const moreResults = suggestion.index === MORE_RESULTS_INDEX

  const view = useSelector(getViewMode)

  const openEditorialSuggestion = (
    { id, slug }: { id: string; slug: string },
    type: string,
    subType: string,
  ): To => {
    switch (type) {
      case CmsType.Article:
        return toArticleDetail(id, slug)
      case CmsType.Collection:
        return toCollectionDetail(id, slug)
      case CmsType.Publication:
        return toPublicationDetail(id, slug)
      case CmsType.Special:
        return toSpecialDetail(id, subType, slug)
      default:
        throw new Error(`Unable to open editorial suggestion, unknown type '${type}'.`)
    }
  }

  const to = useMemo(() => {
    // "More in category" Link
    if (suggestion.index === MORE_RESULTS_INDEX) {
      const searchType = suggestion.type || searchCategory

      const actionType = Object.values(SEARCH_PAGE_CONFIG).find(
        ({ type: configType }) => searchType === configType,
      )

      if (actionType) {
        const { to: toFn } = actionType
        return toFn(
          {
            [PARAMETERS.QUERY]: highlightValue,
            [PARAMETERS.PAGE]: 1, // reset the page number on search
            ...(suggestion.subType
              ? {
                  [PARAMETERS.FILTERS]: [
                    {
                      type: 'dataTypes',
                      values: [suggestion.subType],
                    },
                  ],
                }
              : {}),
          },
          false,
          true,
          false,
        )
      }
    } else if (suggestion.type === SearchType.Dataset) {
      const [, , id] = extractIdEndpoint(suggestion.uri)
      const slug = useSlug(suggestion.label)

      return toDatasetDetail({ id, slug, highlightValue })
    } else if (
      // Suggestion coming from the cms
      suggestion.type === CmsType.Article ||
      suggestion.type === CmsType.Publication ||
      suggestion.type === CmsType.Collection ||
      suggestion.type === CmsType.Special
    ) {
      const [, , id] = extractIdEndpoint(suggestion.uri)
      const slug = useSlug(suggestion.label)

      let subType = ''
      if (suggestion.type === CmsType.Special) {
        ;[, subType] = suggestion.label.match(/\(([^()]*)\)$/)
      }

      return openEditorialSuggestion({ id, slug }, suggestion.type, subType)
    } else if (suggestion.type === SearchType.Map) {
      const { searchParams } = new URL(suggestion.uri, window.location.origin)

      return toMapWithLegendOpen(decodeLayers(searchParams.get(PARAMETERS.LAYERS)))
    } else {
      return toDataSuggestion(
        {
          endpoint: suggestion.uri,
          category: suggestion.category,
          highlightValue,
        },
        view === VIEW_MODE.FULL ? VIEW_MODE.SPLIT : view,
      )
    }

    return null
  }, [
    extractIdEndpoint,
    useSlug,
    openEditorialSuggestion,
    decodeLayers,
    searchCategory,
    highlightValue,
  ])

  return (
    <li>
      <Link
        className={`
          auto-suggest__dropdown-item
          ${moreResults ? 'auto-suggest__dropdown-item--more-results' : ''}
        `}
        to={to}
      >
        <div>
          {!moreResults ? <span className="icon" /> : ''}
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: highlightedSuggestion,
            }}
          />
        </div>
      </Link>
    </li>
  )
}

export default AutoSuggestItem
