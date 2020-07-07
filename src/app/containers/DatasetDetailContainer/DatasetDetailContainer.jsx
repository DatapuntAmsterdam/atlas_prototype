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
import linkAttributesFromAction from '../../../shared/services/link-attributes-from-action/linkAttributesFromAction'
import { toDatasetDetail } from '../../../store/redux-first-router/actions'
import useSlug from '../../utils/useSlug'
import environment from '../../../environment'

const mapStateToProps = (state) => {
  const isLoading = isDetailLoading(state)

  return {
    isLoading,
    catalogFilters: getApiSpecificationData(state),
    user: getUser(state),
    endpoint: `${environment.API_ROOT}dcatd/datasets/${getLocationPayload(state).id}`,
    // construct the canonical href and meta description using the result from the api

    action:
      !isLoading && getDetailData(state)
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
  }
}

export default connect(mapStateToProps, null)(DatasetDetail)
