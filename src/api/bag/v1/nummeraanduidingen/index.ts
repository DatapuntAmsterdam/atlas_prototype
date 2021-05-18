import fixtureSingle from './nummeraanduidingen.json'
import fixtureList from './nummeraanduidingen-list.json'
import type { Single } from './types'
import type { HALList } from '../../../types'

type List = HALList<{ nummeraanduidingen: Single[] }>

export const singleFixture = fixtureSingle as Single
export const listFixture = fixtureList as List
export const fixtureId = '0363200000006110'
export const path = 'v1/bag/nummeraanduidingen/'

export type { Single, List }
