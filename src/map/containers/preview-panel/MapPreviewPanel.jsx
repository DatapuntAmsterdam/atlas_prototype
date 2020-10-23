import PropTypes from 'prop-types'
import React from 'react'
import LoadingSpinner from '../../../app/components/LoadingSpinner/LoadingSpinner'
import { VIEW_MODE } from '../../../shared/ducks/ui/ui'
import MapDetailResult from '../../components/detail-result/MapDetailResult'
import MapSearchResults from '../../components/search-results/MapSearchResults'
import PAGES from '../../../app/pages'

const previewPanelSearchResultLimit = 3

const MapPreviewPanel = ({
  dataSearch,
  mapDetail,
  currentPage,
  openDetail,
  onSearchMaximize,
  closePanel,
  isSearchLoaded,
  searchLocation,
  missingLayers,
  openPreviewDetail,
  searchResults,
  detail,
  isEmbed,
}) => {
  const isLoading = dataSearch?.isLoading ?? mapDetail?.isLoading
  const isDetailPage = currentPage === PAGES.DATA_DETAIL

  const openDetailEndpoint = () => openDetail(detail)
  const onMaximize = () => onSearchMaximize(VIEW_MODE.SPLIT)

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
            onClick={closePanel}
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
          {isDetailPage && <MapDetailResult onMaximize={openDetailEndpoint} />}
          {!isDetailPage && isSearchLoaded && searchLocation && (
            <MapSearchResults
              location={searchLocation}
              missingLayers={missingLayers}
              onItemClick={openPreviewDetail}
              onMaximize={onMaximize}
              resultLimit={previewPanelSearchResultLimit}
              results={searchResults}
              isEmbed={isEmbed}
            />
          )}
        </div>
      </section>
    </div>
  )
}

MapPreviewPanel.defaultProps = {
  detail: {},
  isEmbed: false,
  mapDetail: {},
  missingLayers: '',
  searchResults: [],
  search: {},
  searchLocation: null,
  searchLocationId: '',
  user: {},
}

/* eslint-disable react/no-unused-prop-types */
MapPreviewPanel.propTypes = {
  detail: PropTypes.shape({}),
  isEmbed: PropTypes.bool,
  currentPage: PropTypes.string.isRequired,
  mapDetail: PropTypes.shape({}),
  missingLayers: PropTypes.string,
  detailLocation: PropTypes.arrayOf(PropTypes.string).isRequired,
  closePanel: PropTypes.func.isRequired,
  openDetail: PropTypes.func.isRequired,
  openPano: PropTypes.func.isRequired,
  searchResults: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  search: PropTypes.shape({}),
  searchLocation: PropTypes.shape({}),
  searchLocationId: PropTypes.string,
  user: PropTypes.shape({}),
}

export default MapPreviewPanel
