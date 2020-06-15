import { fetchWithToken } from '../api/api'

const formatFilters = (rawData) =>
  Object.keys(rawData).reduce((acc, key) => {
    acc[key] = {
      numberOfOptions: rawData[key].doc_count,
      options: rawData[key].buckets.map((option) => ({
        id: option.key,
        label: option.key,
        count: option.doc_count,
      })),
    }
    return acc
  }, {})

const getDetailEndpoint = (config, rawDataRow) =>
  rawDataRow.dataset === 'mac'
    ? `${process.env.API_ROOT}handelsregister/maatschappelijkeactiviteit/${rawDataRow.kvk_nummer}/`
    : `${process.env.API_ROOT}${config.ENDPOINT_DETAIL}${rawDataRow[config.PRIMARY_KEY]}/`

const formatData = (config, rawData) =>
  rawData.map((rawDataRow) => {
    const newDataRow = { ...rawDataRow }
    newDataRow._links = {
      self: {
        href: getDetailEndpoint(config, newDataRow),
      },
    }
    return newDataRow
  })

export function getMarkers(config, activeFilters) {
  return fetchWithToken(process.env.API_ROOT + config.ENDPOINT_MARKERS, activeFilters).then(
    (data) => ({
      clusterMarkers: data.object_list
        // eslint-disable-next-line no-underscore-dangle
        .map((object) => object._source.centroid)
        .filter((x) => x)
        .map(([lon, lat]) => [lat, lon]),
    }),
  )
}

export function query(config, view, activeFilters, page, search, shape = '[]') {
  let searchPage = page

  // Making sure to not request pages higher then max allowed.
  // If that is the case requesting for page 1, to obtain filters.
  // In the response the data will be dumped.
  if (page > config.MAX_AVAILABLE_PAGES) {
    searchPage = 1
  }

  const searchParams = {
    page: searchPage,
    dataset: 'ves',
    shape,
    ...activeFilters,
  }

  const uri = config.ENDPOINT_PREVIEW[view] || config.ENDPOINT_PREVIEW
  return fetchWithToken(process.env.API_ROOT + uri, searchParams).then((data) => {
    const newData = { ...data }
    if (searchPage !== page) {
      // Requested page was out of api reach, dumping data
      // and saving only the filters
      newData.object_list = []
    }

    return {
      numberOfPages: newData.page_count,
      numberOfRecords: newData.object_count,
      filters: formatFilters(newData.aggs_list),
      data: formatData(config, newData.object_list),
    }
  })
}

export default {
  query,
  getMarkers,
}
