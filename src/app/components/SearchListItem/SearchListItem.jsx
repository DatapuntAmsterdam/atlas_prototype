import React from 'react';
import Link from 'redux-first-router-link';
import PropTypes from 'prop-types';

const STATUS_OBJECT_GEVORMD = 18;

const isString = (value) => (typeof value === 'string');

function isObject(value) {
  return value !== null && typeof value === 'object';
}

const showSubtype = (categorySlug, link) => (
  isString(link.subtype) &&
  (
    (categorySlug === 'ligplaats' || categorySlug === 'standplaats') ||
    (categorySlug === 'openbareruimte' && link.subtype !== 'weg') ||
    (categorySlug === 'adres' && link.subtype !== 'verblijfsobject') ||
    categorySlug === 'gebied' ||
    categorySlug === 'explosief' ||
    (categorySlug === 'monument' && link.subtype === 'complex')
  )
);

const getExtraInfo = (link) => {
  let extraInfo = '';
  if (isObject(link)) {
    if (link.hoofdadres === false) {
      extraInfo += ' (nevenadres)';
    }

    if (isObject(link.vbo_status) && Number(link.vbo_status.code) === STATUS_OBJECT_GEVORMD) {
      extraInfo += ` (${link.vbo_status.omschrijving.toLowerCase()})`;
    }
  }
  return extraInfo;
};

const SearchListItem = ({ result, category }) => (
  <li>
    <Link
      className="o-btn o-btn--link qa-list-item-link"
      to={result.linkTo}
    >
      {result.label}
    </Link>

    <span className="qa-search-results__link-extra-info">
      {getExtraInfo(result)}
    </span>

    {(showSubtype(category.slug, result)) ? (
      <span className="qa-subtype">
        &nbsp;({result.subtypeLabel})
      </span>
    ) : null}
  </li>
);

SearchListItem.propTypes = {
  result: PropTypes.shape({
    label: PropTypes.string,
    linkTo: PropTypes.shape()
  }).isRequired,
  category: PropTypes.shape().isRequired
};

export default SearchListItem;
