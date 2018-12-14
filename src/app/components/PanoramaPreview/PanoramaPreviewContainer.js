import { connect } from 'react-redux';
import PanoramaPreview from './PanoramaPreview';
import {
  getPanoramaPreview,
  isPanoramaPreviewLoading
} from '../../../shared/ducks/panorama/preview/panorama-preview';

const mapStateToProps = (state) => ({
  panoramaPreview: getPanoramaPreview(state),
  isLoading: isPanoramaPreviewLoading(state)
});

export default connect(mapStateToProps, null)(PanoramaPreview);
