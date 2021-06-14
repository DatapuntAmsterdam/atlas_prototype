import type { HistorischeOnderzoeken } from './types'
import fixture from './historischeonderzoeken.json'

export * from './types'

export const singleFixture = fixture as HistorischeOnderzoeken
export const historischeOnderzoekenPath = 'v1/ondergrond/historischeonderzoeken'
export const fixtureId = 12
