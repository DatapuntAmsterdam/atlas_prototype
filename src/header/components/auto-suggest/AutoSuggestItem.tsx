import { useMatomo } from '@datapunt/matomo-tracker-react'
import escapeStringRegexp from 'escape-string-regexp'
import { LocationDescriptorObject } from 'history'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SearchType from '../../../app/pages/SearchPage/constants'
import { getRoute, routing } from '../../../app/routes'
import useSlug from '../../../app/utils/useSlug'
import { CmsType } from '../../../shared/config/cms.config'
import { getViewMode, VIEW_MODE } from '../../../shared/ducks/ui/ui'
import PARAMETERS from '../../../store/parameters'
import { decodeLayers } from '../../../store/queryParameters'
import { extractIdEndpoint, getDetailPageData } from '../../../store/redux-first-router/actions'
import { AutoSuggestSearchContent } from '../../services/auto-suggest/auto-suggest'

export interface AutoSuggestItemProps {
  content: string
  suggestion: AutoSuggestSearchContent
  highlightValue: string
  inputValue?: string
  label: string
}

const AutoSuggestItem: React.FC<AutoSuggestItemProps> = ({
  content,
  suggestion,
  highlightValue,
  inputValue,
  label,
}) => {
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

  const to: LocationDescriptorObject = useMemo(() => {
    if (suggestion.type === SearchType.Dataset) {
      const [, , id] = extractIdEndpoint(suggestion.uri)
      const slug = useSlug(suggestion.label)

      return {
        pathname: getRoute(routing.datasetDetail.path, { id, slug }),
        search: new URLSearchParams({
          [PARAMETERS.QUERY]: `${inputValue}`,
        }).toString(),
      }
    }

    if (
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
    }

    if (suggestion.type === SearchType.Map) {
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
    }

    const { type, subtype, id } = getDetailPageData(suggestion.uri)
    // suggestion.category TRACK
    return {
      pathname: getRoute(routing.dataDetail.path, type, subtype, `id${id}`),
      search: new URLSearchParams({
        [PARAMETERS.VIEW]: view,
        [PARAMETERS.QUERY]: `${inputValue}`,
      }).toString(),
    }
  }, [extractIdEndpoint, useSlug, openEditorialSuggestion, decodeLayers, highlightValue])

  const htmlContent = useMemo(() => highlightSuggestion(content, highlightValue), [
    content,
    highlightValue,
  ])

  return (
    <li>
      <Link
        className="auto-suggest__dropdown-item"
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
          <span className="icon" />
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: htmlContent,
            }}
          />
        </div>
      </Link>
    </li>
  )
}

function highlightSuggestion(content: string, highlightValue: string) {
  return content.replace(
    new RegExp(`(${escapeStringRegexp(highlightValue.trim())})`, 'gi'),
    '<span class="auto-suggest__dropdown__highlight">$1</span>',
  )
}

export default AutoSuggestItem
