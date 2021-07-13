import { themeColor } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import type { FunctionComponent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useIsEmbedded } from '../../../../contexts/ui'
import MapCollectionButton from './MapCollectionButton'
import MapLayerWithLegendItem from './MapLayerWithLegendItem'
import MapLayerButton from './MapLayerButton'
import type { ExtendedMapGroup } from '../../legacy/services'

const MapCollectionList = styled.ul`
  background-color: ${themeColor('tint', 'level1')};
  border-top: none;
  list-style-type: none;
  padding: 0;
  user-select: none;
`

export interface MapLegendProps {
  activeMapLayers: ExtendedMapGroup[]
  title: string
  onAddLayers: (layers: string[]) => void
  onRemoveLayers: (layers: string[]) => void
}

// Todo: legacy component, should be refactored / simplified
const MapLegend: FunctionComponent<MapLegendProps> = ({
  activeMapLayers,
  title,
  onRemoveLayers,
  onAddLayers,
}) => {
  const { trackEvent } = useMatomo()
  const isEmbedView = useIsEmbedded()

  function trackLayerEnabled(mapLayer: ExtendedMapGroup) {
    // Sanitize the collection title to use it as action
    const action = mapLayer.title.toLowerCase().replace(/[: ][ ]*/g, '_')

    if (!mapLayer.legendItems || mapLayer.legendItems.length === 0) {
      trackEvent({
        category: 'kaartlaag',
        action,
        name: mapLayer.title,
      })
    } else {
      mapLayer.legendItems.forEach(({ title: legendItemTitle }) =>
        trackEvent({
          category: 'kaartlaag',
          action,
          name: legendItemTitle,
        }),
      )
    }
  }

  // Todo: This need to be refactored on redux level, so MapLayers and LegendItems will get a isVisible option there.
  const mapLayers = activeMapLayers

  const [collectionOpen, setCollectionOpen] = useState(isEmbedView ?? false)

  const allVisible = mapLayers.every(({ isVisible }) => isVisible)
  const someVisible = mapLayers.some(({ isVisible }) => isVisible)
  const collectionIndeterminate =
    mapLayers.some(
      ({ isVisible, legendItems }) =>
        !isVisible ||
        legendItems?.some(({ isVisible: legendVisibility }: any) => !legendVisibility),
    ) && someVisible

  const handleLayerToggle = (checked: boolean, mapLayer: ExtendedMapGroup) => {
    // Only track the event when the mapGroup gets checked
    if (checked) {
      trackLayerEnabled(mapLayer)
    }
  }

  // Check if some of the maplayers are opened on first render
  const hasOpenMapLayers = useMemo(
    () =>
      mapLayers.some(
        ({ isVisible, legendItems }) =>
          isVisible ||
          (isVisible &&
            legendItems?.some(({ isVisible: legendItemIsVisible }: any) => legendItemIsVisible)), // legenditems could be visible in another MapLegend
      ),
    [mapLayers],
  )

  // Open the maplegend if some of the maplayers are opened
  useEffect(() => {
    if (hasOpenMapLayers) setCollectionOpen(true)
  }, [hasOpenMapLayers])

  const addOrRemoveLayer = (
    checked: boolean,
    layers: ExtendedMapGroup[],
    onlyInvisible = false,
  ) => {
    const layersToFilter = onlyInvisible ? layers.filter(({ isVisible }) => !isVisible) : layers
    const filteredMapLayers = layersToFilter
      .map((mapLayer) => {
        if (mapLayer?.legendItems?.length && mapLayer?.legendItems?.every(({ id }) => id)) {
          return mapLayer?.legendItems?.map((legendItem) => legendItem.id ?? '')
        }
        return mapLayer.id
      })
      .flat()
      .filter((id) => id)

    if (checked) {
      if (onAddLayers) {
        onAddLayers(filteredMapLayers)
      }
    } else if (onRemoveLayers) {
      onRemoveLayers(filteredMapLayers)
    }
  }

  return (
    <>
      {(!isEmbedView || (isEmbedView && mapLayers.some(({ isEmbedded }) => isEmbedded))) && ( // Also display the collection title when maplayer is embedded
        <MapCollectionButton
          collectionIndeterminate={collectionIndeterminate}
          isOpen={collectionOpen}
          onClick={() => setCollectionOpen(!collectionOpen)}
          allVisible={allVisible}
          title={title}
        />
      )}
      {collectionOpen && (
        <MapCollectionList>
          {mapLayers &&
            mapLayers
              .filter(({ isEmbedded }) => (isEmbedView ? isEmbedded : true)) // Only include the embedded layers when in certain views
              .map((mapGroup) => {
                const layerIsChecked = mapGroup.isVisible
                const layerIsIndeterminate =
                  mapGroup.legendItems?.some(({ isVisible }: any) => !isVisible) && layerIsChecked

                const hasLegendItems = mapGroup?.legendItems && mapGroup.legendItems.length > 0

                if (!hasLegendItems) {
                  return (
                    <MapLayerWithLegendItem
                      key={mapGroup.id}
                      onAddLayers={onAddLayers}
                      onRemoveLayers={onRemoveLayers}
                      legendItem={mapGroup}
                    />
                  )
                }

                return (
                  <MapLayerButton
                    key={mapGroup.id}
                    mapGroup={mapGroup}
                    layerIsChecked={layerIsChecked}
                    layerIsIndeterminate={layerIsIndeterminate}
                    addOrRemoveLayer={addOrRemoveLayer}
                    isEmbedView={isEmbedView}
                    handleLayerToggle={handleLayerToggle}
                    onAddLayers={onAddLayers}
                    onRemoveLayers={onRemoveLayers}
                  />
                )
              })}
        </MapCollectionList>
      )}
    </>
  )
}

export default MapLegend
