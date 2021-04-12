import { FunctionComponent } from 'react'
import { Alert, Paragraph } from '@amsterdam/asc-ui'
import { useSelector } from 'react-redux'
import PanoramaContainer from './PanoramaContainer'
import PanoAlert from '../../app/components/PanoAlert/PanoAlert'
import { ERROR_MESSAGES, ErrorType } from '../../shared/ducks/error/error-message'
import { ForbiddenError } from '../../shared/services/api/customError'
import { getPanoramaError } from '../ducks/selectors'

/**
 * Wrapper to check if user is allowed to view the panorama pictures by requesting
 * random panorama info.
 * If the API returns a 403 Forbidden status code, show PanoAlert, otherwise show a generic error
 */
const PanoramaWrapper: FunctionComponent = () => {
  const error = useSelector(getPanoramaError)
  if (error) {
    if (error instanceof ForbiddenError) {
      return <PanoAlert />
    }
    return (
      <Alert level="error" dismissible>
        <Paragraph>{ERROR_MESSAGES[ErrorType.General]}</Paragraph>
      </Alert>
    )
  }

  return <PanoramaContainer />
}

export default PanoramaWrapper
