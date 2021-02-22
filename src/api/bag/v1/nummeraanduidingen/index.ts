import fixtureSingle from './nummeraanduidingen.json'
import fixtureList from './nummeraanduidingen-list.json'
import { Single } from './types'
import { BagList } from '../types'

type List = BagList<{ nummeraanduidingen: Single[] }>

export const singleFixture = fixtureSingle as Single
export const listFixture = fixtureList as List
export const fixtureId = '0363200000006110'
export const path = 'v1/bag/nummeraanduidingen/'

export { Single, List }
