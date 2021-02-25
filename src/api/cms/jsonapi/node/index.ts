import publicationFixture from './publication.json'
import articleFixture from './article.json'
import specialFixture from './special.json'
import dossierFixture from './dossier.json'
import { RootObject } from '../types'

export const singleFixture = articleFixture as RootObject
export const articleSingleFixture = articleFixture as RootObject
export const publicationSingleFixture = publicationFixture as RootObject
export const specialSingleFixture = specialFixture as RootObject
export const dossierSingleFixture = dossierFixture as RootObject
export const fixtureId = null
export const path = 'jsonapi/node/(article|publication|special|dossier)/'
export * from '../types'
