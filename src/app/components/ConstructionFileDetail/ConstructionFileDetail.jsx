import React from 'react'
import PropTypes from 'prop-types'
import { Heading } from '@datapunt/asc-ui'
import Gallery from '../Gallery/Gallery'
import getAddresses from '../../../normalizations/construction-files/getAddresses'
import linkAttributesFromAction from '../../../shared/services/link-attributes-from-action/linkAttributesFromAction'
import withGrid from '../../utils/withGrid'
import { toDataDetail } from '../../../store/redux-first-router/actions'

const ConstructionFileDetail = ({ results }) => {
  const {
    titel: title,
    subdossiers,
    datering: date,
    dossier_type: fileType,
    dossiernr: fileNumber,
    stadsdeel: district,
  } = results

  return (
    <div className="c-construction-files">
      {withGrid(
        <React.Fragment>
          <Heading className="c-construction-files__subtitle" color="secondary" as="h3">
            Bouwdossier
          </Heading>
          <Heading className="c-construction-files__title" as="h1">
            {title}
          </Heading>
        </React.Fragment>,
      )}

      <div className="c-ds-table">
        <div className="c-ds-table__body">
          <div className="c-ds-table__row">
            <div className="c-ds-table__cell">
              <div className="qa-table-value">Titel</div>
            </div>
            <div className="c-ds-table__cell">
              <div className="qa-table-value">{title}</div>
            </div>
          </div>
          <div className="c-ds-table__row">
            <div className="c-ds-table__cell">
              <div className="qa-table-value">Datering</div>
            </div>
            <div className="c-ds-table__cell">
              <div className="qa-table-value">{date}</div>
            </div>
          </div>
          <div className="c-ds-table__row">
            <div className="c-ds-table__cell">
              <div className="qa-table-value">Type</div>
            </div>
            <div className="c-ds-table__cell">
              <div className="qa-table-value">{fileType}</div>
            </div>
          </div>
          <div className="c-ds-table__row">
            <div className="c-ds-table__cell">
              <div className="qa-table-value">Dossiernummer</div>
            </div>
            <div className="c-ds-table__cell">
              <div className="qa-table-value">{fileNumber}</div>
            </div>
          </div>
        </div>
      </div>

      {subdossiers &&
        subdossiers.length &&
        subdossiers.map(({ bestanden: files, titel: subdossierTitle }) => (
          <Gallery
            id={`${district}${fileNumber}`}
            key={subdossierTitle}
            title={subdossierTitle}
            allThumbnails={files}
            max={6}
          />
        ))}
      {withGrid(
        <React.Fragment>
          <Heading className="c-construction-files__subtitle" as="h3">
            Adressen
          </Heading>
          <ul className="o-list">
            {getAddresses(results).map(address => (
              <li key={address.id}>
                <a
                  {...linkAttributesFromAction(
                    toDataDetail([address.id, 'bag', 'nummeraanduiding']),
                  )}
                  className="o-btn o-btn--link qa-dp-link"
                  title={address.label}
                >
                  {address.label}
                </a>
              </li>
            ))}
          </ul>
        </React.Fragment>,
      )}
    </div>
  )
}

ConstructionFileDetail.propTypes = {
  results: PropTypes.shape({
    titel: PropTypes.string.isRequired,
    subdossiers: PropTypes.arrayOf(PropTypes.shape({})),
    datering: PropTypes.string.isRequired,
    dossier_type: PropTypes.string.isRequired,
    dossiernr: PropTypes.number.isRequired,
    stadsdeel: PropTypes.string.isRequired,
    adressen: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
}

export default ConstructionFileDetail
