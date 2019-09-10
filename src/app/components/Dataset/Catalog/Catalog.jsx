/* eslint-disable react/no-array-index-key */
import React from 'react'
import PropTypes from 'prop-types'
import removeMd from 'remove-markdown'
import RouterLink from 'redux-first-router-link'
import {
  aggregateFilter,
  kebapCaseFilter,
  modificationDateFilter,
  truncateHtmlAsTextFilter,
  ucFirst,
} from '../../Filters/Filters'
import { routing } from '../../../routes'
import useSlug from '../../../utils/useSlug'

const arrayToObject = (array, keyField) =>
  array.reduce(
    (acc, item) => ({
      ...acc,
      [item[keyField]]: item.label,
    }),
    {},
  )

const Catalog = ({ content, catalogFilters }) => {
  if (!Object.keys(catalogFilters).length) {
    return false
  }

  const formatMap = arrayToObject(catalogFilters.formatTypes, 'id')
  const serviceMap = arrayToObject(catalogFilters.serviceTypes, 'id')
  const distributionMap = arrayToObject(catalogFilters.distributionTypes, 'id')

  const items = content.map(item => {
    const formats = item['dcat:distribution'].map(resource => {
      if (resource['ams:distributionType'] === 'file') {
        return formatMap[resource['dcat:mediaType']]
      }
      if (resource['ams:distributionType'] === 'api') {
        return serviceMap[resource['ams:serviceType']]
      }
      return distributionMap[resource['ams:distributionType']]
    })

    const id = item['dct:identifier']
    const linkTo = {
      type: routing.datasetDetail.type,
      // Ideally we need to retrieve the slug from the API, but we convert this in the frontend for now
      payload: { id, title: useSlug(item['dct:title'] || id) },
    }

    return {
      header: item['dct:title'],
      description: removeMd(item['dct:description']),
      modified: item['ams:sort_modified'],
      formats: aggregateFilter(formats),
      tags: item['dcat:keyword'],
      linkTo,
      id,
    }
  })
  return (
    <div className="c-data-selection-catalog u-margin__bottom--4">
      {items.map(row => (
        <div key={row.id} className="c-data-selection-catalog__list">
          <div className="c-data-selection-catalog__item qa-catalog-fetch-detail u-no-presentation">
            <RouterLink className="qa-dp-link" to={row.linkTo} tabIndex="-1">
              <div className="c-data-selection-catalog__header">
                <h2>{row.header}</h2>
                <div>{modificationDateFilter(row.modified)}</div>
              </div>

              <span className="c-data-selection-catalog__formats">
                {row.formats.map((format, i) => (
                  <div key={i} className="c-data-selection-file-type">
                    <span
                      className={`c-data-selection-file-type__name c-data-selection-file-type__format-${kebapCaseFilter(
                        format.name,
                      )}`}
                    >
                      {format.name}
                    </span>
                    <span className="c-data-selection-file-type__x">x</span>
                    <span className="c-data-selection-file-type__count">{format.count}</span>
                  </div>
                ))}
              </span>
              <span className="c-data-selection-catalog__tags">
                {row.tags.map((tag, i) => (
                  <ul key={i} className="u-inline">
                    <li className="u-inline">
                      <div className="dataset-tag-small">
                        <i className="dataset-tag-small__arrow" />
                        <span className="dataset-tag-small__label">{ucFirst(tag)}</span>
                      </div>
                    </li>
                  </ul>
                ))}
              </span>

              <div className="c-data-selection-catalog__description">
                {truncateHtmlAsTextFilter(row.description)}
              </div>
            </RouterLink>
          </div>
        </div>
      ))}
    </div>
  )
}

Catalog.propTypes = {
  content: PropTypes.arrayOf(PropTypes.object).isRequired,
  catalogFilters: PropTypes.shape({}).isRequired,
}

export default Catalog
