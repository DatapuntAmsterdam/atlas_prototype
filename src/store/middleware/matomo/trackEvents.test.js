import { MATOMO_CONSTANTS } from '../../../app/matomo'
import PAGES from '../../../app/pages'
import { VIEW_MODE } from '../../../shared/ducks/ui/ui'
import PARAMETERS from '../../parameters'
import { routing, ROUTER_NAMESPACE } from '../../../app/routes'

import trackEvents, {
  TRACK_ACTION_NAVIGATION,
  TRACK_CATEGORY_AUTO_SUGGEST,
  TRACK_NAME_ENLARGE_DETAIL_MAP,
  TRACK_NAME_FULL_DETAIL,
  TRACK_NAME_LEAVE_PANO,
} from './trackEvents'

describe('trackEvents', () => {
  it('matches the snapshot', () => {
    // snapshots generally don't offer much value, but in this case, since the value of trackEvents is an object with
    // keys that are specific to the sections in the application that need to be tracked, it's worthwhile to generate
    // a snaphot of the entire object so that any changes will be more easily picked up
    expect(trackEvents).toMatchSnapshot()
  })

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

    it('should return data for when the map is the view mode', () => {
      const payload = { state: { ui: { viewMode: VIEW_MODE.MAP } } }

      expect(dataDetailTrackingFunc(payload)).toEqual([
        MATOMO_CONSTANTS.TRACK_EVENT,
        TRACK_ACTION_NAVIGATION,
        TRACK_NAME_FULL_DETAIL,
        null,
      ])
    })

    it('should return data for when split is the view mode', () => {
      const payload = {
        state: { ui: { viewMode: VIEW_MODE.SPLIT } },
        isFirstAction: false,
        query: { [PARAMETERS.VIEW]: VIEW_MODE.MAP },
      }

      expect(dataDetailTrackingFunc(payload)).toEqual([
        MATOMO_CONSTANTS.TRACK_EVENT,
        TRACK_ACTION_NAVIGATION,
        TRACK_NAME_ENLARGE_DETAIL_MAP,
        null,
      ])

      expect(dataDetailTrackingFunc({ ...payload, isFirstAction: true })).toEqual([])
      expect(dataDetailTrackingFunc({ ...payload, query: {} })).toEqual([])
      expect(dataDetailTrackingFunc({ ...payload, query: undefined })).toEqual([])
    })

    it('should return data for when page is a panoramo page', () => {
      const payload = {
        state: {
          ui: { viewMode: VIEW_MODE.SPLIT },
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
