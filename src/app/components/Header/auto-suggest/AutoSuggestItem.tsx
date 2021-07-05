import { Link, themeSpacing } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import escapeStringRegexp from 'escape-string-regexp'
import type { FunctionComponent } from 'react'
import { useMemo } from 'react'
import { Link as RouterLink, matchPath, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import type { LocationDescriptorObject } from 'history'
import {
  toArticleDetail,
  toCollectionDetail,
  toDataDetail,
  toDatasetDetail,
  toGeoSearch,
  toPublicationDetail,
  toSpecialDetail,
} from '../../../links'
import {
  centerParam,
  locationParam,
  mapLayersParam,
  ViewMode,
  viewParam,
  zoomParam,
} from '../../../pages/MapPage/query-params'
import { SearchType } from '../../../pages/SearchPage/constants'
import { queryParam } from '../../../pages/SearchPage/query-params'
import toSearchParams from '../../../utils/toSearchParams'
import toSlug from '../../../utils/toSlug'
import { CmsType } from '../../../../shared/config/cms.config'
import getIdEndpoint from '../../../utils/getIdEndpoint'
import getDetailPageData from '../../../utils/getDetailPageData'
import type { AutoSuggestSearchContent } from '../services/auto-suggest/auto-suggest'
import useParam from '../../../utils/useParam'
import { routing } from '../../../routes'
import { useHeaderSearch } from '../HeaderSearchContext'

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
  const [locationParameter] = useParam(locationParam)
  const [zoom] = useParam(zoomParam)
  const [center] = useParam(centerParam)
  const location = useLocation()

  const { updateSearchInputValue } = useHeaderSearch()

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
      const [, , id] = getIdEndpoint(suggestion.uri)
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
      const [, , id] = getIdEndpoint(suggestion.uri)
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

      // Set detail-page path if current route is on a detail page or on data-selection page, otherwise navigate to geosearch page
      const pathname =
        matchPath(location.pathname, { path: routing.dataDetail.path, exact: true })?.url ??
        view === ViewMode.Map
          ? matchPath(location.pathname, { path: routing.addresses.path, exact: true })?.url ??
            matchPath(location.pathname, { path: routing.cadastralObjects.path, exact: true })
              ?.url ??
            matchPath(location.pathname, { path: routing.establishments.path, exact: true })?.url
          : toGeoSearch().pathname
      return {
        pathname,
        search: toSearchParams(
          [
            [viewParam, ViewMode.Map],
            [queryParam, inputValue],
            [mapLayersParam, mapLayers],
            [locationParam, locationParameter],
          ],
          { initialValue: location.search },
        ).toString(),
      }
    }

    const { type, subtype, id } = getDetailPageData(suggestion.uri)
    const currentSearchParams = new URLSearchParams(window.location.search)
    const rawMapLayers = currentSearchParams.get(mapLayersParam.name)
    const mapLayers = rawMapLayers ? mapLayersParam.decode(rawMapLayers) : []

    // suggestion.category TRACK
    return {
      ...toDataDetail({ type, subtype, id }),
      search: toSearchParams([
        [viewParam, view],
        [queryParam, content],
        [mapLayersParam, mapLayers],
        [locationParam, locationParameter],
        [zoomParam, zoom],
        [centerParam, center],
      ]).toString(),
    }
  }, [getIdEndpoint, openEditorialSuggestion, highlightValue, location])

  const htmlContent = useMemo(
    () => highlightSuggestion(content, highlightValue),
    [content, highlightValue],
  )

  const handleLinkClick = () => {
    updateSearchInputValue(content)
    trackEvent({
      category: 'auto-suggest',
      name: content,
      action: label,
    })
  }

  return (
    <li>
      <StyledLink
        forwardedAs={RouterLink}
        inList
        className="auto-suggest__dropdown-item"
        onClick={handleLinkClick}
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
