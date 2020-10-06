import joinUrl from '../../app/utils/joinUrl'
import environment from '../../environment'
import { fetchWithoutToken } from '../../shared/services/api/api'

export interface Metadata {
  id: string
  title: string
  group: number
  /* eslint-disable camelcase */
  update_frequency: string
  data_modified_date: string
  last_import_date: string | null
  /* eslint-enable camelcase */
}

/**
 * Retrieve metadata about data sources used on the site, such as the update frequency and the last time a data source was update.
 *
 * API documentation: https://api.data.amsterdam.nl/metadata/
 */
export async function getMetadata() {
  return fetchWithoutToken<Metadata[]>(joinUrl([environment.API_ROOT, 'metadata']))
}
