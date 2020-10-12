import joinUrl from '../../app/utils/joinUrl'
import environment from '../../environment'
import { fetchWithoutToken } from '../../shared/services/api/api'
import { Metadata } from './types'

/**
 * Retrieve metadata about data sources used on the site, such as the update frequency and the last time a data source was updated.
 *
 * API documentation: https://api.data.amsterdam.nl/metadata/
 */
// eslint-disable-next-line import/prefer-default-export
export async function getMetadata() {
  return fetchWithoutToken<Metadata[]>(joinUrl([environment.API_ROOT, 'metadata']))
}
