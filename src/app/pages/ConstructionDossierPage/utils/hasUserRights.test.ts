import { createUnsecuredToken, Json } from 'jsontokens'
import type { DecodedToken } from '../AuthTokenContext'
import hasUserRights from './hasUserRights'

const defaultScope = ['BD/R']
const extendedScope = ['BD/X']

const VALID_DECODED_TOKEN: DecodedToken = {
  scopes: [],
  sub: 'jane.doe@example.com',
  exp: Date.now() / 1000 + 120,
}

const VALID_TOKEN = createUnsecuredToken(VALID_DECODED_TOKEN as unknown as Json)

describe('hasUserRights', () => {
  it('returns true with no restrictions and default scope', () => {
    const res = hasUserRights(false, defaultScope, null, false)

    expect(res).toBe(true)
  })

  it('returns false with restrictions and default scope', () => {
    const res = hasUserRights(true, defaultScope, null, false)

    expect(res).toBe(false)
  })

  it('returns true with restrictions and extended scope', () => {
    const res = hasUserRights(true, extendedScope, null, false)

    expect(res).toBe(true)
  })

  it('returns true with no restrictions and only a valid token', () => {
    const res = hasUserRights(false, defaultScope, VALID_TOKEN, false)

    expect(res).toBe(true)
  })

  it('returns false with restrictions and only a valid token', () => {
    const res = hasUserRights(true, defaultScope, VALID_TOKEN, false)

    expect(res).toBe(false)
  })

  it('returns false with no restrictions and an expired token', () => {
    const res = hasUserRights(false, defaultScope, VALID_TOKEN, true)

    expect(res).toBe(true)
  })
})
