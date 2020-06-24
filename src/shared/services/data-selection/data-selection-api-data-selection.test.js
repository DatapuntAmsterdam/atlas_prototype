import * as api from '../api/api'
import { getMarkers, query } from './data-selection-api-data-selection'
import * as dataSelectionConfig from './data-selection-config'

let mockedApiResponse
let mockedApiMarkersResponse
let config

describe('DataSelection api', () => {
  beforeEach(() => {
    mockedApiResponse = {
      aggs_list: {
        water: {
          doc_count: 3,
          buckets: [
            {
              doc_count: 1,
              key: 'Tropisch',
            },
            {
              doc_count: 4,
              key: 'Verwarmd',
            },
            {
              doc_count: 1,
              key: 'Koud',
            },
          ],
        },
        type: {
          doc_count: 2,
          buckets: [
            {
              doc_count: 4,
              key: 'Buitenbad',
            },
            {
              doc_count: 2,
              key: 'Overdekt',
            },
          ],
        },
      },
      object_list: [
        {
          _openbare_ruimte_naam: 'Binnenkant',
          huisletter: 'A',
          huisnummer: '1',
          huisnummer_toevoeging: '2',
          ligplaats_id: '',
          standplaats_id: '0123456',
          openingstijden: 'Alleen op dinsdag',
          adres: 'Sneeuwbalweg 24',
          id: '1',
        },
        {
          _openbare_ruimte_naam: 'Binnenkant',
          huisletter: 'B',
          huisnummer: '1',
          huisnummer_toevoeging: '',
          ligplaats_id: '0123456',
          standplaats_id: '',
          hoofdadres: 'False',
          status_id: '18',
          adres: 'Marnixstraat 1',
          openingstijden: 'Ligt er een beetje aan',
          id: '2',
        },
        {
          _openbare_ruimte_naam: 'Binnenkant',
          huisletter: 'C',
          huisnummer: '1',
          huisnummer_toevoeging: '2',
          ligplaats_id: '',
          standplaats_id: '0123456',
          hoofdadres: 'True',
          status_id: '16',
          openingstijden: 'Alleen op dinsdag',
          adres: 'Sneeuwbalweg 24',
          id: '3',
        },
        {
          handelsnaam: 'De Appel',
          dataset: 'mac',
          kvk_nummer: '34392003',
          id: '4',
        },
      ],
      page_count: 2,
    }
    config = {
      MAX_AVAILABLE_PAGES: 100,
      ENDPOINT_PREVIEW: 'zwembaden/',
      ENDPOINT_MARKERS: 'zwembaden/markers/',
      ENDPOINT_DETAIL: 'api_endpoint/zwembaden/',
      PRIMARY_KEY: 'id',
      FILTERS: [
        {
          slug: 'type',
          label: 'Type accomodatie',
        },
        {
          slug: 'water',
          label: 'Watersoort',
        },
      ],
    }

    dataSelectionConfig.default = config
    api.fetchWithToken = jest.fn((uri) => {
      if (uri === `${process.env.API_ROOT}zwembaden/markers/`) {
        return Promise.resolve(mockedApiMarkersResponse)
      }
      return Promise.resolve(mockedApiResponse)
    })
  })

  it('calls the api factory with the active filters, page and shape as searchParams', async () => {
    // Without active filters
    query(config, 'LIST', {}, 1, 'search', '[[3,12]]')
    expect(api.fetchWithToken).toHaveBeenCalledWith(`${process.env.API_ROOT}zwembaden/`, {
      page: 1,
      dataset: 'ves',
      shape: '[[3,12]]',
    })

    // With active filters
    query(config, 'TABLE', { water: 'Verwarmd' }, 2)
    expect(api.fetchWithToken).toHaveBeenCalledWith(`${process.env.API_ROOT}zwembaden/`, {
      water: 'Verwarmd',
      page: 2,
      dataset: 'ves',
      shape: '[]',
    })

    // With yet another page
    const output = await query(config, 'LIST', {}, 9999)
    expect(output.data.length).toBe(0)
  })

  it('returns the total number of pages', async () => {
    const output = await query(config, 'LIST', {}, 1)
    expect(output.numberOfPages).toBe(2)
  })

  describe('the formatFilters process', () => {
    it('orders the filters based on the configuration', async () => {
      const output = await query(config, 'LIST', {}, 1)
      expect(output.filters).toEqual({
        type: {
          numberOfOptions: 2,
          options: [
            {
              id: 'Buitenbad',
              label: 'Buitenbad',
              count: 4,
            },
            {
              id: 'Overdekt',
              label: 'Overdekt',
              count: 2,
            },
          ],
        },
        water: {
          numberOfOptions: 3,
          options: [
            {
              id: 'Tropisch',
              label: 'Tropisch',
              count: 1,
            },
            {
              id: 'Verwarmd',
              label: 'Verwarmd',
              count: 4,
            },
            {
              id: 'Koud',
              label: 'Koud',
              count: 1,
            },
          ],
        },
      })
    })

    it("won't return filters from the configuration that are not part of the API's response", async () => {
      // With only one filter in the API response
      delete mockedApiResponse.aggs_list.type

      const output = await query(config, 'LIST', {}, 1)
      expect(output.filters).toEqual({
        water: {
          numberOfOptions: 3,
          options: [
            {
              id: 'Tropisch',
              label: 'Tropisch',
              count: 1,
            },
            {
              id: 'Verwarmd',
              label: 'Verwarmd',
              count: 4,
            },
            {
              id: 'Koud',
              label: 'Koud',
              count: 1,
            },
          ],
        },
      })
    })
  })

  it('processes the results correctly', async () => {
    const output = await query(config, 'LIST', {}, 1)

    expect(output.data.length).toEqual(4)
    expect(output.data[0]).toEqual({
      _links: {
        self: {
          href: `${process.env.API_ROOT}api_endpoint/zwembaden/1/`,
        },
      },
      _openbare_ruimte_naam: 'Binnenkant',
      huisletter: 'A',
      huisnummer: '1',
      huisnummer_toevoeging: '2',
      ligplaats_id: '',
      standplaats_id: '0123456',
      openingstijden: 'Alleen op dinsdag',
      adres: 'Sneeuwbalweg 24',
      id: '1',
    })
    expect(output.data[1]).toEqual({
      _links: {
        self: {
          href: `${process.env.API_ROOT}api_endpoint/zwembaden/2/`,
        },
      },
      _openbare_ruimte_naam: 'Binnenkant',
      huisletter: 'B',
      huisnummer: '1',
      huisnummer_toevoeging: '',
      ligplaats_id: '0123456',
      standplaats_id: '',
      hoofdadres: 'False',
      status_id: '18',
      adres: 'Marnixstraat 1',
      openingstijden: 'Ligt er een beetje aan',
      id: '2',
    })
    expect(output.data[2]).toEqual({
      _links: {
        self: {
          href: `${process.env.API_ROOT}api_endpoint/zwembaden/3/`,
        },
      },
      _openbare_ruimte_naam: 'Binnenkant',
      huisletter: 'C',
      huisnummer: '1',
      huisnummer_toevoeging: '2',
      ligplaats_id: '',
      standplaats_id: '0123456',
      hoofdadres: 'True',
      status_id: '16',
      openingstijden: 'Alleen op dinsdag',
      adres: 'Sneeuwbalweg 24',
      id: '3',
    })
    expect(output.data[3]).toEqual({
      _links: {
        self: {
          href: `${process.env.API_ROOT}handelsregister/maatschappelijkeactiviteit/34392003/`,
        },
      },
      handelsnaam: 'De Appel',
      dataset: 'mac',
      kvk_nummer: '34392003',
      id: '4',
    })
  })

  describe('the getMarkers function', () => {
    beforeEach(() => {
      mockedApiMarkersResponse = {
        object_list: [
          {
            _source: {
              centroid: [4.1, 52.1],
            },
          },
          {
            _source: {
              centroid: [4.2, 52.2],
            },
          },
          {
            _source: {
              centroid: [4.3, 52.3],
            },
          },
        ],
      }
    })

    it('calls the api factory with the active filters as searchParams', () => {
      // Without filters
      getMarkers(config, {})
      expect(api.fetchWithToken).toHaveBeenCalledWith(
        `${process.env.API_ROOT}zwembaden/markers/`,
        {},
      )

      // With filters
      getMarkers(config, { water: 'Verwarmd' })

      expect(api.fetchWithToken).toHaveBeenCalledWith(`${process.env.API_ROOT}zwembaden/markers/`, {
        water: 'Verwarmd',
      })
    })

    it('returns an array of locations [lat, lon]', async () => {
      const output = await getMarkers(config, {})

      expect(output).toEqual({
        clusterMarkers: [
          [52.1, 4.1],
          [52.2, 4.2],
          [52.3, 4.3],
        ],
      })
    })
  })
})
