import fixtureSingle from './dataset.json'
import type { DcatDataset } from './types'

export const singleFixture = fixtureSingle as DcatDataset
export const path = 'dcatd/datasets/'
export const fixtureId = 'qji2W_HBpWUWyg'

export * from './getDatasetById'
export * from './types'
