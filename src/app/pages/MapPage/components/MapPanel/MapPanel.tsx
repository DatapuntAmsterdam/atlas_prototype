import { Heading, themeSpacing, useMatchMedia } from '@amsterdam/asc-ui'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { matchPath, Route, Switch, useLocation } from 'react-router-dom'
import { DrawerPanelHeader, LargeDrawerPanel, SmallDrawerPanel } from '../DrawerPanel'
import DrawerOverlay, { DeviceMode, DrawerState } from '../DrawerOverlay'
import { Overlay } from '../../types'
import { routing } from '../../../../routes'
import MapSearchResults from '../../map-search/MapSearchResults'
import DetailPanel from '../../detail/DetailPanel'
import LegendPanel from '../LegendPanel/LegendPanel'
import useMapControls from './useMapControls'
import { locationParam, polygonParam } from '../../query-params'
import DrawResults from '../DrawTool/DrawResults'
import useParam from '../../../../utils/useParam'

const TitleHeading = styled(Heading)`
  margin: 0;
`

const SubtitleHeading = styled(Heading)`
  color: red;
  margin: 0;
`

const DrawerContainer = styled.div`
  padding: ${themeSpacing(0, 4)};
  margin: ${themeSpacing(3, 0)};
`

const StyledLargeDrawerPanel = styled(LargeDrawerPanel)<{ show: boolean }>`
  display: ${({ show }) => (show ? 'block' : 'none')};
`

const MapPanel: FunctionComponent = () => {
  const [legendActive, setLegendActive] = useState(false)
  const [drawerState, setDrawerState] = useState(DrawerState.Closed)
  const [locationParameter] = useParam(locationParam)
  const [polygon] = useParam(polygonParam)
  const [showDesktopVariant] = useMatchMedia({ minBreakpoint: 'tabletM' })
  const location = useLocation()
  const mode = showDesktopVariant ? DeviceMode.Desktop : DeviceMode.Mobile
  // TODO: Replace this logic with 'useRouteMatch()' when the following PR has been released:
  // https://github.com/ReactTraining/react-router/pull/7822
  const dataDetailMatch = useMemo(
    () => matchPath(location.pathname, routing.dataDetail_TEMP.path),
    [location.pathname, routing.dataDetail_TEMP.path],
  )

  const dataSearchGeoMatch = useMemo(
    () => matchPath(location.pathname, routing.dataSearchGeo_TEMP.path),
    [location.pathname, routing.dataSearchGeo_TEMP.path],
  )

  const onOpenLegend = () => {
    setLegendActive(true)
    setDrawerState(mode === DeviceMode.Desktop ? DrawerState.Open : DrawerState.Preview)
  }

  const onCloseLegend = () => {
    setLegendActive(false)
  }

  useEffect(() => {
    if (locationParameter || polygon) {
      setDrawerState(DrawerState.Open)
    }
  }, [locationParameter, polygon])

  // Hide the legend when any of the following events occur:
  // - The user selects an item on the map, navigating to a detail panel.
  // - The user selects a point on the map, navigating to a geo search panel.
  // - The users moves the point on the map, whilst already having the geo search panel open.
  useEffect(() => {
    if (dataDetailMatch || dataSearchGeoMatch) {
      setLegendActive(false)
    }
  }, [dataDetailMatch, dataSearchGeoMatch, locationParameter])

  const controls = useMapControls(showDesktopVariant, onOpenLegend)

  const showContentPanel = useMemo(() => {
    if (
      // Also geosearch-page always needs a location parameter
      matchPath(location.pathname, {
        path: routing.data_TEMP.path,
        exact: true,
      }) ||
      (dataSearchGeoMatch && !locationParameter) ||
      ((matchPath(location.pathname, routing.addresses_TEMP.path) ||
        matchPath(location.pathname, routing.establishments_TEMP.path) ||
        matchPath(location.pathname, routing.cadastralObjects_TEMP.path)) &&
        !polygon)
    ) {
      return false
    }

    // Other pages definitely have content in drawer panel
    return true
  }, [matchPath, location, locationParameter, legendActive])

  return (
    <>
      <DrawerOverlay
        mode={mode}
        controls={controls}
        state={drawerState}
        onStateChange={(state) => setDrawerState(state)}
      >
        {showContentPanel && (
          <StyledLargeDrawerPanel data-testid="drawerPanel" show={!legendActive}>
            <DrawerPanelHeader>
              <SubtitleHeading as="h6">Een kaartpaneel</SubtitleHeading>
              <TitleHeading styleAs="h2">Resultaten</TitleHeading>
            </DrawerPanelHeader>
            <DrawerContainer>
              <Switch>
                <Route path={[routing.dataSearchGeo_TEMP.path, routing.panorama_TEMP.path]}>
                  <MapSearchResults />
                </Route>
                <Route path={[routing.dataDetail_TEMP.path]}>
                  <DetailPanel />
                </Route>
                <Route
                  path={[
                    routing.addresses_TEMP.path,
                    routing.establishments_TEMP.path,
                    routing.cadastralObjects_TEMP.path,
                  ]}
                  exact
                >
                  <DrawResults currentOverlay={Overlay.Results} />
                </Route>
              </Switch>
            </DrawerContainer>
          </StyledLargeDrawerPanel>
        )}
        {legendActive && (
          <SmallDrawerPanel data-testid="drawerPanel">
            <DrawerPanelHeader onClose={onCloseLegend}>
              <TitleHeading styleAs="h2">Legenda</TitleHeading>
            </DrawerPanelHeader>
            <LegendPanel />
          </SmallDrawerPanel>
        )}
      </DrawerOverlay>
    </>
  )
}

export default MapPanel
