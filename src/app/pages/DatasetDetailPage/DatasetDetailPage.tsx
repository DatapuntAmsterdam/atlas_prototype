/* eslint-disable global-require */
import React, { FunctionComponent } from 'react'
// @ts-ignore
import { AngularWrapper } from 'react-angular'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import environment from '../../../environment'
import { getApiSpecificationData } from '../../../shared/ducks/datasets/datasets'
import {
  getDetailData,
  getDetailTemplateUrl,
  isDetailLoading,
} from '../../../shared/ducks/detail/selectors'
import { getUser } from '../../../shared/ducks/user/user'
import linkAttributesFromAction from '../../../shared/services/link-attributes-from-action/linkAttributesFromAction'
import { toDatasetDetail } from '../../../store/redux-first-router/actions'
import ShareBar from '../../components/ShareBar/ShareBar'
import toSlug from '../../utils/toSlug'

let angularInstance: any = null

if (typeof window !== 'undefined') {
  require('../../angularModules')
  angularInstance = require('angular')
}

interface DatasetDetailPageParams {
  id: string
}

const DatasetDetailPage: FunctionComponent = () => {
  const { id } = useParams<DatasetDetailPageParams>()
  const user = useSelector(getUser)
  const isLoading = useSelector(isDetailLoading)
  const catalogFilters = useSelector(getApiSpecificationData)
  const detailData = useSelector(getDetailData)
  const detailTemplateUrl = useSelector(getDetailTemplateUrl)
  const description = detailData['dct:description'] ?? null
  const endpoint = `${environment.API_ROOT}dcatd/datasets/${id}`
  const action =
    !isLoading && detailData
      ? linkAttributesFromAction(
          toDatasetDetail({
            id: detailData['dct:identifier'],
            slug: toSlug(detailData['dct:title']),
          }),
        )
      : null

  return (
    <div className="c-dashboard__content qa-detail">
      <Helmet>
        {action && action.href && <link rel="canonical" href={action.href} />}
        {description && <meta name="description" content={description} />}
      </Helmet>
      {!isLoading && angularInstance && (
        <AngularWrapper
          moduleName="dpDetailWrapper"
          component="dpDetail"
          dependencies={['atlas']}
          angularInstance={angularInstance}
          bindings={{
            isLoading,
            catalogFilters,
            user,
            detailTemplateUrl,
            detailData,
          }}
          interpolateBindings={{
            endpoint,
          }}
        />
      )}
      <div className="u-row">
        <div className="u-col-sm--12">
          <div className="u-margin__left--2 u-margin__bottom--2">
            <ShareBar />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatasetDetailPage
