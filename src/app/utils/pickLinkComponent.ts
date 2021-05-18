import ReduxRouterLink from 'redux-first-router-link'
import { Link as RouterLink } from 'react-router-dom'
import type { LocationDescriptorObject } from 'history'
import type { To } from 'redux-first-router-link'

export default function pickLinkComponent(to: To | LocationDescriptorObject) {
  if (typeof to === 'string' || (typeof to === 'object' && 'pathname' in to)) {
    return RouterLink
  }

  return ReduxRouterLink
}
