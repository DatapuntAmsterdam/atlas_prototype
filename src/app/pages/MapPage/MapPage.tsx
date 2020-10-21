import { constants, Map as MapComponent, useStateRef } from '@amsterdam/arm-core'
import { hooks } from '@amsterdam/asc-ui'
import L from 'leaflet'
import { FunctionComponent, useCallback, useContext, useEffect, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import MapContainer from '../../../map/containers/map/MapContainer'
import PanoramaViewer from '../../components/PanoramaViewer/PanoramaViewer'
import useParam from '../../utils/useParam'
import DataSelectionProvider from './draw/DataSelectionProvider'
import LeafletLayers from './LeafletLayers'
import MapContext from './MapContext'
import MapMarkers from './MapMarkers'
import {
  centerParam,
  locationParam,
  panoHeadingParam,
  panoPitchParam,
  zoomParam,
} from './query-params'

const StyledMapContainer = styled(MapContainer)`
  display: flex;
  flex-direction: column;
`

const GlobalStyle = createGlobalStyle<{
  panoActive?: boolean
  panoFullScreen: boolean
}>`
  body {
    touch-action: none;
    overflow: hidden; // This will prevent the scrollBar on iOS due to navigation bar
  }

  // Need to set the styled globally and not as a Styled Component as this will cause problems with leaflet calculating the map canvas / dimensions
  .leaflet-container {
    position: sticky !important;
    height: ${({ panoActive }) => (panoActive ? '50%' : '100%')};
  }
`

const { DEFAULT_AMSTERDAM_MAPS_OPTIONS } = constants

// Todo: get ID's from request
const PANO_LAYERS = [
  'pano-pano2020bi',
  'pano-pano2019bi',
  'pano-pano2018bi',
  'pano-pano2017bi',
  'pano-pano2016bi',
]

const MapPage: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { panoFullScreen } = useContext(MapContext)
  const [mapInstance, setMapInstance, mapInstanceRef] = useStateRef<L.Map | null>(null)
  const [center, setCenter] = useParam(centerParam)
  const [zoom, setZoom] = useParam(zoomParam)
  const [location] = useParam(locationParam)
  const [panoPitch] = useParam(panoPitchParam)
  const [panoHeading] = useParam(panoHeadingParam)
  // TODO: Import 'useMatchMedia' directly once this issue has been resolved: https://github.com/Amsterdam/amsterdam-styled-components/issues/1120
  const [showDesktopVariant] = hooks.useMatchMedia({ minBreakpoint: 'tabletM' })
  const panoActive = panoHeading !== null && location !== null

  return (
    <StyledMapContainer>
      <GlobalStyle panoActive={panoActive} panoFullScreen={panoFullScreen} />
      <MapComponent
        setInstance={setMapInstance}
        options={{
          ...DEFAULT_AMSTERDAM_MAPS_OPTIONS,
          zoom: zoom ?? DEFAULT_AMSTERDAM_MAPS_OPTIONS.zoom,
          center: center ?? DEFAULT_AMSTERDAM_MAPS_OPTIONS.center,
          attributionControl: false,
        }}
        events={{
          zoomend: useCallback(() => {
            if (mapInstanceRef?.current) {
              setZoom(mapInstanceRef.current.getZoom(), 'replace')
            }
          }, [mapInstanceRef, setZoom]),
          moveend: useCallback(() => {
            if (mapInstanceRef?.current) {
              setCenter(mapInstanceRef.current.getCenter(), 'replace')
            }
          }, [mapInstanceRef, setCenter]),
          loading: useCallback(() => {
            setIsLoading(true)
          }, [setIsLoading]),
          load: useCallback(() => {
            setIsLoading(false)
          }, [setIsLoading]),
        }}
      >
        <DataSelectionProvider>
          <LeafletLayers />
          {panoActive && <PanoramaViewer />}
          <MapMarkers panoActive={panoActive} />
          <MapPanelContent showDesktopVariant={showDesktopVariant} />
        </DataSelectionProvider>
      </MapComponent>
    </StyledMapContainer>
  )
}

export default MapPage
