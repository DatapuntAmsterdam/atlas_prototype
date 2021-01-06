import fixture from './bouwdossier.json'
import { Bouwdossier } from './types'
import getListFixture from '../../getListFixture'
import listResultFixture from './listResult.json'

export default fixture as Bouwdossier

export const list = getListFixture(
  listResultFixture,
  'https://api.data.amsterdam.nl/iiif-metadata/bouwdossier/',
  50,
  'https://api.data.amsterdam.nl/iiif-metadata/bouwdossier/',
  'https://api.data.amsterdam.nl/iiif-metadata/bouwdossier/',
)
