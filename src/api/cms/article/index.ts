import fixtureSingle from './article.json'
import environment from '../../../environment'
import type { Single } from './types'

export const singleFixture = fixtureSingle as Single
export const path = 'jsonapi/node/article/'
export const fixtureId = '52f920f0-ebc4-4ddb-ade1-c5889ac0c0cc'
export const root = environment.CMS_ROOT

export type { Single }
