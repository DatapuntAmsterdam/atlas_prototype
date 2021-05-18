import fixture from './thumbnail.json'
import type { PanoramaThumbnail } from './types'

export * from './getPanoramaThumbnail'
export * from './types'
export const singleFixture = fixture as PanoramaThumbnail
export const path = 'panorama/thumbnail/'
export const fixtureId = null
