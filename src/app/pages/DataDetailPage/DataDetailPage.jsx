/* eslint-disable global-require */
import { connect } from 'react-redux'
import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { AngularWrapper } from 'react-angular'
import ShareBar from '../../components/ShareBar/ShareBar'
import { getUser } from '../../../shared/ducks/user/user'
import {
  getPanoramaPreview,
  isPanoramaPreviewLoading,
} from '../../../panorama/ducks/preview/panorama-preview'
import {
  getDetailData,
  getDetailEndpoint,
  getDetailFilterSelection,
  getDetailTemplateUrl,
  getID,
  getSubType,
  isDetailLoading,
} from '../../../shared/ducks/detail/selectors'
import useCompare from '../../utils/useCompare'

let angularInstance = null

if (typeof window !== 'undefined') {
  require('../../angularModules')
  angularInstance = require('angular')
}

const Detail = ({
  isLoading,
  user,
  endpoint,
  previewPanorama,
  isPreviewPanoramaLoading,
  detailTemplateUrl,
  detailData,
  detailFilterSelection,
  subType,
  id,
}) => {
  // Todo: temp fix. React-router doesn't unmount and mount the component, where redux-first-router did
  const idIsUpdated = useCompare(id)
  const isFirstRun = useRef(true)
  useEffect(() => {
    if (idIsUpdated && !isFirstRun.current) {
      window.location.reload()
    }
    if (isFirstRun.current) {
      isFirstRun.current = false
    }
  }, [idIsUpdated, id])

  return (
    <div className="qa-detail">
      {angularInstance ? (
        <AngularWrapper
          moduleName="dpDetailWrapper"
          component="dpDetail"
          dependencies={['atlas']}
          angularInstance={angularInstance}
          bindings={{
            isLoading,
            user,
            previewPanorama,
            isPreviewPanoramaLoading,
            detailTemplateUrl,
            detailData,
            detailFilterSelection,
            subType,
            id,
          }}
          interpolateBindings={{
            endpoint,
          }}
        />
      ) : null}
      {!isLoading && (
        <div className="u-row">
          <div className="u-col-sm--12">
            <div className="u-margin__left--2 u-margin__bottom--1 qa-share-bar">
              <ShareBar />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

Detail.defaultProps = {
  previewPanorama: undefined,
  isPreviewPanoramaLoading: undefined,
  detailTemplateUrl: undefined,
  detailData: undefined,
  detailFilterSelection: undefined,
}

Detail.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  user: PropTypes.shape({}).isRequired,
  endpoint: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  subType: PropTypes.string.isRequired,
  previewPanorama: PropTypes.shape({}),
  isPreviewPanoramaLoading: PropTypes.bool,
  detailTemplateUrl: PropTypes.string,
  detailData: PropTypes.shape({}),
  detailFilterSelection: PropTypes.shape({}),
}

const mapStateToProps = (state) => ({
  isLoading: isDetailLoading(state),
  user: getUser(state),
  endpoint: getDetailEndpoint(state),
  subType: getSubType(state),
  id: getID(state),
  previewPanorama: getPanoramaPreview(state),
  isPreviewPanoramaLoading: isPanoramaPreviewLoading(state),
  detailTemplateUrl: getDetailTemplateUrl(state),
  detailData: getDetailData(state),
  detailFilterSelection: getDetailFilterSelection(state),
})

export default connect(mapStateToProps)(Detail)
