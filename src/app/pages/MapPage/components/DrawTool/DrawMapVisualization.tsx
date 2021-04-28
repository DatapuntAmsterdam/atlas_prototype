import { createClusterMarkers, MarkerClusterGroup } from '@amsterdam/arm-cluster'
import { GeoJSON } from '@amsterdam/react-maps'
import { FunctionComponent } from 'react'
import usePromise, { isPending, isRejected } from '@amsterdam/use-promise'
import geoJsonConfig from '../../../../../map/components/leaflet/services/geo-json-config.constant'
import config, { DataSelectionMapVisualizationType, DataSelectionType } from '../../config'
import { fetchWithToken } from '../../../../../shared/services/api/api'
import { normalizeMapVisualization } from './normalize'
import useLegacyDataselectionConfig from '../../../../components/DataSelection/useLegacyDataselectionConfig'
import useParam from '../../../../utils/useParam'
import { polygonParam } from '../../query-params'

const DrawMapVisualization: FunctionComponent = () => {
  const { currentDatasetType } = useLegacyDataselectionConfig()
  const [polygon] = useParam(polygonParam)
  const mapVisualizations = usePromise(async () => {
    if (!polygon) {
      return null
    }
    const searchParams = new URLSearchParams({
      shape: JSON.stringify(polygon?.polygon.map(({ lat, lng }) => [lng, lat])),
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
  }, [polygon])

  if (isPending(mapVisualizations)) {
    return null
  }

  if (isRejected(mapVisualizations)) {
    return null
  }

  return mapVisualizations.value ? (
    <>
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
          markers={createClusterMarkers({
            markers: mapVisualizations.value.data.map(({ latLng }) => latLng),
          })}
        />
      )}
    </>
  ) : null
}

export default DrawMapVisualization
