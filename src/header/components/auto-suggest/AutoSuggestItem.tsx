import { Link, themeSpacing } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import escapeStringRegexp from 'escape-string-regexp'
import type { FunctionComponent } from 'react'
import { useMemo } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import type { LocationDescriptorObject } from 'history'
import {
  toArticleDetail,
  toCollectionDetail,
  toDataDetail,
  toDatasetDetail,
  toMap,
  toPublicationDetail,
  toSpecialDetail,
} from '../../../app/links'
import { legendOpenParam, mapLayersParam, viewParam } from '../../../app/pages/MapPage/query-params'
import { SearchType } from '../../../app/pages/SearchPage/constants'
import { queryParam } from '../../../app/pages/SearchPage/query-params'
import toSearchParams from '../../../app/utils/toSearchParams'
import toSlug from '../../../app/utils/toSlug'
import { CmsType } from '../../../shared/config/cms.config'
import { ViewMode } from '../../../shared/ducks/ui/ui'
import { extractIdEndpoint, getDetailPageData } from '../../../store/redux-first-router/actions'
import type { AutoSuggestSearchContent } from '../../services/auto-suggest/auto-suggest'
import useParam from '../../../app/utils/useParam'

function decodeLayers(value: string) {
  if (!value) {
    return []
  }

  return value.split('|').map((entry) => {
    const [id, visibility] = entry.split(':')

    return {
      id,
      isVisible: visibility === '1',
    }
  })
}

export interface AutoSuggestItemProps {
  content: string
  suggestion: AutoSuggestSearchContent
  highlightValue: string
  inputValue: string
  label: string
}

const StyledLink = styled(Link)`
  font-weight: inherit;
  margin-left: ${themeSpacing(1)};
`

const AutoSuggestItem: FunctionComponent<AutoSuggestItemProps> = ({
  content,
  suggestion,
  highlightValue,
  inputValue,
  label,
}) => {
  const [view] = useParam(viewParam)
  const { trackEvent } = useMatomo()
  const location = useLocation()

  const openEditorialSuggestion = (
    { id, slug }: { id: string; slug: string },
    type: string,
    subType: string,
  ) => {
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

  const to: LocationDescriptorObject = useMemo(() => {
    if (suggestion.type === SearchType.Dataset) {
      const [, , id] = extractIdEndpoint(suggestion.uri)
      const slug = toSlug(suggestion.label)

      return {
        ...toDatasetDetail({ id, slug }),
        search: toSearchParams([[queryParam, inputValue]]).toString(),
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
      const slug = toSlug(suggestion.label)

      let subType = ''

      if (suggestion.type === CmsType.Special) {
        const match = /\(([^()]*)\)$/.exec(suggestion.label)

        if (match) {
          ;[, subType] = match
        }
      }

      return {
        ...openEditorialSuggestion({ id, slug }, suggestion.type, subType),
        search: toSearchParams([[queryParam, inputValue]]).toString(),
      }
    }

    if (suggestion.type === SearchType.Map) {
      const { searchParams } = new URL(suggestion.uri, window.location.origin)
      const rawMapLayers = searchParams.get(mapLayersParam.name)
      const mapLayers = rawMapLayers ? mapLayersParam.decode(rawMapLayers) : []

      return {
        ...toMap(),
        search: toSearchParams([
          [viewParam, ViewMode.Map],
          [queryParam, inputValue],
          [legendOpenParam, true],
          [mapLayersParam, mapLayers],
        ]).toString(),
      }
    }

    const { type, subtype, id } = getDetailPageData(suggestion.uri)
    const currentSearchParams = new URLSearchParams(window.location.search)
    const rawMapLayers = currentSearchParams.get(mapLayersParam.name)
    const mapLayers = rawMapLayers ? mapLayersParam.decode(rawMapLayers) : []

    // suggestion.category TRACK
    return {
      ...toDataDetail({ type, subtype, id }),
      search: toSearchParams(
        [
          [viewParam, view],
          [queryParam, inputValue],
          [mapLayersParam, mapLayers],
        ],
        {
          initialValue: location.search,
        },
      ).toString(),
    }
  }, [extractIdEndpoint, openEditorialSuggestion, decodeLayers, highlightValue, location])

  const htmlContent = useMemo(
    () => highlightSuggestion(content, highlightValue),
    [content, highlightValue],
  )

  return (
    <li>
      <StyledLink
        forwardedAs={RouterLink}
        inList
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
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: htmlContent,
          }}
        />
      </StyledLink>
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
