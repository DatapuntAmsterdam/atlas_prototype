import { Metadata } from './types'
import fixture from './metadata.json'

export const singleFixture = fixture as Metadata[]
export const path = 'metadata/'
export const fixtureId = null

export * from './getMetadata'
export * from './types'
