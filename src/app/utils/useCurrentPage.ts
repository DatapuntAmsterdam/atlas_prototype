import { useLocation } from 'react-router-dom'
import { routing } from '../routes'

/**
 * Temporary replacement for getCurrentPage selector in redux-first-router.
 *
 * Redux-first-router is updated earlier than react-router-dom, so when using react-router, use this
 * hook instead using the getCurrentPage selector
 */
const useCurrentPage = () => {
  const location = useLocation()
  return Object.values(routing).find((value) => value.path === location.pathname)?.page as string
}

export default useCurrentPage
