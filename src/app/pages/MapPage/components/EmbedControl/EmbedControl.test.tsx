import { fireEvent, render, screen } from '@testing-library/react'
import { FunctionComponent } from 'react'
import { MemoryRouter as Router } from 'react-router-dom'
import { routing } from '../../../../routes'
import EmbedControl from './EmbedControl'

describe('EmbedControl', () => {
  const wrapper: FunctionComponent = ({ children }) => (
    <Router initialEntries={[`${routing.data_TEMP.path}?embed=true`]}>{children}</Router>
  )

  it('renders the control', () => {
    const { container } = render(<EmbedControl />, { wrapper })
    expect(container.firstChild).toBeDefined()
  })

  it('opens the url with the embed disabled', () => {
    const openMock = jest.spyOn(window, 'open').mockImplementation(jest.fn())

    render(<EmbedControl />, { wrapper })
    fireEvent.click(screen.getByTestId('embedButton'))

    expect(openMock).toBeCalledWith(routing.data_TEMP.path, 'blank')

    openMock.mockRestore()
  })
})
