/* eslint-disable camelcase */
import React, { FunctionComponent } from 'react'
import RouterLink, { To } from 'redux-first-router-link'
import { Link, ListItem } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import { NORMAL_VBO_STATUSSES } from '../../../map/services/map-search/status-labels'

const ExtraInfo = styled.span`
  font-weight: 400;
`

export type Result = {
  label?: string
  subtype?: string
  subtypeLabel?: string
  type_adres?: string
  vbo_status?: string
  endpoint?: string
  linkTo?: To
}

const showSubtype = (categorySlug?: unknown, result?: Result) =>
  typeof categorySlug === 'string' &&
  result?.subtypeLabel &&
  (categorySlug === 'ligplaats' ||
    categorySlug === 'standplaats' ||
    (categorySlug === 'openbareruimte' && result?.subtype !== 'weg') ||
    (categorySlug === 'adres' && result?.subtype !== 'verblijfsobject') ||
    categorySlug === 'gebied' ||
    categorySlug === 'explosief' ||
    (categorySlug === 'monument' && result?.subtype === 'complex'))

const getExtraInfo = (result: Result) => {
  let extraInfo = ''
  if (result.type_adres && result.type_adres !== 'Hoofdadres') {
    extraInfo += ' (nevenadres)'
  }

  if (result.vbo_status && !NORMAL_VBO_STATUSSES.includes(result.vbo_status)) {
    extraInfo += ` (${result.vbo_status.toLowerCase()})`
  }

  return extraInfo
}

type Props = {
  result: Result
  category?: {
    slug?: unknown
    results: Result[]
  }
}

const LocationSearchListItem: FunctionComponent<Props> = ({ result, category }) => (
  <ListItem data-testid="geosearch-listitem">
    <Link as={RouterLink} inList to={result.linkTo}>
      {result.label}
      <ExtraInfo>{getExtraInfo(result)}</ExtraInfo>

      {showSubtype(category?.slug, result) ? (
        <ExtraInfo>
          &nbsp;(
          {result.subtypeLabel})
        </ExtraInfo>
      ) : null}
    </Link>
  </ListItem>
)

export default LocationSearchListItem
