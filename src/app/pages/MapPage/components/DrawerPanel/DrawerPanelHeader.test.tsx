import { fireEvent, render } from '@testing-library/react'
import withAppContext from '../../../../utils/withAppContext'
import DrawerPanelHeader from './DrawerPanelHeader'

const CLOSE_BUTTON_TITLE = 'Sluit paneel'

describe('DrawerPanelHeader', () => {
  it('renders the panel header', () => {
    const { container } = render(withAppContext(<DrawerPanelHeader />))

    expect(container.firstChild).toBeDefined()
  })

  it('renders the children passed to the header', () => {
    const text = 'Hello World!'
    const { getByText } = render(withAppContext(<DrawerPanelHeader>{text}</DrawerPanelHeader>))

    expect(getByText(text)).toBeDefined()
  })

  it('renders the close button if the header is closable', () => {
    const { getByTitle } = render(withAppContext(<DrawerPanelHeader onClose={() => {}} />))

    expect(getByTitle(CLOSE_BUTTON_TITLE)).toBeDefined()
  })

  it('calls the onClose callback when the close button is clicked', () => {
    const onClose = jest.fn()
    const { getByTitle } = render(withAppContext(<DrawerPanelHeader onClose={onClose} />))

    fireEvent.click(getByTitle(CLOSE_BUTTON_TITLE))

    expect(onClose).toHaveBeenCalled()
  })
})
