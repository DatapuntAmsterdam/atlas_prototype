import fixtureSingle from './algemeenoverlast.json'
import fixtureList from './algemeenoverlast-list.json'
import type { Single } from '../types'
import type { HALList } from '../../types'

type List = HALList<{
  algemeenoverlast: Single[]
}>

export const singleFixture = fixtureSingle as Single
export const listFixture = fixtureList as List
export const path = 'v1/overlastgebieden/algemeenoverlast/'
export const fixtureId = 1
