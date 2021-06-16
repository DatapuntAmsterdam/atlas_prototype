import fixtureSingle from './meting.json'
import fixtureList from './meting-list.json'
import type { List, Single } from './types'

export type { List }
export const singleFixture = fixtureSingle as Single
export const listFixture = fixtureList as List
export const path = 'meetbouten/meting/'
export const fixtureId = '10381459'
