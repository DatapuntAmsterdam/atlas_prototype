export const FETCH_CATALOG_FILTERS_SUCCESS = 'FETCH_CATALOG_FILTERS_SUCCESS';
export const FETCH_CATALOG_FILTERS_REQUEST = 'FETCH_CATALOG_FILTERS_REQUEST';

const initialState = {};

function getOptions(propertyType) {
  const options = [];
  propertyType.enum.forEach(
    (item, i) => {
      const index = propertyType.enum[i].indexOf(':');
      options.push({
        id: index === -1 ? propertyType.enum[i] : propertyType.enum[i].substring(index + 1),
        label: propertyType.enumNames[i]
      });
    }
  );
  return options;
}

function getCatalogFilters(data) {
  const dcatDocProperties = data.components.schemas['dcat-doc'].properties;
  const themaProperties = dcatDocProperties['dcat:theme'].items;
  const distributionProperties = dcatDocProperties['dcat:distribution'].items.properties;
  const ownerProperties = dcatDocProperties['ams:owner'].examples;
  const catalogFilters = {
    groupTypes: getOptions(themaProperties),
    formatTypes: getOptions(distributionProperties['dct:format']),
    serviceTypes: getOptions(distributionProperties['ams:serviceType']),
    resourceTypes: getOptions(distributionProperties['ams:resourceType']),
    ownerTypes: ownerProperties.map((item) => ({
      id: item,
      label: item
    })),
    licenseTypes: getOptions(dcatDocProperties['ams:license']),
    spatialUnits: getOptions(dcatDocProperties['ams:spatialUnit']),
    temporalUnits: getOptions(dcatDocProperties['ams:temporalUnit']),
    accrualPeriodicities: getOptions(dcatDocProperties['dct:accrualPeriodicity']),
    languages: getOptions(dcatDocProperties['dct:language'])
  };

  return catalogFilters;
}

export default function DataSelectionCatalogReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CATALOG_FILTERS_SUCCESS:
      return {
        ...getCatalogFilters(action.payload)
      };

    default:
      return state;
  }
}

export const fetchCatalogFilters = (payload) =>
  ({
    type: FETCH_CATALOG_FILTERS_REQUEST,
    payload
  });


window.reducers = window.reducers || {};
window.reducers.DataSelectionCatalogReducer = DataSelectionCatalogReducer;
