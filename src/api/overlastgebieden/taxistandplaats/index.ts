import fixtureSingle from './taxistandplaats.json'
import fixtureList from './taxistandplaats-list.json'
import { Single } from '../types'
import { HALList } from '../../types'

type List = HALList<{
  taxistandplaats: Single[]
}>

export const singleFixture = fixtureSingle as Single
export const listFixture = fixtureList as List
export const path = 'v1/overlastgebieden/taxistandplaats/'
export const fixtureId = 2
