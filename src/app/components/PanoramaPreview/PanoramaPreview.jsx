/* eslint-disable global-require */
import React from 'react'
import PropTypes from 'prop-types'
import { AngularWrapper } from 'react-angular'

let angularInstance = null

if (typeof window !== 'undefined') {
  require('../../angularModules')
  angularInstance = require('angular')
}

const PanoramaPreview = ({ panoramaPreview, isLoading }) => (
  <div className="c-search-results__thumbnail-container">
    <div className="c-search-results__thumbnail">
      {angularInstance ? (
        <AngularWrapper
          moduleName="dpPanoramaThumbnailWrapper"
          component="dpPanoramaThumbnail"
          dependencies={['atlas']}
          angularInstance={angularInstance}
          bindings={{
            panorama: panoramaPreview,
            isLoading,
          }}
        />
      ) : null}
    </div>
  </div>
)

PanoramaPreview.defaultProps = {
  panoramaPreview: null,
}

PanoramaPreview.propTypes = {
  panoramaPreview: PropTypes.shape({
    id: PropTypes.string,
    heading: PropTypes.number,
    url: PropTypes.string,
  }),
  isLoading: PropTypes.bool.isRequired,
}

export default PanoramaPreview
