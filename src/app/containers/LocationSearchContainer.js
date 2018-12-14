import { connect } from 'react-redux';
import { getUser } from '../../shared/ducks/user/user';
import {
  getDataSearchError,
  getDataSearchLocation,
  getMapListResults,
  getNumberOfResults,
  isSearchLoading
} from '../../shared/ducks/data-search/selectors';
import { getPanoramaPreview } from '../../shared/ducks/panorama/preview/panorama-preview';
import LocationSearch from '../components/LocationSearch/LocationSearch';

const mapStateToProps = (state) => ({
  isLoading: isSearchLoading(state),
  user: getUser(state),
  searchResults: getMapListResults(state),
  numberOfResults: getNumberOfResults(state),
  panoramaPreview: !!getPanoramaPreview(state),
  location: getDataSearchLocation(state),
  layerWarning: getDataSearchError(state)
});

export default connect(mapStateToProps, null)(LocationSearch);

