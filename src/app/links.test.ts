import { generatePath } from 'react-router-dom'
import environment from '../environment'
import { HEADER_LINK_HELP } from '../shared/config/content-links'
import {
  toAddresses,
  toArticleDetail,
  toCadastralObjects,
  toCollectionDetail,
  toConstructionDossier,
  toEstablishments,
  toHelpPage,
  toHome,
  toPublicationDetail,
  toSpecialDetail,
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

describe('toCollectionDetail', () => {
  const id = '123456'
  const slug = 'hello-world'

  it('creates a location descriptor', () => {
    expect(toCollectionDetail(id, slug)).toEqual({
      pathname: generatePath(routing.collectionDetail.path, { id, slug }),
    })
  })
})

describe('toConstructionDossier', () => {
  it('creates a location descriptor', () => {
    const id = '123456'

    expect(toConstructionDossier(id, 'file.ext', 'http://foo.bar')).toEqual({
      pathname: generatePath(routing.constructionDossier.path, { id }),
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

describe('toHelpPage', () => {
  it('creates a location descriptor', () => {
    const id = HEADER_LINK_HELP.id[environment.DEPLOY_ENV]
    const { slug } = HEADER_LINK_HELP

    expect(toHelpPage()).toEqual({
      pathname: generatePath(routing.articleDetail.path, { id, slug }),
    })
  })
})

describe('toHome', () => {
  it('creates a location descriptor', () => {
    expect(toHome()).toEqual({
      pathname: routing.home.path,
    })
  })
})

describe('toPublicationDetail', () => {
  const id = '123456'
  const slug = 'hello-world'

  it('creates a location descriptor', () => {
    expect(toPublicationDetail(id, slug)).toEqual({
      pathname: generatePath(routing.publicationDetail.path, { id, slug }),
    })
  })
})

describe('toSpecialDetail', () => {
  const id = '123456'
  const type = 'foo'
  const slug = 'hello-world'

  it('creates a location descriptor', () => {
    expect(toSpecialDetail(id, type, slug)).toEqual({
      pathname: generatePath(routing.specialDetail.path, { id, type, slug }),
    })
  })
})
