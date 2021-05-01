import { screen, fireEvent, render } from '@testing-library/react'
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
    render(withAppContext(<DrawerPanelHeader>{text}</DrawerPanelHeader>))

    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('renders the close button if the header is closable', () => {
    render(withAppContext(<DrawerPanelHeader onClose={() => {}} />))

    expect(screen.getByTitle(CLOSE_BUTTON_TITLE)).toBeInTheDocument()
  })

  it('calls the onClose callback when the close button is clicked', () => {
    const onClose = jest.fn()
    render(withAppContext(<DrawerPanelHeader onClose={onClose} />))

    fireEvent.click(screen.getByTitle(CLOSE_BUTTON_TITLE))

    expect(onClose).toHaveBeenCalled()
  })
})
