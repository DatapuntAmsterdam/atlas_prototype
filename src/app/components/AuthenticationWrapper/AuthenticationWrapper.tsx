import React, { FunctionComponent, ReactElement } from 'react'
import AuthScope from '../../../shared/services/api/authScope'
import useAuthScope from '../../utils/useAuthScope'
import MoreResultsWhenLoggedIn from '../Alerts/MoreResultsWhenLoggedIn'

type Props = {
  authScopes?: AuthScope[]
  excludedResults?: string
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
  children,
  alertFirst,
}) => {
  const { isUserAuthorized } = useAuthScope()
  const userIsAuthorized = isUserAuthorized(authScopes)
  const showAlert = !userIsAuthorized

  const alert = showAlert && <MoreResultsWhenLoggedIn excludedResults={excludedResults} />
  const result = (userIsAuthorized || !authScopeRequired) && children()
  return (
    <>
      {alertFirst ? alert : result}
      {alertFirst ? result : alert}
    </>
  )
}

export default AuthenticationWrapper
