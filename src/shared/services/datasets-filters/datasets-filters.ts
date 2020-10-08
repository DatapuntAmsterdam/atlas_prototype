import joinUrl from '../../../app/utils/joinUrl'
import environment from '../../../environment'
import { fetchWithToken } from '../api/api'

export interface DatasetFilterOption {
  id: string
  label: string
}

/** Matches the key (enum) of a type to a label (enumName) */
function getOptions(propertyType: any): DatasetFilterOption[] {
  return propertyType.enum.map((item: string, i: number) => {
    const index = propertyType.enum[i].indexOf(':')
    return {
      id: index === -1 ? propertyType.enum[i] : propertyType.enum[i].substring(index + 1),
      label: propertyType.enumNames[i] ? propertyType.enumNames[i] : 'Anders',
    }
  })
}

function toDatasetFilters(data: any) {
  const dcatDocProperties = data.components.schemas['dcat-dataset'].properties
  const themaProperties = dcatDocProperties['dcat:theme'].items
  const distributionProperties = dcatDocProperties['dcat:distribution'].items.properties
  const ownerProperties = dcatDocProperties['ams:owner'].examples

  const datasetsFilters = {
    statusTypes: getOptions(dcatDocProperties['ams:status']),
    groupTypes: getOptions(themaProperties),
    formatTypes: getOptions(distributionProperties['dcat:mediaType']),
    serviceTypes: getOptions(distributionProperties['ams:serviceType']),
    resourceTypes: getOptions(distributionProperties['ams:resourceType']),
    ownerTypes: ownerProperties.map((item: string) => ({
      id: item,
      label: item,
    })),
    licenseTypes: getOptions(dcatDocProperties['ams:license']),
    spatialUnits: getOptions(dcatDocProperties['ams:spatialUnit']),
    temporalUnits: getOptions(dcatDocProperties['ams:temporalUnit']),
    accrualPeriodicities: getOptions(dcatDocProperties['dct:accrualPeriodicity']),
    languages: getOptions(dcatDocProperties['dct:language']),
    distributionTypes: getOptions(distributionProperties['ams:distributionType']),
  }

  return datasetsFilters
}

export default async function getDatasetFilters() {
  const data = await fetchWithToken(joinUrl([environment.API_ROOT, 'dcatd/openapi']))
  return toDatasetFilters(data)
}
