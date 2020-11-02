import { testSaga } from 'redux-saga-test-plan'
import { fetchDetailEffect } from './map-detail'
import { getMapDetail } from '../../ducks/detail/actions'
import { closeMapPanel } from '../../ducks/map/actions'
import { VIEW_MODE } from '../../../shared/ducks/ui/ui'
import { getDetailEndpoint } from '../../../shared/ducks/detail/selectors'

describe('fetchDetailEffect', () => {
  it('should close the map panel if navigating to the split view', () => {
    const action = {
      meta: {
        location: {
          prev: { query: { modus: VIEW_MODE.MAP } },
          current: { query: { modus: VIEW_MODE.SPLIT } },
        },
      },
    }
    testSaga(fetchDetailEffect, action)
      .next()
      .put(closeMapPanel())
      .next()
      .select(getDetailEndpoint)
      .next('endpoint')
      .put(getMapDetail('endpoint'))
      .next()
      .isDone()
  })

  it('should close the map panel if not switching to SPLIT view', () => {
    const action = {
      meta: {
        location: {
          prev: { query: { modus: VIEW_MODE.SPLIT } },
          current: { query: { modus: VIEW_MODE.SPLIT } },
        },
      },
    }
    testSaga(fetchDetailEffect, action)
      .next()
      .select(getDetailEndpoint)
      .next('endpoint')
      .put(getMapDetail('endpoint'))
      .next()
      .isDone()
  })
})
