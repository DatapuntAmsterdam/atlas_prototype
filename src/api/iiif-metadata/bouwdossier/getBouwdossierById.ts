import joinUrl from '../../../app/utils/joinUrl'
import environment from '../../../environment'
import { fetchWithToken } from '../../../shared/services/api/api'
import { Bouwdossier } from './types'

/**
 * Retrieve iiif-metadata about bouwdossiers
 *
 * API documentation: https://api.data.amsterdam.nl/iiif-metadata/bouwdossier
 */
// eslint-disable-next-line import/prefer-default-export
export const getBouwdossierById = (id: string) =>
  fetchWithToken<Bouwdossier>(
    joinUrl([environment.API_ROOT, 'iiif-metadata', 'bouwdossier', id, '/']),
  )
