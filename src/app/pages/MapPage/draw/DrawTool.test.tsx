import { render } from '@testing-library/react'
import { useMapInstance } from '@amsterdam/react-maps'
import { mocked } from 'ts-jest/utils'
import { Map } from 'leaflet'
import withAppContext from '../../../utils/withAppContext'
import DrawTool from './DrawTool'

jest.mock('@amsterdam/react-maps')

const mockedUseMapInstance = mocked(useMapInstance)

mockedUseMapInstance.mockReturnValueOnce(({
  on: () => {},
  off: () => {},
} as unknown) as Map)

describe('DrawTool', () => {
  it('renders the drawtool', () => {
    const { container } = render(withAppContext(<DrawTool setCurrentOverlay={() => {}} />))

    expect(container.firstChild).toBeDefined()
  })
})
