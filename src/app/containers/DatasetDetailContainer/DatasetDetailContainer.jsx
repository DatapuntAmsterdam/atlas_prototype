import { connect } from 'react-redux'
import {
  isDetailLoading,
  getDetailTemplateUrl,
  getDetailData,
} from '../../../shared/ducks/detail/selectors'
import { getUser } from '../../../shared/ducks/user/user'
import { getApiSpecificationData } from '../../../shared/ducks/datasets/datasets'
import { getLocationPayload } from '../../../store/redux-first-router/selectors'
import DatasetDetail from './DatasetDetail'
import SHARED_CONFIG from '../../../shared/services/shared-config/shared-config'
import linkAttributesFromAction from '../../../shared/services/link-attributes-from-action/linkAttributesFromAction'
import { toDatasetDetail } from '../../../store/redux-first-router/actions'
import useSlug from '../../utils/useSlug'

const mapStateToProps = state => ({
  isLoading: isDetailLoading(state),
  catalogFilters: getApiSpecificationData(state),
  user: getUser(state),
  endpoint: `${SHARED_CONFIG.API_ROOT}dcatd/datasets/${getLocationPayload(state).id}`,
  // construct the canonical href and meta description using the result from the api

  action: getDetailData(state)
    ? linkAttributesFromAction(
        toDatasetDetail({
          id: getDetailData(state)['dct:identifier'],
          slug: useSlug(getDetailData(state)['dct:title']),
        }),
      )
    : false,
  description: getDetailData(state) ? getDetailData(state)['dct:description'] : false,

  detailTemplateUrl: getDetailTemplateUrl(state),
  detailData: getDetailData(state),
})

export default connect(
  mapStateToProps,
  null,
)(DatasetDetail)
