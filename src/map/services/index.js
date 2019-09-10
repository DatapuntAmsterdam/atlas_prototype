import mapLayers, { mapPanelLayers, mapBaseLayers } from './map-layers/map-layers.config'

const TIMEOUT = 100

export function getMapBaseLayers() {
  return new Promise(resolve => {
    setTimeout(() => resolve(mapBaseLayers), TIMEOUT)
  })
}

export function getMapLayers() {
  return new Promise(resolve => {
    setTimeout(() => resolve(mapLayers), TIMEOUT)
  })
}

export function getPanelLayers() {
  return new Promise(resolve => {
    setTimeout(() => resolve(mapPanelLayers), TIMEOUT)
  })
}
