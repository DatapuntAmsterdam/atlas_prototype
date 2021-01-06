import fixture from './situering.json'
import listResultFixture from './listResult.json'
import { Root as Situering } from './types'
import getListFixture from '../../getListFixture'

export default fixture as Situering

export const list = getListFixture(
  listResultFixture,
  'https://api.data.amsterdam.nl/monumenten/situeringen/',
  50,
  'https://api.data.amsterdam.nl/monumenten/situeringen/',
  'https://api.data.amsterdam.nl/monumenten/situeringen/',
)
