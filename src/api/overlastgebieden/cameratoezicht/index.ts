import fixtureSingle from './cameratoezicht.json'
import fixtureList from './cameratoezicht-list.json'
import type { Single } from '../types'
import type { HALList } from '../../types'

type List = HALList<{
  cameratoezicht: Single[]
}>

export const singleFixture = fixtureSingle as Single
export const listFixture = fixtureList as List
export const path = 'v1/overlastgebieden/cameratoezicht/'
export const fixtureId = 1
