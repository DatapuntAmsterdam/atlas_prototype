import { render } from '@testing-library/react'
import withAppContext from '../../utils/withAppContext'
import HeaderMenu from './HeaderMenu'
import navigationLinks from '../HomePage/services/navigationLinks'
import { HEADER_LINK_HELP, HEADER_LINKS_ABOUT } from '../../../shared/config/content-links'

describe('HeaderMenu', () => {
  it('should render all links', () => {
    const { getByTestId } = render(withAppContext(<HeaderMenu type="default" />))

    navigationLinks.forEach(({ testId }) => {
      expect(getByTestId(testId)).toBeDefined()
    })
    HEADER_LINKS_ABOUT.forEach(({ testId }) => {
      expect(getByTestId(testId)).toBeDefined()
    })

    expect(getByTestId('headerMenuLinkFeedback')).toBeDefined()
    expect(getByTestId('headerMenuLinkLogin')).toBeDefined()
    expect(getByTestId(HEADER_LINK_HELP.testId)).toBeDefined()
  })
})
