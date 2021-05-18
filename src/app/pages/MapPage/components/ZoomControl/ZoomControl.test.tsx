import { useMapInstance } from '@amsterdam/react-maps'
import { screen, fireEvent, render } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import type { Map } from 'leaflet'
import withAppContext from '../../../../utils/withAppContext'
import ZoomControl from './ZoomControl'

jest.mock('@amsterdam/react-maps')

const mockedUseMapInstance = mocked(useMapInstance)

describe('ZoomControl', () => {
  beforeEach(() => {
    mockedUseMapInstance.mockReturnValue({} as Map)
  })

  it('renders the control', () => {
    const { container } = render(withAppContext(<ZoomControl />))

    expect(container.firstChild).toBeDefined()
  })

  it('zooms in on the map when the zoom in button is clicked', () => {
    const mockedZoomIn = jest.fn()

    mockedUseMapInstance.mockReturnValueOnce({
      zoomIn: mockedZoomIn,
    } as unknown as Map)

    render(withAppContext(<ZoomControl />))

    fireEvent.click(screen.getByTitle('Inzoomen'))
    expect(mockedZoomIn).toBeCalled()
  })

  it('zooms out on the map when the zoom out button is clicked', () => {
    const mockedZoomOut = jest.fn()

    mockedUseMapInstance.mockReturnValueOnce({
      zoomOut: mockedZoomOut,
    } as unknown as Map)

    render(withAppContext(<ZoomControl />))

    fireEvent.click(screen.getByTitle('Uitzoomen'))
    expect(mockedZoomOut).toBeCalled()
  })
})
