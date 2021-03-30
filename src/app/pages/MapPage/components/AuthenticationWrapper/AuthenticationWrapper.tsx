import { FunctionComponent, ReactElement } from 'react'
import AuthScope from '../../../../../shared/services/api/authScope'
import useAuthScope from '../../../../utils/useAuthScope'
import AuthAlert, { AuthAlertProps } from '../../../../components/Alerts/AuthAlert'

export interface AuthenticationWrapperProps extends AuthAlertProps {
  authScopes?: AuthScope[]
  authScopeRequired?: boolean
  /**
   * Whether the alert should rendered first. Default: false
   */
  alertFirst?: boolean
  children: () => ReactElement | null
}

const AuthenticationWrapper: FunctionComponent<AuthenticationWrapperProps> = ({
  authScopes,
  excludedResults,
  authScopeRequired,
  specialAuthLevel,
  children,
  alertFirst,
}) => {
  const { isUserAuthorized } = useAuthScope()
  const userIsAuthorized = isUserAuthorized(authScopes)
  const showAlert = !userIsAuthorized
  const result = (userIsAuthorized || !authScopeRequired) && children()
  const alert = showAlert && (
    <AuthAlert specialAuthLevel={specialAuthLevel} excludedResults={excludedResults} />
  )

  return (
    <>
      {alertFirst ? alert : result}
      {alertFirst ? result : alert}
    </>
  )
}

export default AuthenticationWrapper
