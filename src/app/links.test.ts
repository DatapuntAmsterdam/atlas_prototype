import { generatePath } from 'react-router-dom'
import { toAddresses, toCadastralObjects, toConstructionFile, toEstablishments } from './links'
import { routing } from './routes'

describe('toConstructionFile', () => {
  it('creates a link', () => {
    const id = '123456'

    expect(toConstructionFile(id, 'file.ext', 'http://foo.bar')).toEqual({
      pathname: generatePath(routing.constructionFile.path, { id }),
      search: 'bestand=file.ext&bestandUrl=http%3A%2F%2Ffoo.bar',
    })
  })
})

describe('toAddresses', () => {
  it('creates a link', () => {
    expect(toAddresses()).toEqual({
      pathname: routing.addresses.path,
      search: 'modus=volledig',
    })
  })
})

describe('toCadastralObjects', () => {
  it('creates a link', () => {
    expect(toCadastralObjects()).toEqual({
      pathname: routing.cadastralObjects.path,
      search: 'modus=volledig',
    })
  })
})

describe('toEstablishments', () => {
  it('creates a link', () => {
    expect(toEstablishments()).toEqual({
      pathname: routing.establishments.path,
      search: 'modus=volledig',
    })
  })
})
