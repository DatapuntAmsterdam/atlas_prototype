import { connect } from 'react-redux'
import { getUser } from '../../../shared/ducks/user/user'
import {
  getPanoramaPreview,
  isPanoramaPreviewLoading,
} from '../../../panorama/ducks/preview/panorama-preview'
import Detail from './Detail'
import {
  getDetailData,
  getDetailEndpoint,
  getDetailFilterSelection,
  getDetailTemplateUrl,
  getID,
  getSubType,
  isDetailLoading,
} from '../../../shared/ducks/detail/selectors'

const mapStateToProps = state => ({
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
