import MatomoTracker from '@datapunt/matomo-tracker-js'
import matomoMiddleware from './matomoMiddleware'

jest.mock('@datapunt/matomo-tracker-js')
jest.mock('./trackEvents', () => ({
  YOUR_ACTION_TYPE: ({ tracking }) => ['foo', 'foo', tracking, null],
}))

describe('matomoMiddleware', () => {
  let next
  const store = jest.fn()
  store.getState = jest.fn(() => ({
    user: { authenticated: false, scopes: [] },
    ui: {},
  }))

  const trackMock = jest.fn()

  beforeEach(() => {
    MatomoTracker.mockImplementation(() => ({
      track: trackMock,
    }))

    next = jest.fn()
  })

  afterEach(() => {
    trackMock.mockReset()
  })

  it('should send a request to matomo if action should be tracked', () => {
    const action = { type: 'YOUR_ACTION_TYPE', meta: { tracking: 'data' } }

    matomoMiddleware(store)(next)(action)

    expect(trackMock).toHaveBeenCalled()
  })

  it('should send a request to matomo if action should be tracked and has NO tracking metadata', () => {
    const action = { type: 'YOUR_ACTION_TYPE', meta: { tracking: false } }

    matomoMiddleware(store)(next)(action)

    expect(trackMock).not.toHaveBeenCalled()
  })

  it('should NOT send a request to matomo if action should NOT be tracked', () => {
    const action = { type: 'YOUR_ACTION_TYPE_2', meta: { tracking: 'data' } }

    matomoMiddleware(store)(next)(action)

    expect(trackMock).not.toHaveBeenCalled()
  })
})
