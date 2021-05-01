import { screen, render } from '@testing-library/react'
import withAppContext from '../../utils/withAppContext'
import HeaderMenu from './HeaderMenu'
import navigationLinks from '../HomePage/services/navigationLinks'
import { HEADER_LINK_HELP, HEADER_LINKS_ABOUT } from '../../../shared/config/content-links'

describe('HeaderMenu', () => {
  it('should render all links', () => {
    render(withAppContext(<HeaderMenu type="default" />))

    navigationLinks.forEach(({ testId }) => {
      expect(screen.getByTestId(testId)).toBeInTheDocument()
    })
    HEADER_LINKS_ABOUT.forEach(({ testId }) => {
      expect(screen.getByTestId(testId)).toBeInTheDocument()
    })

    expect(screen.getByTestId('headerMenuLinkFeedback')).toBeInTheDocument()
    expect(screen.getByTestId('headerMenuLinkLogin')).toBeInTheDocument()
    expect(screen.getByTestId(HEADER_LINK_HELP.testId)).toBeInTheDocument()
  })
})
