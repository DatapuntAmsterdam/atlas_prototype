import React from 'react';
import get from 'lodash.get';
import PropTypes from 'prop-types';
import has from 'lodash.has';
import { toggleMapFullscreen } from '../../../shared/ducks/ui/ui';
import LoadingIndicator from '../../../shared/components/loading-indicator/LoadingIndicator';
import MapDetailResult from '../../components/detail-result/MapDetailResult';
import MapSearchResults from '../../components/search-results/MapSearchResults';
import { getMapDetail } from '../../ducks/detail/map-detail';
import { getPanoPreview } from '../../../pano/ducks/preview/pano-preview';
import { getMapSearchResults } from '../../ducks/search-results/map-search-results';

import piwikTracker from '../../../shared/services/piwik-tracker/piwik-tracker';

const previewPanelSearchResultLimit = 3;

const isUpdated = (props, prevProps, paths) => {
  if (typeof paths === 'string') {
    const newValue = get(props, paths);
    const oldValue = get(prevProps, paths);
    return newValue && oldValue !== newValue;
  }

  // Every path must exist in props
  return paths.every((path) => has(props, path)) &&
    // Some paths must have been updated
    paths.some((path) => isUpdated(props, prevProps, path));
};

const update = (dispatch, props, prevProps = {}) => {
  // Don't just copy this. It's an anti-pattern.
  if (isUpdated(props, prevProps, 'detail.endpoint')) {
    dispatch(getMapDetail(props.detail.endpoint, props.user));
  } else if (isUpdated(props, prevProps, 'detailResult.location')) {
    dispatch(getPanoPreview(props.detailResult.location));
  } else if (isUpdated(props, prevProps, ['searchLocation.latitude', 'searchLocation.longitude'])) {
    dispatch(getMapSearchResults(props.searchLocation, props.user));
    dispatch(getPanoPreview(props.searchLocation));
  }
};

class MapPreviewPanel extends React.Component {
  constructor() {
    super();
    this.onPanoPreviewClick = this.onPanoPreviewClick.bind(this);
    this.onDisplayAllResults = this.onDisplayAllResults.bind(this);
  }

  componentDidMount() {
    // Don't just copy this. It's an anti-pattern.
    update(this.context.store.dispatch, this.props);
  }

  componentDidUpdate(prevProps) {
    // Don't just copy this. It's an anti-pattern.
    update(this.context.store.dispatch, this.props, prevProps);
  }

  // TODO DP-6031: Create Redux Middelware, map Piwik events to ACTIONS
  onDisplayAllResults(mapClickLocation) {
    const piwik = {
      TRACK_EVENT: 'trackEvent',
      SHOW_ALL_RESULTS: 'show-all-results',
      NAVIGATION: 'navigation'
    };

    piwikTracker([piwik.TRACK_EVENT, piwik.NAVIGATION,
      piwik.SHOW_ALL_RESULTS, window.document.title]);

    return this.props.onSearch(mapClickLocation);
  }

  onPanoPreviewClick() {
    const { onOpenPanoById, search, pano } = this.props;
    const location = search ? search.location.join(',') : `${pano.location.latitude},${pano.location.longitude}`;
    const selectedPano = pano.previews[location];
    if (!selectedPano) {
      return;
    }
    this.context.store.dispatch(onOpenPanoById(selectedPano));
    this.context.store.dispatch(toggleMapFullscreen());
  }

  render() {
    const props = this.props;
    const detailLocationId = get(props, 'detailResult.location') && Object
      .keys(props.detailResult.location)
      .map((key) => props.detailResult.location[key])
      .toString();
    const panoSearchPreview = get(props, `pano.previews['${props.searchLocationId}']`, {});
    const panoDetailPreview = get(props, `pano.previews['${detailLocationId}']`, {});
    const showDisplayAllResultsButton = get(props, 'detail.skippedSearchResults');
    const isLoading = get(props, 'search.isLoading') || get(props, 'mapDetail.isLoading');
    const isSearchLoaded = !isLoading && props.search && props.searchLocation;
    const isDetailLoaded = !isLoading && props.detail && props.mapDetail && props.detailResult;

    return !props.isEmbed && (
      <div className="map-preview-panel-wrapper">
        <section className={`
          map-preview-panel
          map-preview-panel--${props.isMapPreviewPanelVisible ? 'visible' : 'hidden'}
        `}
        >
          <div className="map-preview-panel__heading">
            {showDisplayAllResultsButton && (
              <button
                className="map-preview-panel__button map-preview-panel__button--show-all"
                onClick={() => this.onDisplayAllResults(props.mapClickLocation)}
                title="Alle resultaten tonen"
              >
                <span className="
                  map-preview-panel__button-icon
                  map-preview-panel__button-icon--plus"
                />
                <span className="map-preview-panel__button-label">Alle resultaten tonen</span>
              </button>
            )}
            <button
              className="map-preview-panel__button"
              onClick={props.onMapPreviewPanelMaximize}
              title="Volledige weergave tonen"
            >
              <span className="
                map-preview-panel__button-icon
                map-preview-panel__button-icon--maximize"
              />
            </button>
            <button
              className="map-preview-panel__button"
              onClick={props.onMapPreviewPanelClose}
              title="Sluiten"
            >
              <span className="
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
            {isLoading && (
              <LoadingIndicator />
            )}
            {isDetailLoaded && (
              <MapDetailResult
                panoUrl={panoDetailPreview.url}
                onMaximize={props.onMapPreviewPanelMaximize}
                onPanoPreviewClick={this.onPanoPreviewClick}
                result={props.detailResult}
              />
            )}
            {!isDetailLoaded && isSearchLoaded && (
              <MapSearchResults
                location={props.searchLocation}
                missingLayers={props.missingLayers}
                onItemClick={props.onMapSearchResultsItemClick}
                onMaximize={props.onMapPreviewPanelMaximize}
                onPanoPreviewClick={this.onPanoPreviewClick}
                panoUrl={panoSearchPreview.url}
                resultLimit={previewPanelSearchResultLimit}
                results={props.results}
              />
            )}
          </div>
        </section>
      </div>
    );
  }
}

MapPreviewPanel.contextTypes = {
  store: PropTypes.object.isRequired
};

MapPreviewPanel.defaultProps = {
  detail: {},
  detailResult: {},
  isEmbed: false,
  isMapPreviewPanelVisible: false,
  mapDetail: {},
  missingLayers: '',
  pano: {},
  results: [],
  search: {},
  searchLocation: null,
  searchLocationId: '',
  user: {}
};

/* eslint-disable react/no-unused-prop-types */
MapPreviewPanel.propTypes = {
  detail: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  detailResult: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  isEmbed: PropTypes.bool,
  isMapPreviewPanelVisible: PropTypes.bool,
  mapDetail: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  missingLayers: PropTypes.string,
  onMapPreviewPanelClose: PropTypes.func.isRequired,
  onMapPreviewPanelMaximize: PropTypes.func.isRequired,
  onMapSearchResultsItemClick: PropTypes.func.isRequired,
  onOpenPanoById: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  pano: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  results: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  search: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  searchLocation: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  searchLocationId: PropTypes.string,
  user: PropTypes.object // eslint-disable-line react/forbid-prop-types
};

export default MapPreviewPanel;
