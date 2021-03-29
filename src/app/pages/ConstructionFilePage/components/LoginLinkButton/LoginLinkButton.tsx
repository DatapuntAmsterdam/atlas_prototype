import { useMatomo } from '@datapunt/matomo-tracker-react'
import { FunctionComponent } from 'react'
import { login } from '../../../../../shared/services/auth/auth'
import useDocumentTitle from '../../../../utils/useDocumentTitle'
import LinkButton from '../LinkButton'

const LoginLinkButton: FunctionComponent = ({ children, ...otherProps }) => {
  const { trackEvent } = useMatomo()
  const { documentTitle } = useDocumentTitle()

  function handleClick() {
    trackEvent({ category: 'login', name: documentTitle, action: 'inloggen' })
    login()
  }

  return (
    <LinkButton {...otherProps} type="button" onClick={handleClick}>
      {children}
    </LinkButton>
  )
}

export default LoginLinkButton
