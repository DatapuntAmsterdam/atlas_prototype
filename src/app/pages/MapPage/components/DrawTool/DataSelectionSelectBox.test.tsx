import { screen, fireEvent, render } from '@testing-library/react'
import DataSelectionSelectBox from './DataSelectionSelectBox'
import withAppContext from '../../../../utils/withAppContext'
import { routing } from '../../../../routes'
import { DataSelectionType } from '../../config'

const mockPush = jest.fn()
let pathname = routing.addresses.path
jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockPush,
  }),
  useLocation: () => ({
    pathname,
    search: '',
  }),
}))

describe('DataSelectionSelectBox', () => {
  it('should render 3 options', () => {
    render(withAppContext(<DataSelectionSelectBox />))
    const selectBox = screen.getByTestId('dataSelectionSelectBox')

    expect(selectBox.querySelectorAll('option').length).toBe(3)
  })

  it('should navigate to the right page when selecting a value', () => {
    render(withAppContext(<DataSelectionSelectBox />))
    const selectBox = screen.getByTestId('dataSelectionSelectBox')
    fireEvent.change(selectBox, {
      target: { value: DataSelectionType.HR },
    })
    expect(mockPush).toHaveBeenCalledWith({
      pathname: routing.establishments.path,
      search: '',
    })

    fireEvent.change(selectBox, {
      target: { value: DataSelectionType.BRK },
    })
    expect(mockPush).toHaveBeenCalledWith({
      pathname: routing.cadastralObjects.path,
      search: '',
    })

    fireEvent.change(selectBox, {
      target: { value: DataSelectionType.BAG },
    })
    expect(mockPush).toHaveBeenCalledWith({
      pathname: routing.addresses.path,
      search: '',
    })
  })

  it('should set the correct value based on current route', () => {
    pathname = routing.establishments.path
    const { rerender } = render(withAppContext(<DataSelectionSelectBox />))
    expect(screen.getByTestId('selectedValue')).toHaveTextContent('Vestigingen')

    pathname = routing.addresses.path
    rerender(withAppContext(<DataSelectionSelectBox />))
    expect(screen.getByTestId('selectedValue')).toHaveTextContent('Adressen')

    pathname = routing.cadastralObjects.path
    rerender(withAppContext(<DataSelectionSelectBox />))
    expect(screen.getByTestId('selectedValue')).toHaveTextContent('Kadastrale objecten')
  })

  it('should not render when component is used outside dataselection pages', () => {
    pathname = 'foo/bar'
    const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation(() => {})
    render(withAppContext(<DataSelectionSelectBox />))
    expect(screen.queryByTestId('dataSelectionSelectBox')).not.toBeInTheDocument()
    expect(consoleWarnMock).toHaveBeenCalled()
  })
})
