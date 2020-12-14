import { getDatasetById } from './getDatasetById'
import getDatasetFilters from '../../../shared/services/datasets-filters/datasets-filters'

const getDatasetData = async (id: string) => {
  const [dataset, filters] = await Promise.all([getDatasetById(id), getDatasetFilters()])

  const resources = filters.resourceTypes
    .map((resourceType) => ({
      type: resourceType.id,
      rows: dataset['dcat:distribution'].filter(
        (row) => row['ams:resourceType'] === resourceType.id,
      ),
    }))
    .filter((resource) => resource.rows.length > 0)

  return {
    resources,
    dataset,
    filters,
  }
}

export default getDatasetData
