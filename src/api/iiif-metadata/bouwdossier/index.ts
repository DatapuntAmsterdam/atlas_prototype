import fixtureSingle from './bouwdossier.json'
import fixtureList from './bouwdossier-list.json'
import { Single, List } from './types'

export const singleFixture = fixtureSingle as Single
export const listFixture = fixtureList as List
export const path = 'iiif-metadata/bouwdossier/'
export const fixtureId = 'SA84102'

export * from './getBouwdossierById'
export * from './types'
