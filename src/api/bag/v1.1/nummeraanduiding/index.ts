import fixtureSingle from './nummeraanduiding.json'
import fixtureList from './nummeraanduiding-list.json'
import type { List, Single } from './types'

export type { Single, List }
export const singleFixture = fixtureSingle as Single
export const listFixture = fixtureList as List
export const path = 'bag/v1.1/nummeraanduiding/'
export const fixtureId = '0363200000006110'
