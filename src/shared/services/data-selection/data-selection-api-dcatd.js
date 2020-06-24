import { fetchWithToken } from '../api/api'

const propertyName = {
  status: '/properties/ams:status',
  theme: '/properties/dcat:theme/items',
  format: '/properties/dcat:distribution/items/properties/dcat:mediaType',
  owner: '/properties/ams:owner',
  distributionType: '/properties/dcat:distribution/items/properties/ams:distributionType',
  serviceType: '/properties/dcat:distribution/items/properties/ams:serviceType',
}

const getDetailEndpoint = (config, rawDataRow) =>
  `${process.env.API_ROOT}${config.ENDPOINT_DETAIL}/${rawDataRow[config.PRIMARY_KEY]}`

const getFacetOptions = (facet, filterCatalog, namespace) =>
  Object.keys(facet).map((option) => {
    const id = namespace ? option.replace(`${namespace}:`, '') : option
    const catalogOption = filterCatalog && filterCatalog.filter((item) => item.id === id)[0]
    return {
      id,
      label: catalogOption ? catalogOption.label : id,
      count: facet[option],
    }
  })

function formatFilters(filters, catalogFilters) {
  const newFilters = { ...filters }
  newFilters[propertyName.status] = newFilters[propertyName.status] || {}
  newFilters[propertyName.theme] = newFilters[propertyName.theme] || {}
  newFilters[propertyName.format] = newFilters[propertyName.format] || {}
  newFilters[propertyName.owner] = newFilters[propertyName.owner] || {}
  newFilters[propertyName.distributionType] = newFilters[propertyName.distributionType] || {}
  newFilters[propertyName.serviceType] = newFilters[propertyName.serviceType] || {}

  const resultFilters = {
    status: {
      numberOfOptions: Object.keys(newFilters[propertyName.status]).length,
      options: getFacetOptions(
        newFilters[propertyName.status],
        catalogFilters.statusTypes,
        'status',
      ),
    },
    groups: {
      numberOfOptions: Object.keys(newFilters[propertyName.theme]).length,
      options: getFacetOptions(newFilters[propertyName.theme], catalogFilters.groupTypes, 'theme'),
    },
    formats: {
      numberOfOptions: Object.keys(newFilters[propertyName.format]).length,
      options: getFacetOptions(newFilters[propertyName.format], catalogFilters.formatTypes),
    },
    owners: {
      numberOfOptions: Object.keys(newFilters[propertyName.owner]).length,
      options: getFacetOptions(newFilters[propertyName.owner], catalogFilters.ownerTypes),
    },
    distributionTypes: {
      numberOfOptions: Object.keys(newFilters[propertyName.distributionType]).length,
      options: getFacetOptions(
        newFilters[propertyName.distributionType],
        catalogFilters.distributionTypes,
      ),
    },
    serviceTypes: {
      numberOfOptions: Object.keys(newFilters[propertyName.serviceType]).length,
      options: getFacetOptions(newFilters[propertyName.serviceType], catalogFilters.serviceTypes),
    },
  }

  return Object.keys(resultFilters)
    .filter((key) => resultFilters[key].numberOfOptions > 0)
    .reduce(
      (result, key) => ({
        ...result,
        [key]: resultFilters[key],
      }),
      {},
    )
}

function formatData(config, rawData) {
  return rawData.map((rawDataRow) => {
    const newDataRow = { ...rawDataRow }
    newDataRow._links = {
      self: {
        href: getDetailEndpoint(config, newDataRow),
      },
    }
    return newDataRow
  })
}

export function query(
  config,
  view,
  activeFilters,
  page,
  searchText = '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  geometryFilter = undefined,
  catalogFilters = {},
) {
  const searchParams = {}

  const queryStatus = activeFilters.status && `eq=${activeFilters.status}`
  const queryTheme = activeFilters.groups && `eq=theme:${activeFilters.groups}`
  const queryFormat = activeFilters.formats && `eq=${activeFilters.formats}`
  const queryOwner = activeFilters.owners && `eq=${activeFilters.owners}`
  const queryDistributionType =
    activeFilters.distributionTypes && `eq=${activeFilters.distributionTypes}`
  const queryServiceType = activeFilters.serviceTypes && `eq=${activeFilters.serviceTypes}`

  if (searchText) {
    // Optional search text
    searchParams.q = searchText
  }

  if (queryStatus) {
    // optional status filter
    searchParams[propertyName.status] = queryStatus
  }

  if (queryTheme) {
    // optional thema/groups filter
    searchParams[propertyName.theme] = queryTheme
  }

  if (queryFormat) {
    // optional format filter
    searchParams[propertyName.format] = queryFormat
  }

  if (queryOwner) {
    // optional owner filter
    searchParams[propertyName.owner] = queryOwner
  }

  if (queryDistributionType) {
    // optional distribution type filter
    searchParams[propertyName.distributionType] = queryDistributionType
  }

  if (queryServiceType) {
    // optional service type filter
    searchParams[propertyName.serviceType] = queryServiceType
  }

  searchParams.offset = (page - 1) * config.MAX_ITEMS_PER_PAGE
  searchParams.limit = config.MAX_ITEMS_PER_PAGE

  return fetchWithToken(process.env.API_ROOT + config.ENDPOINT_PREVIEW, searchParams).then(
    (data) => ({
      numberOfPages: Math.ceil(data['void:documents'] / config.MAX_ITEMS_PER_PAGE),
      numberOfRecords: data['void:documents'],
      filters:
        Object.keys(catalogFilters).length === 0
          ? {}
          : formatFilters(data['ams:facet_info'], catalogFilters),
      data: formatData(config, data['dcat:dataset']),
    }),
  )
}

export default {
  query,
}
