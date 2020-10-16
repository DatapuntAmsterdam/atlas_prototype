import React from 'react'
import { useSelector } from 'react-redux'
import Link from 'redux-first-router-link'
import { Alert, Paragraph, Heading } from '@amsterdam/asc-ui'
import { getDetailLocation } from '../../../store/redux-first-router/selectors'
import SHARED_CONFIG from '../../../shared/services/shared-config/shared-config'
import { toPanoramaAndPreserveQuery } from '../../../store/redux-first-router/actions'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import {
  getPanoramaPreview,
  isPanoramaPreviewLoading,
} from '../../../panorama/ducks/preview/panorama-preview'
import NotificationLevel from '../../models/notification'

// Note, this component has been migrated from legacy angularJS code
// Todo: AfterBeta can be removed
const PanoramaPreview = () => {
  const reference = useSelector(getDetailLocation)
  const panoramaPreview = useSelector(getPanoramaPreview)
  const isLoading = useSelector(isPanoramaPreviewLoading)

  const radius = SHARED_CONFIG.RADIUS
  const linkTo = toPanoramaAndPreserveQuery(panoramaPreview.id, panoramaPreview.heading, reference)

  return (
    <div className="c-search-results__thumbnail-container">
      <div className="c-search-results__thumbnail">
        <div className="qa-panorama-thumbnail">
          <h3 className="o-header__subtitle u-margin__bottom--1">Panoramabeeld</h3>

          {panoramaPreview.url && (
            <Link
              className="u-block u-width-100 u-margin__bottom--4"
              to={linkTo}
              title="Panoramabeeld tonen"
            >
              <div className="u-aspect-ratio u-aspect-ratio--16-9">
                {linkTo && (
                  <img
                    className="c-panorama-thumbnail--img"
                    src={panoramaPreview.url}
                    alt="Panoramabeeld tonen"
                  />
                )}
              </div>
            </Link>
          )}

          {!isLoading && !panoramaPreview.url && (
            <Alert level={NotificationLevel.Attention}>
              <Heading as="h3">
                Geen panoramabeeld beschikbaar (binnen {radius}m van deze locatie).
              </Heading>
              <Paragraph>Tip: kies via de kaart een nabije locatie.</Paragraph>
            </Alert>
          )}

          {isLoading && <LoadingSpinner />}
        </div>
      </div>
    </div>
  )
}

export default PanoramaPreview
