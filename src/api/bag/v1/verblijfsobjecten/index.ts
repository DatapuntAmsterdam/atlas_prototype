import fixtureSingle from './verblijfsobjecten.json'
import fixtureList from './verblijfsobjecten-list.json'
import { Single } from './types'
import { BagList } from '../types'

type List = BagList<{ verblijfsobjecten: Single[] }>

export const singleFixture = fixtureSingle as Single
export const listFixture = fixtureList as List
export const fixtureId = '0363010000543292'
export const path = 'v1/bag/verblijfsobjecten/'

export { Single, List }
