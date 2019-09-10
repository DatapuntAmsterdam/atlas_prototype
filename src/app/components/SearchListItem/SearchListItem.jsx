import React from 'react'
import RouterLink from 'redux-first-router-link'
import PropTypes from 'prop-types'
import { NORMAL_VBO_STATUSSES } from '../../../map/services/map-search/status-labels'

const isString = value => typeof value === 'string'

function isObject(value) {
  return value !== null && typeof value === 'object'
}

const showSubtype = (categorySlug, link) =>
  isString(link.subtype) &&
  (categorySlug === 'ligplaats' ||
    categorySlug === 'standplaats' ||
    (categorySlug === 'openbareruimte' && link.subtype !== 'weg') ||
    (categorySlug === 'adres' && link.subtype !== 'verblijfsobject') ||
    categorySlug === 'gebied' ||
    categorySlug === 'explosief' ||
    (categorySlug === 'monument' && link.subtype === 'complex'))

const getExtraInfo = result => {
  let extraInfo = ''
  if (result.hoofdadres === false) {
    extraInfo += ' (nevenadres)'
  }

  if (
    isObject(result.vbo_status) &&
    !NORMAL_VBO_STATUSSES.includes(result.vbo_status.omschrijving)
  ) {
    extraInfo += ` (${result.vbo_status.omschrijving.toLowerCase()})`
  }

  return extraInfo
}

const SearchListItem = ({ result, category }) => (
  <li>
    <RouterLink className="o-btn o-btn--link qa-list-item-link" to={result.linkTo}>
      {result.label}
    </RouterLink>

    <span className="qa-search-results__link-extra-info">{getExtraInfo(result)}</span>

    {showSubtype(category.slug, result) ? (
      <span className="qa-subtype">
        &nbsp;(
        {result.subtypeLabel})
      </span>
    ) : null}
  </li>
)

SearchListItem.propTypes = {
  result: PropTypes.shape({
    label: PropTypes.string,
    subtype: PropTypes.string,
    subtypeLabel: PropTypes.string,
    linkTo: PropTypes.shape(),
  }).isRequired,
  category: PropTypes.shape().isRequired,
}

export default SearchListItem
