import { Button } from '@amsterdam/asc-ui'
import { ChevronRight } from '@amsterdam/asc-assets'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { FunctionComponent } from 'react'
import { login } from '../../../../shared/services/auth/auth'
import useDocumentTitle from '../../../utils/useDocumentTitle'

export interface LoginLinkProps {
  showChevron?: boolean
}

const LoginLink: FunctionComponent<LoginLinkProps> = ({ showChevron = true, children }) => {
  const { trackEvent } = useMatomo()
  const { documentTitle } = useDocumentTitle()

  return (
    <Button
      data-testid="link"
      variant="textButton"
      iconLeft={showChevron && <ChevronRight />}
      iconSize={12}
      onClick={() => {
        trackEvent({ category: 'login', name: documentTitle, action: 'inloggen' })
        login()
      }}
    >
      {children || 'Inloggen'}
    </Button>
  )
}

export default LoginLink
