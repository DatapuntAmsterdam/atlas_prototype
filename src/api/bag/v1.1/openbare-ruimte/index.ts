import fixtureSingle from './openbare_ruimte.json'
import fixtureList from './openbare_ruimte-list.json'
import type { Single, List } from './types'

export const singleFixture = fixtureSingle as Single
export const listFixture = fixtureList as List
export const path = 'bag/v1.1/openbareruimte/'
export const fixtureId = '0363300000005904'
