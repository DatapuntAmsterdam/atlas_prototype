import { render, screen } from '@testing-library/react'
import type { FunctionComponent } from 'react'
import withAppContext from '../../../../utils/withAppContext'
import AuthTokenContext from '../../AuthTokenContext'
import LoginAlert from './LoginAlert'

const wrapper: FunctionComponent = ({ children }) =>
  withAppContext(
    <AuthTokenContext.Provider value={{ token: null, isTokenExpired: null }}>
      {children}
    </AuthTokenContext.Provider>,
  )

const expiredWrapper: FunctionComponent = ({ children }) =>
  withAppContext(
    <AuthTokenContext.Provider value={{ token: null, isTokenExpired: true }}>
      {children}
    </AuthTokenContext.Provider>,
  )

describe('LoginAlert', () => {
  it('renders the alert', () => {
    const { container } = render(<LoginAlert restricted={false} onRequestLoginLink={() => {}} />, {
      wrapper,
    })
    expect(container.firstChild).toBeDefined()
  })

  it('renders a message that documents are restricted to public and gemeente users', () => {
    render(<LoginAlert restricted={false} onRequestLoginLink={() => {}} />, {
      wrapper,
    })

    expect(screen.getByTestId('noRights')).toBeInTheDocument()
  })

  it('renders a message if the documents are restricted to gemeente users', () => {
    render(<LoginAlert restricted onRequestLoginLink={() => {}} />, {
      wrapper,
    })

    expect(screen.getByTestId('noExtendedRights')).toBeInTheDocument()
  })

  it('renders a message that the documents are restricted with an expired token', () => {
    render(<LoginAlert restricted={false} onRequestLoginLink={() => {}} />, {
      wrapper: expiredWrapper,
    })

    expect(screen.getByTestId('noValidToken')).toBeInTheDocument()
  })
})
