const geoJsonConfig = {
  dataSelection: {
    style: {
      color: '#ec0000',
      fillOpacity: 0.33,
      weight: 1,
    },
  },
  dataSelectionAlternate: {
    style: {
      color: '#ec0000',
      dashArray: '3 6',
      fillOpacity: 0.17,
      weight: 2,
    },
  },
  dataSelectionBounds: {
    style: {
      color: '#ec0000',
      fillOpacity: 0,
      opacity: 0,
      weight: 1,
    },
    requestFocus: true,
  },
}

export default geoJsonConfig
export const dataSelectionType = 'dataSelection'
export const dataSelectionBounds = 'dataSelectionBounds'
