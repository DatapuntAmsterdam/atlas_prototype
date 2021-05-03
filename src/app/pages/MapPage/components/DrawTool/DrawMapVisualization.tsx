import { MarkerClusterGroup } from '@amsterdam/arm-cluster'
import { GeoJSON } from '@amsterdam/react-maps'
import { FunctionComponent } from 'react'
import { createGlobalStyle } from 'styled-components'
import { BaseIconOptions, Icon, LatLng, Marker } from 'leaflet'
import usePromise, { isPending, isRejected } from '@amsterdam/use-promise'
import { useHistory } from 'react-router-dom'
import geoJsonConfig from '../../../../../map/components/leaflet/services/geo-json-config.constant'
import config, { DataSelectionMapVisualizationType, DataSelectionType } from '../../config'
import { fetchWithToken } from '../../../../../shared/services/api/api'
import { normalizeMapVisualization } from './normalize'
import useLegacyDataselectionConfig from '../../../../components/DataSelection/useLegacyDataselectionConfig'
import useParam from '../../../../utils/useParam'
import { drawToolOpenParam, polygonParam } from '../../query-params'
import { useDataSelection } from '../../../../components/DataSelection/DataSelectionContext'
import { createFiltersObject } from '../../../../../shared/services/data-selection/normalizations'
import { useMapContext } from '../../MapContext'
import ICON_CONFIG from '../../../../../map/components/leaflet/services/icon-config.constant'
import useBuildQueryString from '../../../../utils/useBuildQueryString'

const GlobalStyle = createGlobalStyle`
  .dataselection-detail-marker {
    cursor: pointer !important;
  }
`

const DrawMapVisualization: FunctionComponent = () => {
  const { currentDatasetType } = useLegacyDataselectionConfig()
  const [polygon] = useParam(polygonParam)
  const { activeFilters } = useDataSelection()
  const { showMapDrawVisualization } = useMapContext()
  const history = useHistory()
  const { buildQueryString } = useBuildQueryString()

  const mapVisualizations = usePromise(async () => {
    if (!polygon && !activeFilters.length) {
      return null
    }
    const searchParams = new URLSearchParams({
      shape: JSON.stringify(polygon?.polygon.map(({ lat, lng }) => [lng, lat])),
      ...createFiltersObject(activeFilters),
    })
    const {
      object_list: data,
      eigenpercelen: eigenPercelen,
      niet_eigenpercelen: nietEigenPercelen,
      extent,
    } = await fetchWithToken(
      `${
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        config[currentDatasetType.toUpperCase()]?.endpointMapVisualization ?? ''
      }?${searchParams.toString()}`,
    )
    return normalizeMapVisualization(currentDatasetType.toUpperCase() as DataSelectionType, data, {
      eigenPercelen,
      nietEigenPercelen,
      extent,
    })
  }, [polygon, activeFilters])

  if (isPending(mapVisualizations)) {
    return null
  }

  if (isRejected(mapVisualizations)) {
    return null
  }

  return showMapDrawVisualization && mapVisualizations.value ? (
    <>
      <GlobalStyle />
      {mapVisualizations.value.type === DataSelectionMapVisualizationType.GeoJSON &&
        mapVisualizations.value.data.map((feature) => (
          <GeoJSON
            args={[feature.geometry]}
            key={`${mapVisualizations.value?.id ?? ''}_${feature.name}`}
            options={{
              // TODO: move geoJsonConfig to new dataselection config.ts when legacy map is removed
              style: geoJsonConfig[feature.name as any]?.style,
            }}
            setInstance={(layer) => layer.bringToBack()}
          />
        ))}
      {mapVisualizations.value.type === DataSelectionMapVisualizationType.Markers && (
        <MarkerClusterGroup
          key={mapVisualizations.value.id}
          markers={mapVisualizations.value.data.map(({ latLng, id }) => {
            const lat = latLng[0]
            const lng = latLng[1]
            const marker = new Marker(new LatLng(lat, lng), {
              icon: new Icon({
                ...ICON_CONFIG.DETAIL,
                className: 'dataselection-detail-marker',
              } as BaseIconOptions),
            })

            marker.on('click', () => {
              history.push({
                pathname: config[currentDatasetType.toUpperCase()].getDetailPath(id),
                search: buildQueryString(undefined, [polygonParam, drawToolOpenParam]),
              })
            })

            return marker
          })}
        />
      )}
    </>
  ) : null
}

export default DrawMapVisualization
