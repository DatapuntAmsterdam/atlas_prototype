/**
 * @jest-environment jsdom-global
 */
import { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import MapPage from './MapPage'
import withMapContext from '../../utils/withMapContext'

jest.mock('./MapMarkers', () => () => <div data-testid="mapMarkers" />)
jest.mock('./components/MapPanel/MapPanel', () => () => <div data-testid="mapPanel" />)
jest.mock('./components/DrawTool/DrawResults', () => () => <div data-testid="drawResults" />)
jest.mock('../../components/PanoramaViewer/PanoramaViewer', () => () => (
  <div data-testid="panoramaViewer" />
))

jest.mock('@amsterdam/arm-core', () => ({
  // @ts-ignore
  ...jest.requireActual('@amsterdam/arm-core'),
  Map: ({ children }: PropsWithChildren<any>) => <div>{children}</div>,
}))

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    search: 'heading=10&locatie=12.12,3.21',
  }),
}))

describe('MapPage', () => {
  it('should show the PanoramaViewer when panoHeading and locatie parameters are set', async () => {
    const { findByTestId } = render(withMapContext(<MapPage />))

    const component = await findByTestId('panoramaViewer')
    expect(component).toBeDefined()
  })
})
