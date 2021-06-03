import { generatePath } from 'react-router-dom'
import environment from '../environment'
import { HEADER_LINK_HELP } from '../shared/config/content-links'
import {
  toAddresses,
  toArticleDetail,
  toArticleSearch,
  toCadastralObjects,
  toCollectionDetail,
  toCollectionSearch,
  toConstructionDossier,
  toDataDetail,
  toDataSearch,
  toDatasetDetail,
  toDatasetSearch,
  toEstablishments,
  toGeoSearch,
  toHelpPage,
  toHome,
  toMapSearch,
  toNotFound,
  toPublicationDetail,
  toPublicationSearch,
  toSearch,
  toSpecialDetail,
  toSpecialSearch,
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

describe('toArticleSearch', () => {
  it('creates a location descriptor', () => {
    expect(toArticleSearch()).toEqual({
      pathname: routing.articleSearch.path,
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

describe('toCollectionSearch', () => {
  it('creates a location descriptor', () => {
    expect(toCollectionSearch()).toEqual({
      pathname: routing.collectionSearch.path,
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

describe('toDataDetail', () => {
  const type = 'foo'
  const subtype = 'bar'
  const id = '123456'

  it('creates a location descriptor', () => {
    expect(toDataDetail({ type, subtype, id })).toEqual({
      pathname: generatePath(routing.dataDetail.path, { type, subtype, id }),
    })
  })

  it('creates a location descriptor for the new map', () => {
    const locationSpy = jest
      .spyOn(window, 'location', 'get')
      .mockReturnValue({ pathname: '/kaart/some/path', search: '' } as Location)

    expect(toDataDetail({ type, subtype, id })).toEqual({
      pathname: generatePath(routing.dataDetail.path, { type, subtype, id }),
    })

    locationSpy.mockRestore()
  })
})

describe('toDataSearch', () => {
  it('creates a location descriptor', () => {
    expect(toDataSearch()).toEqual({
      pathname: routing.dataSearch.path,
    })
  })
})

describe('toDatasetDetail', () => {
  const id = '123456'
  const slug = 'hello-world'

  it('creates a location descriptor', () => {
    expect(toDatasetDetail({ id, slug })).toEqual({
      pathname: generatePath(routing.datasetDetail.path, { id, slug }),
    })
  })
})

describe('toDatasetSearch', () => {
  it('creates a location descriptor', () => {
    expect(toDatasetSearch()).toEqual({
      pathname: routing.datasetSearch.path,
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

describe('toGeoSearch', () => {
  it('creates a location descriptor', () => {
    expect(toGeoSearch()).toEqual({
      pathname: routing.dataSearchGeo.path,
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

describe('toMapSearch', () => {
  it('creates a location descriptor', () => {
    expect(toMapSearch()).toEqual({
      pathname: routing.mapSearch.path,
    })
  })
})

describe('toNotFound', () => {
  it('creates a location descriptor', () => {
    expect(toNotFound()).toEqual({
      pathname: routing.notFound.path,
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

describe('toPublicationSearch', () => {
  it('creates a location descriptor', () => {
    expect(toPublicationSearch()).toEqual({
      pathname: routing.publicationSearch.path,
    })
  })
})

describe('toSearch', () => {
  it('creates a location descriptor', () => {
    expect(toSearch()).toEqual({
      pathname: routing.search.path,
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

describe('toSpecialSearch', () => {
  it('creates a location descriptor', () => {
    expect(toSpecialSearch()).toEqual({
      pathname: routing.specialSearch.path,
    })
  })
})
