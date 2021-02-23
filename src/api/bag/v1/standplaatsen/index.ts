import fixtureSingle from './standplaatsen.json'
import fixtureList from './standplaatsen-list.json'
import { Single } from './types'
import { HALList } from '../../../types'

type List = HALList<{ standplaatsen: Single[] }>

export const singleFixture = fixtureSingle as Single
export const listFixture = fixtureList as List
export const fixtureId = '0363030000612614'
export const path = 'v1/bag/standplaatsen/'

export { Single, List }
