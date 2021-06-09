import { render, screen } from '@testing-library/react'
import withAppContext from '../../utils/withAppContext'
import AuthAlert from './AuthAlert'

describe('AuthAlert', () => {
  it('should render with an additional message', () => {
    render(withAppContext(<AuthAlert excludedResults="Lorem ipsum" />))

    expect(screen.getByText('over: Lorem ipsum.', { exact: false })).toBeInTheDocument()
  })
})
