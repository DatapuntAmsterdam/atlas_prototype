import fixtureSingle from './nummeraanduiding.json'
import fixtureList from './nummeraanduiding-list.json'
import verblijfsobjectFieldFixture from './nummeraanduiding_field_verblijfsobjectId.json'
import { List as NummeraanduidingList, Nummeraanduiding } from './types'

export * from './getNummeraanduidingByAddress'
export * from './types'

export const singleFixture = fixtureSingle as Nummeraanduiding
export const listFixture = fixtureList as NummeraanduidingList
export const path = 'v1/bag/nummeraanduiding'
export const fixtureId = '0363200000006110'

export { verblijfsobjectFieldFixture }
