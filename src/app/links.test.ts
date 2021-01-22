import { generatePath } from 'react-router-dom'
import {
  toAddresses,
  toArticleDetail,
  toCadastralObjects,
  toConstructionFile,
  toEstablishments,
} from './links'
import { routing } from './routes'

describe('toAddresses', () => {
  it('creates a location descriptor', () => {
    expect(toAddresses()).toEqual({
      pathname: routing.addresses.path,
      search: 'modus=volledig',
    })
  })
})

describe('toArticleDetail', () => {
  const id = '123456'
  const slug = 'hello-world'

  it('creates a location descriptor', () => {
    expect(toArticleDetail(id, slug)).toEqual({
      pathname: generatePath(routing.articleDetail.path, { id, slug }),
    })
  })
})

describe('toCadastralObjects', () => {
  it('creates a location descriptor', () => {
    expect(toCadastralObjects()).toEqual({
      pathname: routing.cadastralObjects.path,
      search: 'modus=volledig',
    })
  })
})

describe('toConstructionFile', () => {
  it('creates a location descriptor', () => {
    const id = '123456'

    expect(toConstructionFile(id, 'file.ext', 'http://foo.bar')).toEqual({
      pathname: generatePath(routing.constructionFile.path, { id }),
      search: 'bestand=file.ext&bestandUrl=http%3A%2F%2Ffoo.bar',
    })
  })
})

describe('toEstablishments', () => {
  it('creates a location descriptor', () => {
    expect(toEstablishments()).toEqual({
      pathname: routing.establishments.path,
      search: 'modus=volledig',
    })
  })
})
