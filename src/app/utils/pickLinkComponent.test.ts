import { Link as RouterLink } from 'react-router-dom'
import ReduxRouterLink from 'redux-first-router-link'
import type { LocationDescriptorObject } from 'history'
import type { To } from 'redux-first-router-link'
import pickLinkComponent from './pickLinkComponent'

describe('pickLinkComponent', () => {
  it('returns a React router link for location descriptors', () => {
    const location: LocationDescriptorObject = {
      pathname: 'foo',
    }

    expect(pickLinkComponent(location)).toEqual(RouterLink)
  })

  it('returns a React router link for string paths', () => {
    expect(pickLinkComponent('foo')).toEqual(RouterLink)
  })

  it('returns a Redux First router link for actions', () => {
    const location: To = {
      type: 'foo',
      payload: 'bar',
    }

    expect(pickLinkComponent(location)).toEqual(ReduxRouterLink)
  })
})
