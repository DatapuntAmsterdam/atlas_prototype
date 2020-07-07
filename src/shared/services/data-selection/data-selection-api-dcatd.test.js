import * as api from '../api/api'
import { query } from './data-selection-api-dcatd'
import mockedApiResponseJson from './data-selection-api-dcatd.factory.test.response.json'
import * as dataSelectionConfig from './data-selection-config'
import environment from '../../../environment'

describe('The dataSelectionApiDcatd factory', () => {
  let mockedApiResponse
  let mockedEmptyApiResponse
  let config
  let catalogFilters

  beforeEach(() => {
    config = {
      MAX_ITEMS_PER_PAGE: 2,
      ENDPOINT_PREVIEW: 'dcatd/datasets',
      ENDPOINT_DETAIL: 'dcatd/datasets',
      ENDPOINT_METADATA: 'dcatd/openapi',
      PRIMARY_KEY: 'dct:identifier',
      FILTERS: [
        {
          slug: 'groups',
          label: "Thema's",
        },
        {
          slug: 'data_format',
          label: 'Formaten',
          formatter: 'lowercase',
        },
        {
          slug: 'owner',
          label: 'Gepubliceerd door',
        },
      ],
    }

    catalogFilters = {
      groupTypes: [
        {
          id: 'milieu-water',
          label: "Thema's",
        },
      ],
      formatTypes: [
        {
          id: 'id',
          label: 'label',
        },
      ],
      serviceTypes: [
        {
          id: 'id',
          label: 'label',
        },
      ],
      resourceTypes: [
        {
          id: 'id',
          label: 'label',
        },
      ],
      ownerTypes: [
        {
          id: 'id',
          label: 'label',
        },
      ],
      licenseTypes: [
        {
          id: 'id',
          label: 'label',
        },
      ],
      distributionTypes: [
        {
          id: 'id',
          label: 'label',
        },
      ],
    }

    mockedApiResponse = {
      ...mockedApiResponseJson,
    }

    mockedEmptyApiResponse = {
      ...mockedApiResponseJson,
      'ams:facet_info': {},
    }
    dataSelectionConfig.default = config
    api.fetchWithToken = jest.fn((url) => {
      if (url === `${environment.API_ROOT}dcatd/reject`) {
        return Promise.reject()
      }
      if (url === `${environment.API_ROOT}dcatd/empty`) {
        return Promise.resolve(mockedEmptyApiResponse)
      }
      return Promise.resolve(mockedApiResponse)
    })
  })

  it('calls the api factory with when no parameters are provided', async () => {
    const output = await query(config, 'CATALOG', {}, 1)
    expect(Object.keys(output.filters).length).toBe(0)
    expect(api.fetchWithToken).toHaveBeenCalledWith(
      environment.API_ROOT + config.ENDPOINT_PREVIEW,
      {
        offset: 0,
        limit: config.MAX_ITEMS_PER_PAGE,
      },
    )
  })

  it('calls the api factory with theme parameter and searchText', () => {
    // With an active filter and search text
    query(
      config,
      'CATALOG',
      {
        groups: 'energie',
      },
      1,
      'searchText',
      undefined,
      catalogFilters,
    )
    expect(api.fetchWithToken).toHaveBeenCalledWith(
      environment.API_ROOT + config.ENDPOINT_PREVIEW,
      {
        offset: 0,
        limit: config.MAX_ITEMS_PER_PAGE,
        q: 'searchText',
        '/properties/dcat:theme/items': 'eq=theme:energie',
      },
    )
  })

  it('calls the api factory with active filters and searchText', () => {
    // With active filters
    query(
      config,
      'CATALOG',
      {
        groups: 'energie',
        formats: 'application/pdf',
      },
      1,
      'searchText',
      undefined,
      catalogFilters,
    )
    expect(api.fetchWithToken).toHaveBeenCalledWith(
      environment.API_ROOT + config.ENDPOINT_PREVIEW,
      {
        offset: 0,
        limit: config.MAX_ITEMS_PER_PAGE,
        q: 'searchText',
        '/properties/dcat:theme/items': 'eq=theme:energie',
        '/properties/dcat:distribution/items/properties/dcat:mediaType': 'eq=application/pdf',
      },
    )

    // With another page
    query(config, 'CATALOG', {}, 2, 'searchText', undefined, catalogFilters)
    expect(api.fetchWithToken).toHaveBeenCalledWith(
      environment.API_ROOT + config.ENDPOINT_PREVIEW,
      {
        offset: 2,
        limit: config.MAX_ITEMS_PER_PAGE,
        q: 'searchText',
      },
    )
  })

  it('calls the api factory with owner parameter and searchText', () => {
    // With an active filter and search text
    query(
      config,
      'CATALOG',
      {
        owners: 'owner',
      },
      1,
      'searchText',
      undefined,
      catalogFilters,
    )
    expect(api.fetchWithToken).toHaveBeenCalledWith(
      environment.API_ROOT + config.ENDPOINT_PREVIEW,
      {
        offset: 0,
        limit: config.MAX_ITEMS_PER_PAGE,
        q: 'searchText',
        '/properties/ams:owner': 'eq=owner',
      },
    )
  })

  it('calls the api factory with serviceType parameter and searchText', () => {
    // With an active filter and search text
    query(
      config,
      'CATALOG',
      {
        serviceTypes: 'wms',
      },
      1,
      'searchText',
      undefined,
      catalogFilters,
    )
    expect(api.fetchWithToken).toHaveBeenCalledWith(
      environment.API_ROOT + config.ENDPOINT_PREVIEW,
      {
        offset: 0,
        limit: config.MAX_ITEMS_PER_PAGE,
        q: 'searchText',
        '/properties/dcat:distribution/items/properties/ams:serviceType': 'eq=wms',
      },
    )
  })

  it('calls the api factory with distributionType parameter and searchText', () => {
    // With an active filter and search text
    query(
      config,
      'CATALOG',
      {
        distributionTypes: 'file',
      },
      1,
      'searchText',
      undefined,
      catalogFilters,
    )
    expect(api.fetchWithToken).toHaveBeenCalledWith(
      environment.API_ROOT + config.ENDPOINT_PREVIEW,
      {
        offset: 0,
        limit: config.MAX_ITEMS_PER_PAGE,
        q: 'searchText',
        '/properties/dcat:distribution/items/properties/ams:distributionType': 'eq=file',
      },
    )
  })

  it('calls the api factory with status parameter and searchText', () => {
    // With an active filter and search text
    query(
      config,
      'CATALOG',
      {
        status: 'beschikbaar',
      },
      1,
      'searchText',
      undefined,
      catalogFilters,
    )
    expect(api.fetchWithToken).toHaveBeenCalledWith(
      environment.API_ROOT + config.ENDPOINT_PREVIEW,
      {
        offset: 0,
        limit: config.MAX_ITEMS_PER_PAGE,
        q: 'searchText',
        '/properties/ams:status': 'eq=beschikbaar',
      },
    )
  })

  it('returns the total number of pages', async () => {
    const output = await query(config, 'CATALOG', {}, 1, '', undefined, catalogFilters)
    expect(output.numberOfPages).toBe(2)
  })

  it('still returns the total number of pages when facet_info is empty', async () => {
    config.ENDPOINT_PREVIEW = 'dcatd/empty'

    const output = await query(config, 'CATALOG', {}, 1, '', undefined, catalogFilters)

    expect(output.numberOfPages).toBe(2)
  })

  it('registers an error with an unsuccessful API call', async () => {
    config.ENDPOINT_PREVIEW = 'dcatd/reject'

    await expect(query(config, 'CATALOG', {}, 1, '', undefined, catalogFilters)).rejects.toEqual(
      undefined,
    )
  })

  it('processes the results correctly', async () => {
    const output = await query(config, 'CATALOG', {}, 1, '', undefined, catalogFilters)

    expect(output.data.length).toEqual(4)
    expect(output.data[0]).toEqual({
      '@id': 'ams-dcatd: 642f15c7-8368-4795-9e3d-1a87fa7e562a',
      'dct:description': '<p>Alle activiteiten in Amsterdam en omgeving...</p>',
      'dct:identifier': '642f15c7-8368-4795-9e3d-1a87fa7e562a',
      'dct:title': 'Activiteiten',
      _links: {
        self: {
          href: `${environment.API_ROOT}dcatd/datasets/642f15c7-8368-4795-9e3d-1a87fa7e562a`,
        },
      },
    })
  })
})
