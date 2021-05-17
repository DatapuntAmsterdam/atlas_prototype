import { Heading, themeSpacing } from '@amsterdam/asc-ui'
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { matchPath, Route, Switch, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useDataSelection } from '../../../../components/DataSelection/DataSelectionContext'
import { routing } from '../../../../routes'
import useParam from '../../../../utils/useParam'
import DetailPanel from '../../detail/DetailPanel'
import MapSearchResults from '../../map-search/MapSearchResults'
import { useMapContext } from '../../MapContext'
import { locationParam, polygonParam } from '../../query-params'
import DrawerOverlay, { DeviceMode, DrawerState } from '../DrawerOverlay'
import { DrawerPanelHeader, LargeDrawerPanel, SmallDrawerPanel } from '../DrawerPanel'
import DrawResults from '../DrawTool/DrawResults'
import LegendPanel from '../LegendPanel/LegendPanel'
import useMapControls from './useMapControls'

const TitleHeading = styled(Heading)`
  margin: 0;
`

const SubtitleHeading = styled(Heading)`
  color: red;
  margin: 0;
`

const DrawerContainer = styled.div`
  padding: ${themeSpacing(0, 4)};
`

const StyledLargeDrawerPanel = styled(LargeDrawerPanel)<{ show: boolean }>`
  display: ${({ show }) => (show ? 'block' : 'none')};
`

const MapPanel: FunctionComponent = () => {
  const { panelHeader } = useMapContext()
  const [legendActive, setLegendActive] = useState(false)
  const [drawerState, setDrawerState] = useState(DrawerState.Closed)
  const [locationParameter] = useParam(locationParam)
  const [polygon] = useParam(polygonParam)
  const location = useLocation()
  const { activeFilters } = useDataSelection()
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

  const onOpenLegend = useCallback(() => {
    setLegendActive(true)
    setDrawerState(DrawerState.Open)
  }, [])

  const onCloseLegend = () => {
    setLegendActive(false)
  }

  useEffect(() => {
    if (
      locationParameter ||
      polygon ||
      activeFilters.length ||
      matchPath(location.pathname, {
        path: routing.dataDetail_TEMP.path,
        exact: true,
      })
    ) {
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

  const controls = useMapControls(onOpenLegend)

  const showContentPanel = useMemo(() => {
    if (
      // Also geosearch-page always needs a location parameter
      matchPath(location.pathname, {
        path: routing.data_TEMP.path,
        exact: true,
      }) ||
      (dataSearchGeoMatch && !locationParameter)
    ) {
      return false
    }

    // Other pages definitely have content in drawer panel
    return true
  }, [matchPath, location, locationParameter, legendActive, activeFilters])

  return (
    <>
      <DrawerOverlay
        mode={DeviceMode.Desktop}
        controls={controls}
        state={drawerState}
        onStateChange={(state) => setDrawerState(state)}
      >
        {showContentPanel && (
          <StyledLargeDrawerPanel data-testid="drawerPanel" show={!legendActive}>
            <DrawerPanelHeader>
              {panelHeader.type && <SubtitleHeading as="h6">{panelHeader.type}</SubtitleHeading>}
              <TitleHeading styleAs="h2">{panelHeader.title}</TitleHeading>
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
                  <DrawResults />
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
