import {
  dataSelectionType,
  detailPointType,
  geoSearchType,
  markerPointType,
  panoramaOrientationType,
  panoramaPersonType,
} from '../../../ducks/map/constants'

const markerConfig = {
  [geoSearchType]: { requestFocus: true },
  [dataSelectionType]: {},
  [detailPointType]: { requestFocus: true },
  [panoramaPersonType]: { requestFocus: true },
  [panoramaOrientationType]: { requestFocus: true },
  [markerPointType]: {},
}
export default markerConfig
