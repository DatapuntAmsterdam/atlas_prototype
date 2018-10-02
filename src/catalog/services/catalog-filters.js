import SHARED_CONFIG from '../../shared/services/shared-config/shared-config';
import { getByUrl } from '../../shared/services/api/api';

function getOptions(propertyType) {
  return propertyType.enum.map(
    (item, i) => {
      const index = propertyType.enum[i].indexOf(':');
      return {
        id: index === -1 ? propertyType.enum[i] : propertyType.enum[i].substring(index + 1),
        label: (propertyType.enumNames[i]) ? propertyType.enumNames[i] : 'Anders'
      };
    }
  );
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
    languages: getOptions(dcatDocProperties['dct:language']),
    distributionTypes: getOptions(distributionProperties['ams:distributionType'])
  };

  return catalogFilters;
}

export default function fetchFilters() {
  return getByUrl(`${SHARED_CONFIG.API_ROOT}dcatd/openapi`)
    .then((data) => getCatalogFilters(data));
}
