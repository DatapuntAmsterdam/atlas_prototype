import fixtureSingle from './panden.json'
import fixtureList from './panden-list.json'
import type { Single } from './types'
import type { HALList } from '../../../types'

type List = HALList<{ panden: Single[] }>

export const singleFixture = fixtureSingle as Single
export const listFixture = fixtureList as List
export const fixtureId = '0363100012061164'
export const path = 'v1/bag/panden/'

export type { Single, List }
