import { LocationDescriptorObject } from 'history'
import ReduxRouterLink, { To } from 'redux-first-router-link'
import { Link as RouterLink } from 'react-router-dom'

export default function pickLinkComponent(to: To | LocationDescriptorObject) {
  if (typeof to === 'object' && 'pathname' in to) {
    return RouterLink
  }

  if (typeof to === 'string') {
    return RouterLink
  }

  return ReduxRouterLink
}
