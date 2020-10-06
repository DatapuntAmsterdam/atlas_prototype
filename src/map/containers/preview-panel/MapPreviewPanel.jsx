import PropTypes from 'prop-types'
import React from 'react'
import LoadingSpinner from '../../../app/components/LoadingSpinner/LoadingSpinner'
import { VIEW_MODE } from '../../../shared/ducks/ui/ui'
import MapDetailResult from '../../components/detail-result/MapDetailResult'
import MapSearchResults from '../../components/search-results/MapSearchResults'

const previewPanelSearchResultLimit = 3

class MapPreviewPanel extends React.Component {
  constructor() {
    super()
    this.onPanoPreviewClick = this.onPanoPreviewClick.bind(this)
  }

  onPanoPreviewClick() {
    const { openPano, panoPreview, detailLocation } = this.props
    openPano(panoPreview.id, panoPreview.heading, detailLocation)
  }

  render() {
    const { props } = this
    const isLoading = props?.dataSearch?.isLoading ?? props?.mapDetail?.isLoading
    const isDetailPage =
      !props.isSearchPreview && !isLoading && props.detail && props.mapDetail && props.detailResult

    const openDetailEndpoint = () => props.openDetail(props.detail)
    const onMaximize = () => props.onSearchMaximize(VIEW_MODE.SPLIT)

    return (
      <div className="map-preview-panel-wrapper">
        <section className="map-preview-panel map-preview-panel--visible">
          <div className="map-preview-panel__heading">
            <button
              type="button"
              className="map-preview-panel__button map-preview-panel__button--expand"
              onClick={isDetailPage ? openDetailEndpoint : onMaximize}
              title="Volledige weergave tonen"
            >
              <span
                className="
                map-preview-panel__button-icon
                map-preview-panel__button-icon--maximize"
              />
            </button>
            <button
              type="button"
              className="map-preview-panel__button"
              onClick={props.closePanel}
              title="Sluiten"
            >
              <span
                className="
                map-preview-panel__button-icon
                map-preview-panel__button-icon--close"
              />
            </button>
          </div>
          <div
            className={`
              map-preview-panel__body
              map-preview-panel__body--${isLoading ? 'loading' : 'loaded'}
            `}
          >
            {isLoading && <LoadingSpinner />}
            {isDetailPage && (
              <MapDetailResult
                panoUrl={props.panoPreview?.url}
                onMaximize={openDetailEndpoint}
                onPanoPreviewClick={this.onPanoPreviewClick}
                result={props.detailResult}
              />
            )}
            {!isDetailPage && props.isSearchLoaded && props.searchLocation && (
              <MapSearchResults
                location={props.searchLocation}
                missingLayers={props.missingLayers}
                onItemClick={props.openPreviewDetail}
                onMaximize={onMaximize}
                onPanoPreviewClick={this.onPanoPreviewClick}
                panoUrl={props.panoPreview?.url}
                resultLimit={previewPanelSearchResultLimit}
                results={props.searchResults}
                isEmbed={props.isEmbed}
              />
            )}
          </div>
        </section>
      </div>
    )
  }
}

MapPreviewPanel.defaultProps = {
  detail: {},
  detailResult: {},
  isEmbed: false,
  mapDetail: {},
  missingLayers: '',
  panoPreview: {},
  searchResults: [],
  search: {},
  searchLocation: null,
  searchLocationId: '',
  user: {},
}

/* eslint-disable react/no-unused-prop-types */
MapPreviewPanel.propTypes = {
  detail: PropTypes.shape({}),
  detailResult: PropTypes.shape({}),
  isEmbed: PropTypes.bool,
  mapDetail: PropTypes.shape({}),
  missingLayers: PropTypes.string,
  detailLocation: PropTypes.arrayOf(PropTypes.string).isRequired,
  closePanel: PropTypes.func.isRequired,
  openDetail: PropTypes.func.isRequired,
  // onMapPreviewPanelMaximizeSearch: PropTypes.func.isRequired,
  // onMapSearchResultsItemClick: PropTypes.func.isRequired,
  openPano: PropTypes.func.isRequired,
  panoPreview: PropTypes.shape({}),
  searchResults: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  search: PropTypes.shape({}),
  searchLocation: PropTypes.shape({}),
  searchLocationId: PropTypes.string,
  user: PropTypes.shape({}),
}

export default MapPreviewPanel
