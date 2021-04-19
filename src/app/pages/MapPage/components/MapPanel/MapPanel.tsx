import { Heading, hooks, themeSpacing } from '@amsterdam/asc-ui'
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Route, Switch, useHistory, useLocation, matchPath } from 'react-router-dom'
import { DrawerPanelHeader, LargeDrawerPanel, SmallDrawerPanel } from '../DrawerPanel'
import DrawerOverlay, { DeviceMode, DrawerState } from '../DrawerOverlay'
import { Overlay } from '../../types'
import { routing } from '../../../../routes'
import MapSearchResults from '../../map-search/MapSearchResults'
import DetailPanel from '../../detail/DetailPanel'
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner'
import LegendPanel from '../LegendPanel/LegendPanel'
import useMapControls from './useMapControls'
import {
  locationParam,
  panoFovParam,
  panoHeadingParam,
  panoPitchParam,
  polygonParam,
} from '../../query-params'
import useBuildQueryString from '../../../../utils/useBuildQueryString'
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
`

interface MapPanelProps {
  loading: boolean
}

const MapPanel: FunctionComponent<MapPanelProps> = ({ loading }) => {
  const [legendActive, setLegendActive] = useState(false)
  const [drawerState, setDrawerState] = useState(DrawerState.Closed)
  const [locationParameter, setLocationParameter] = useParam(locationParam)
  const [polygon] = useParam(polygonParam)
  const [showDesktopVariant] = hooks.useMatchMedia({ minBreakpoint: 'tabletM' })
  const history = useHistory()
  const location = useLocation()
  const { buildQueryString } = useBuildQueryString()
  const mode = showDesktopVariant ? DeviceMode.Desktop : DeviceMode.Mobile

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

  const onClosePanel = useCallback(() => {
    if (matchPath(location.pathname, routing.dataSearchGeo_TEMP.path)) {
      setLocationParameter(null)
    }
    if (matchPath(location.pathname, routing.dataDetail_TEMP.path)) {
      history.push({
        pathname: routing.dataSearchGeo_TEMP.path,
        search: buildQueryString([
          [panoPitchParam, null],
          [panoHeadingParam, null],
          [panoFovParam, null],
        ]),
      })
    }
  }, [history, buildQueryString, panoPitchParam, panoHeadingParam, panoFovParam, setDrawerState])

  const controls = useMapControls(showDesktopVariant, onOpenLegend)

  const DrawerPanel = useMemo(() => (legendActive ? SmallDrawerPanel : LargeDrawerPanel), [
    legendActive,
  ])

  const showContentPanel = useMemo(() => {
    if (
      // Do not show content panel when legend is active
      legendActive ||
      // Also geosearch-page always needs a location parameter
      (matchPath(location.pathname, routing.dataSearchGeo_TEMP.path) && !locationParameter) ||
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
          <DrawerPanel data-testid="drawerPanel">
            <DrawerPanelHeader onClose={onClosePanel}>
              <TitleHeading styleAs="h1">Resultaten</TitleHeading>
            </DrawerPanelHeader>
            <DrawerContainer>
              {loading && <LoadingSpinner />}
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
          </DrawerPanel>
        )}
        {legendActive && (
          <SmallDrawerPanel data-testid="drawerPanel">
            <DrawerPanelHeader onClose={onCloseLegend}>
              <TitleHeading styleAs="h1">Legenda</TitleHeading>
              <SubtitleHeading as="h3">Een kaartpaneel</SubtitleHeading>
            </DrawerPanelHeader>
            <LegendPanel />
          </SmallDrawerPanel>
        )}
      </DrawerOverlay>
    </>
  )
}

export default MapPanel
