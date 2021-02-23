import fixtureSingle from './ligplaatsen.json'
import fixtureList from './ligplaatsen-list.json'
import { Single } from './types'
import { HALList } from '../../../types'

type List = HALList<{ ligplaatsen: Single[] }>

export const singleFixture = fixtureSingle as Single
export const listFixture = fixtureList as List
export const fixtureId = '0363020000544489'
export const path = 'v1/bag/ligplaatsen/'

export { Single, List }
