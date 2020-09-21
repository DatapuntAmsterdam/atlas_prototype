import escapeStringRegexp from 'escape-string-regexp'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { LocationDescriptorObject } from 'history'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import SEARCH_PAGE_CONFIG from '../../../app/pages/SearchPage/config'
import SearchType from '../../../app/pages/SearchPage/constants'
import useSlug from '../../../app/utils/useSlug'
import { CmsType } from '../../../shared/config/cms.config'
import { getViewMode, VIEW_MODE } from '../../../shared/ducks/ui/ui'
import PARAMETERS from '../../../store/parameters'
import { decodeLayers } from '../../../store/queryParameters'
import { extractIdEndpoint, getDetailPageData } from '../../../store/redux-first-router/actions'
import { MORE_RESULTS_INDEX } from '../../services/auto-suggest/auto-suggest'
import { Suggestion } from '../HeaderSearch'
import { getRoute, routing } from '../../../app/routes'

type AutoSuggestItemProps = {
  content: string
  searchCategory: string
  suggestion: Suggestion
  highlightValue: string
  inputValue?: string
  label: string
}

const AutoSuggestItem: React.FC<AutoSuggestItemProps> = ({
  content,
  suggestion,
  searchCategory,
  highlightValue,
  inputValue,
  label,
}) => {
  const highlightedSuggestion =
    content &&
    content.replace(
      new RegExp(`(${escapeStringRegexp(highlightValue.trim())})`, 'gi'),
      '<span class="auto-suggest__dropdown__highlight">$1</span>',
    )
  const moreResults = suggestion.index === MORE_RESULTS_INDEX

  const view = useSelector(getViewMode)
  const { trackEvent } = useMatomo()

  const openEditorialSuggestion = (
    { id, slug }: { id: string; slug: string },
    type: string,
    subType: string,
  ) => {
    switch (type) {
      case CmsType.Article:
        return getRoute(routing.articleDetail.path, slug, id)
      case CmsType.Collection:
        return getRoute(routing.collectionDetail.path, slug, id)
      case CmsType.Publication:
        return getRoute(routing.publicationDetail.path, slug, id)
      case CmsType.Special:
        return getRoute(routing.specialDetail.path, subType, slug, id)
      default:
        throw new Error(`Unable to open editorial suggestion, unknown type '${type}'.`)
    }
  }
  const searchType = suggestion.type || searchCategory

  const to: LocationDescriptorObject | null = useMemo(() => {
    // "More in category" Link
    if (suggestion.index === MORE_RESULTS_INDEX) {
      const actionType = Object.values(SEARCH_PAGE_CONFIG).find(
        ({ type: configType }) => searchType === configType,
      )

      if (actionType) {
        const { path } = actionType
        return {
          pathname: path,
          search: new URLSearchParams({
            [PARAMETERS.QUERY]: `${inputValue}`,
            [PARAMETERS.PAGE]: '1', // reset the page number on search
            ...(suggestion.subType
              ? {
                  [PARAMETERS.FILTERS]: `dataTypes;${suggestion.subType}`,
                }
              : {}),
          }).toString(),
        }
      }
    } else if (suggestion.type === SearchType.Dataset) {
      const [, , id] = extractIdEndpoint(suggestion.uri)
      const slug = useSlug(suggestion.label)

      return {
        pathname: getRoute(routing.datasetDetail.path, { id, slug }),
        search: new URLSearchParams({
          [PARAMETERS.QUERY]: `${inputValue}`,
        }).toString(),
      }
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

      return {
        pathname: openEditorialSuggestion({ id, slug }, suggestion.type, subType),
        search: new URLSearchParams({
          [PARAMETERS.QUERY]: `${inputValue}`,
        }).toString(),
      }
    } else if (suggestion.type === SearchType.Map) {
      const { searchParams } = new URL(suggestion.uri, window.location.origin)

      return {
        pathname: routing.data.path,
        search: new URLSearchParams({
          [PARAMETERS.VIEW]: VIEW_MODE.MAP,
          [PARAMETERS.QUERY]: `${inputValue}`,
          [PARAMETERS.LEGEND]: 'true',
          [PARAMETERS.LAYERS]: searchParams.get(PARAMETERS.LAYERS) || '',
        }).toString(),
      }
    } else {
      const { type, subtype, id } = getDetailPageData(suggestion.uri)
      // suggestion.category TRACK
      return {
        pathname: getRoute(routing.dataDetail.path, type, subtype, `id${id}`),
        search: new URLSearchParams({
          [PARAMETERS.VIEW]: view,
          [PARAMETERS.QUERY]: `${inputValue}`,
        }).toString(),
      }
    }

    return null
  }, [
    extractIdEndpoint,
    useSlug,
    openEditorialSuggestion,
    decodeLayers,
    searchType,
    highlightValue,
  ])

  return to ? (
    <li>
      <Link
        className={`
          auto-suggest__dropdown-item
          ${moreResults ? 'auto-suggest__dropdown-item--more-results' : ''}
        `}
        onClick={() => {
          trackEvent({
            category: 'auto-suggest',
            name: content,
            action: label,
          })
        }}
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
  ) : null
}

export default AutoSuggestItem
