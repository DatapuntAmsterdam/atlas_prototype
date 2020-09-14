import { select } from 'redux-saga/effects'
import { getDetail } from '../../shared/ducks/detail/selectors'
import { getViewMode, VIEW_MODE } from '../../shared/ducks/ui/ui'
import { getUserScopes } from '../../shared/ducks/user/user'
import { fetchWithToken } from '../../shared/services/api/api'

export default function* getDetailData(endpoint, mapDetail = {}) {
  const { type, subtype } = yield select(getDetail)

  const scopes = yield select(getUserScopes)
  const viewMode = yield select(getViewMode)

  // Construct the url to the location of the Angular template file
  let includeSrc = ''

  if (type && subtype) {
    includeSrc = `modules/detail/components/detail/templates/${type}/${subtype}.html`
  }

  if (
    (type === 'brk' && subtype === 'subject' && !scopes.includes('BRK/RS')) ||
    (type === 'handelsregister' && !scopes.includes('HR/R'))
  ) {
    // User is not authorized to view
    // BRK Kadastrale subjecten or handelsregister
    // so do not fetch data
    return {
      includeSrc,
      data: null,
    }
  }

  // This saga will retrieve additional/formatted data that's only used by the split and full mode detail view
  if (viewMode !== VIEW_MODE.MAP) {
    // When the detail pages for Angular are refactored, the data can be retrieved in a similar fashion as for the MapDetail pages
    const data = yield fetchWithToken(endpoint)
    const formatedData = {
      ...mapDetail,
      ...data,
    }

    return {
      includeSrc,
      data: formatedData,
      filterSelection: {
        [subtype]: formatedData.naam,
      },
    }
  }

  return ''
}
