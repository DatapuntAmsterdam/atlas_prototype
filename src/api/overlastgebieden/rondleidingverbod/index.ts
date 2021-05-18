import fixtureSingle from './rondleidingverbod.json'
import fixtureList from './rondleidingverbod-list.json'
import type { Single } from '../types'
import type { HALList } from '../../types'

type List = HALList<{
  rondleidingverbod: Single[]
}>

export const singleFixture = fixtureSingle as Single
export const listFixture = fixtureList as List
export const path = 'v1/overlastgebieden/rondleidingverbod/'
export const fixtureId = 1
