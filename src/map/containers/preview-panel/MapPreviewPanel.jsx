import PropTypes from 'prop-types'
import { Close } from '@amsterdam/asc-assets'
import { Button } from '@amsterdam/asc-ui'
import LoadingSpinner from '../../../app/components/LoadingSpinner/LoadingSpinner'
import { ViewMode } from '../../../shared/ducks/ui/ui'
import MapDetailResult from '../../components/detail-result/MapDetailResult'
import MapSearchResults from '../../components/search-results/MapSearchResults'
import PAGES from '../../../app/pages'
import MaximizeIcon from '../../../shared/assets/icons/maximize.svg'

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
  const onMaximize = () => onSearchMaximize(ViewMode.Split)

  return (
    <div className="map-preview-panel-wrapper">
      <section className="map-preview-panel map-preview-panel--visible">
        <div className="map-preview-panel__heading">
          <Button
            type="button"
            variant="blank"
            aria-label="Volledige weergave tonen"
            data-testid="mapPreviewMaximize"
            size={28}
            icon={<MaximizeIcon />}
            iconSize={24}
            onClick={isDetailPage ? openDetailEndpoint : onMaximize}
          />
          <Button
            type="button"
            variant="blank"
            aria-label="Sluiten"
            size={28}
            icon={<Close />}
            iconSize={15}
            onClick={closePanel}
          />
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
