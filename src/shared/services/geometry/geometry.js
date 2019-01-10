import isObject from '../../services/is-object';
import BOUNDING_BOX from '../../../map/services/bounding-box.constant';
import * as crsConverter from '../coordinate-reference-system/crs-converter';


export const isVestigingAmsterdam = (data) => {
  let isVestiging = false;
  const southWestWgs84Coordinates = {
    latitude: BOUNDING_BOX.COORDINATES.southWest[0],
    longitude: BOUNDING_BOX.COORDINATES.southWest[1]
  };
  const northEastWgs84Coordinates = {
    latitude: BOUNDING_BOX.COORDINATES.northEast[0],
    longitude: BOUNDING_BOX.COORDINATES.northEast[1]
  };
  const southWest = crsConverter.wgs84ToRd(southWestWgs84Coordinates);
  const northEast = crsConverter.wgs84ToRd(northEastWgs84Coordinates);

  if (isObject(data.bezoekadres) &&
          isObject(data.bezoekadres.geometrie) &&
          data.bezoekadres.geometrie.coordinates[0] > southWest.x &&
          data.bezoekadres.geometrie.coordinates[0] < northEast.x &&
          data.bezoekadres.geometrie.coordinates[1] > southWest.y &&
          data.bezoekadres.geometrie.coordinates[1] < northEast.y) {
    isVestiging = true;
  }
  return isVestiging;
};


export const getGeometry = (data) => {
  if (isObject(data.geometrie)) {
    return data.geometrie;
  } else if (isVestigingAmsterdam(data)) {
    return data.bezoekadres.geometrie;
    // } else if (isAPerceel(url, data)) {
    //   return getGPerceel(data).then(getGeometry);
    // } else if (isNummeraanduiding(url)) {
    //   return getAdresseerbaarObject(data).then(getGeometry);
  } else if (isObject(data.monumentcoordinaten)) {
    return data.monumentcoordinaten;
  }
  return null;
};

export default getGeometry;
