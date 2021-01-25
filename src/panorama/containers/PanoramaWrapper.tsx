import { FunctionComponent } from 'react'
import { Alert, Paragraph } from '@amsterdam/asc-ui'
import PanoramaContainer from './PanoramaContainer'
import PanoAlert from '../../app/components/PanoAlert/PanoAlert'
import { ERROR_MESSAGES, ErrorType } from '../../shared/ducks/error/error-message'
import useCheckPanoramaPermission from '../../app/utils/useCheckPanoramaPermission'

/**
 * Wrapper to check if user is allowed to view the panorama pictures by requesting
 * random panorama info.
 * If the API returns a 403 Forbidden status code, show PanoAlert, otherwise show a generic error
 * @constructor
 */
const PanoramaWrapper: FunctionComponent = () => {
  const { showComponent, isForbidden, hasGenericError } = useCheckPanoramaPermission()

  if (!showComponent) {
    return null
  }

  if (isForbidden) {
    return <PanoAlert />
  }

  if (hasGenericError) {
    return (
      <Alert level="error" dismissible>
        <Paragraph>{ERROR_MESSAGES[ErrorType.General]}</Paragraph>
      </Alert>
    )
  }

  return <PanoramaContainer />
}

export default PanoramaWrapper
