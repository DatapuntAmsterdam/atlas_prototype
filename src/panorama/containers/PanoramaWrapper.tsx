import { FunctionComponent } from 'react'
import { Alert, Paragraph } from '@amsterdam/asc-ui'
import PanoramaContainer from './PanoramaContainer'
import PanoAlert from '../../app/components/PanoAlert/PanoAlert'
import { ERROR_MESSAGES, ErrorType } from '../../shared/ducks/error/error-message'
import usePromise from '../../app/utils/usePromise'
import { fetchWithoutToken } from '../../shared/services/api/api'
import { ForbiddenError } from '../../shared/services/api/customError'

/**
 * Wrapper to check if user is allowed to view the panorama pictures by requesting
 * random panorama info.
 * If the API returns a 403 Forbidden status code, show PanoAlert, otherwise show a generic error
 */
const PanoramaWrapper: FunctionComponent = () => {
  const result = usePromise(
    // A small response that will only be available on gov. network
    // Do not pass the token, as this will result in a 401 on production environment
    () => fetchWithoutToken('https://acc.api.data.amsterdam.nl/brk/?format=json'),
    [],
  )

  if (result.status === 'fulfilled') {
    return <PanoramaContainer />
  }

  if (result.status === 'rejected') {
    if (result.error instanceof ForbiddenError) {
      return <PanoAlert />
    }

    return (
      <Alert level="error" dismissible>
        <Paragraph>{ERROR_MESSAGES[ErrorType.General]}</Paragraph>
      </Alert>
    )
  }

  return null
}

export default PanoramaWrapper
