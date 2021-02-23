import fixtureSingle from './dealeroverlast.json'
import fixtureList from './dealeroverlast-list.json'
import { Single } from '../types'
import { HALList } from '../../types'

type List = HALList<{
  dealeroverlast: Single[]
}>

export const singleFixture = fixtureSingle as Single
export const listFixture = fixtureList as List
export const path = 'v1/overlastgebieden/dealeroverlast/'
export const fixtureId = 1
