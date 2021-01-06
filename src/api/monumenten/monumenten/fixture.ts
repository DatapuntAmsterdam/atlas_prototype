import fixture from './monumenten.json'
import listResultFixture from './listResult.json'
import { Root as Monumenten } from './types'
import getListFixture from '../../getListFixture'

export default fixture as Monumenten

export const list = getListFixture(
  listResultFixture,
  'https://api.data.amsterdam.nl/monumenten/monumenten/',
  50,
  'https://api.data.amsterdam.nl/monumenten/monumenten/',
  'https://api.data.amsterdam.nl/monumenten/monumenten/',
)
