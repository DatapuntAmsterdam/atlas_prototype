import getState from '../redux/get-state'
import ActiveOverlaysDefault, { ActiveOverlays } from './active-overlays'

jest.mock('../redux/get-state')

describe('ActiveOverlays', () => {
  beforeEach(() => {
    getState.mockImplementation(() => ({
      user: {},
      map: {
        zoom: 3,
      },
      mapLayers: {
        layers: {
          items: [
            {
              id: 'biz',
            },
            {
              id: 2,
              legendItems: [
                {
                  id: 'hvo',
                },
              ],
              authScope: true,
            },
          ],
        },
      },
    }))
  })

  afterEach(() => {
    getState.mockReset()
  })

  describe('static isVisibleAtCurrentZoom', () => {
    it("should return false is layer is not in mapLayers or when layer doesn't have a minZoom", () => {
      expect(ActiveOverlays.isVisibleAtCurrentZoom('hvo', 2)).toBe(false)
      expect(ActiveOverlays.isVisibleAtCurrentZoom('bladie', 1)).toBe(false)
    })
  })
  describe('getOverlays', () => {
    it('should return an array with the active layers', () => {
      ActiveOverlaysDefault.allOverlays = [
        {
          id: 'biz',
        },
        {
          id: 'hvo',
        },
      ]
      expect(ActiveOverlaysDefault.getOverlays()).toEqual([
        {
          id: 'biz',
        },
      ])
    })

    it("should return an empty array when mapLayers doesn't contain a id matching the allOverlays", () => {
      getState.mockReset()
      getState.mockImplementation(() => ({
        user: {},
        map: {
          zoom: 3,
        },
        mapLayers: {
          layers: {
            items: [
              {
                id: 'other',
              },
              {
                id: 2,
                legendItems: [
                  {
                    id: 'not',
                  },
                ],
                authScope: true,
              },
            ],
          },
        },
      }))

      ActiveOverlaysDefault.allOverlays = [
        {
          id: 'biz',
        },
        {
          id: 'hvo',
        },
      ]
      expect(ActiveOverlaysDefault.getOverlays()).toEqual([])
    })
  })

  describe('getVisibleSources', () => {
    it('should return an empty array', () => {
      ActiveOverlaysDefault.allOverlays = [
        {
          id: 'biz',
          isVisible: true,
        },
        {
          id: 'hvo',
        },
      ]
      expect(ActiveOverlaysDefault.getVisibleSources('biz')).toEqual([])
    })

    it('should filter', () => {
      ActiveOverlaysDefault.allOverlays = [
        {
          id: 'biz',
          isVisible: true,
        },
        {
          id: 'hvo',
        },
      ]
      ActiveOverlaysDefault.isVisibleAtCurrentZoom = jest.fn().mockReturnValue(true)
      expect(ActiveOverlaysDefault.getVisibleSources('biz')).toEqual([])
    })
  })

  describe('getOverlaysWarning', () => {
    beforeEach(() => {})
    it('should return an empty string', () => {
      ActiveOverlays.isAuthorised = jest.fn().mockImplementation(() => true)
      ActiveOverlays.isVisibleAtCurrentZoom = jest.fn().mockImplementation(() => true)
      ActiveOverlaysDefault.getVisibleSources = jest.fn().mockImplementation(() => [])
      ActiveOverlaysDefault.allOverlays = [
        {
          id: 'biz',
          isVisible: true,
        },
        {
          id: 'hvo',
          isVisible: true,
        },
      ]
      expect(ActiveOverlaysDefault.getOverlaysWarning(1)).toBe('')
    })

    it('should build a string from an array of objects that have a label_short and noDetail key set to true', () => {
      ActiveOverlaysDefault.getVisibleSources = jest.fn().mockImplementation(() => [
        {
          noDetail: true,
          label_short: 'label one',
        },
        {
          noDetail: true,
          label_short: 'label two',
        },
      ])

      expect(ActiveOverlaysDefault.getOverlaysWarning(1)).toBe('label one, label two')
    })
  })
})
