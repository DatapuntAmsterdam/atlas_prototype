import fixtureSingle from './woonplaatsen.json'
import fixtureList from './woonplaatsen-list.json'
import { Single } from './types'
import { HALList } from '../../../types'

type List = HALList<{ woonplaatsen: Single[] }>

export const singleFixture = fixtureSingle as Single
export const listFixture = fixtureList as List
export const fixtureId = '1024'
export const path = 'v1/bag/woonplaatsen/'

export { Single, List }
