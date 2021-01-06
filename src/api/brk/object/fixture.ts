import fixture from './object.json'
import listResultFixture from './listResult.json'
import { Root as Object } from './types'
import getListFixture from '../../getListFixture'
import { APIReference } from '../../types'

export default fixture as Object

export const list = getListFixture(
  listResultFixture as APIReference,
  'https://api.data.amsterdam.nl/brk/object/',
  50,
  'https://api.data.amsterdam.nl/brk/object/',
  'https://api.data.amsterdam.nl/brk/object/',
)
