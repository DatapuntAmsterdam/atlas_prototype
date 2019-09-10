import { select } from 'redux-saga/effects'
import { getUserScopes } from '../../shared/ducks/user/user'
import { getParts, getTemplateUrl } from '../services/endpoint-parser/endpoint-parser'
import { getApiSpecificationData } from '../../shared/ducks/datasets/datasets'
import formatDetailData from '../services/data-formatter/data-formatter'
import { getByUrl } from '../../shared/services/api/api'
import { VIEW_MODE, getViewMode } from '../../shared/ducks/ui/ui'
import fetchByGeoLocation from '../../map/services/vastgoed/vastgoed'

export default function* getDetailData(endpoint, mapDetail = {}) {
  const includeSrc = getTemplateUrl(endpoint)
  const [category, subject] = getParts(endpoint)

  const scopes = yield select(getUserScopes)
  const viewMode = yield select(getViewMode)

  if (
    (category === 'brk' && subject === 'subject' && !scopes.includes('BRK/RS')) ||
    (category === 'handelsregister' && !scopes.includes('HR/R')) ||
    (category === 'grondexploitatie' && !scopes.includes('GREX/R'))
  ) {
    // User is not authorized to view
    //   BRK Kadastrale Subjecten, nor
    //   handelsregister, nor
    //   grondexploitatie
    // so do not fetch data
    return {
      includeSrc,
      data: null,
    }
  }

  // This saga will retrieve additional/formatted data that's only used by the split and full mode detail view
  if (viewMode !== VIEW_MODE.MAP) {
    // Get data from individual endpoints to construct the detail view for vastgoed
    // Can be decoupled when the detail views use a different normalizer than the map detail views
    if (category === 'vsd' && subject === 'vastgoed') {
      const units = yield fetchByGeoLocation(mapDetail.location)

      const data = {
        ...mapDetail,
        units,
      }

      return {
        includeSrc,
        data,
      }
    }

    // TODO console.log('append version=3 to grondexploitaties');
    const endpointVersion = category === 'grondexploitatie' ? '?version=3' : ''
    const catalogFilters = yield select(getApiSpecificationData)

    // TODO replace this call with mapDetail value
    const data = yield getByUrl(`${endpoint}${endpointVersion}`)
    const formatedData = {
      ...mapDetail,
      ...formatDetailData(data, category, subject, catalogFilters, scopes),
    }

    return {
      includeSrc,
      data: formatedData,
      filterSelection: {
        [subject]: formatedData.naam,
      },
    }
  }

  return ''
}
