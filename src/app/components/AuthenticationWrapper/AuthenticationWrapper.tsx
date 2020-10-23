import React, { FunctionComponent, ReactElement } from 'react'
import AuthScope from '../../../shared/services/api/authScope'
import useAuthScope from '../../utils/useAuthScope'
import AuthAlert, { AuthAlertProps } from '../Alerts/AuthAlert'

interface Props extends AuthAlertProps {
  authScopes?: AuthScope[]
  authScopeRequired?: boolean
  /**
   * Whether the alert should rendered first. Default: false
   */
  alertFirst?: boolean
  children: () => ReactElement | null
}

const AuthenticationWrapper: FunctionComponent<Props> = ({
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

  const alert = showAlert && <AuthAlert {...{ specialAuthLevel, excludedResults }} />
  const result = (userIsAuthorized || !authScopeRequired) && children()
  return (
    <>
      {alertFirst ? alert : result}
      {alertFirst ? result : alert}
    </>
  )
}

export default AuthenticationWrapper
