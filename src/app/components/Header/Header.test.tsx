import { render, screen } from '@testing-library/react'
import Header from './Header'
import withAppContext from '../../utils/withAppContext'

// Mock the HeaderSearchContainer component as its not relevant for this test
jest.mock('../../../header/components/HeaderSearch', () => () => <div />)

describe('Header', () => {
  it('should render', () => {
    render(withAppContext(<Header hasMaxWidth homePage={false} />))
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })
})
