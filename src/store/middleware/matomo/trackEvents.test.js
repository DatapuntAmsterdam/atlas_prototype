import { MATOMO_CONSTANTS } from '../../../app/matomo'
import PAGES from '../../../app/pages'
import { ROUTER_NAMESPACE, routing } from '../../../app/routes'
import { ViewMode } from '../../../shared/ducks/ui/ui'
import trackEvents, {
  TRACK_ACTION_NAVIGATION,
  TRACK_CATEGORY_AUTO_SUGGEST,
  TRACK_NAME_LEAVE_PANO,
} from './trackEvents'

describe('trackEvents', () => {
  describe('data detail tracking', () => {
    const dataDetailTrackingFunc = trackEvents[routing.dataDetail.type]
    const trackingPayload = { state: { ui: { viewMode: undefined } } }

    it('should return an empty array when the view mode has not been set', () => {
      expect(dataDetailTrackingFunc(trackingPayload)).toEqual([])
      expect(dataDetailTrackingFunc({ ...trackingPayload, tracking: null })).toEqual([])
    })

    it('should return data for the auto-suggest event', () => {
      const trackingObj = { event: TRACK_CATEGORY_AUTO_SUGGEST, category: 'foo', query: 'bar' }

      expect(dataDetailTrackingFunc({ ...trackingPayload, tracking: trackingObj })).toEqual([
        MATOMO_CONSTANTS.TRACK_EVENT,
        TRACK_CATEGORY_AUTO_SUGGEST,
        trackingObj.category,
        trackingObj.query,
      ])

      expect(
        dataDetailTrackingFunc({ ...trackingPayload, tracking: { ...trackingObj, event: 'foo' } }),
      ).toEqual([])
    })

    it('should return data for when page is a panoramo page', () => {
      const payload = {
        state: {
          ui: { viewMode: ViewMode.Split },
          location: { type: `${ROUTER_NAMESPACE}/${PAGES.PANORAMA}` },
        },
      }

      expect(dataDetailTrackingFunc(payload)).toEqual([
        MATOMO_CONSTANTS.TRACK_EVENT,
        TRACK_ACTION_NAVIGATION,
        TRACK_NAME_LEAVE_PANO,
        null,
      ])
    })
  })
})
