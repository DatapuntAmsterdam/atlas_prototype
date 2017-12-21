import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

import verblijfsobject from './adressen-verblijfsobject';

export default function fetchByUri(uri) {
  return fetch(uri)
    .then((response) => response.json())
    .then((result) => {
      return result.verblijfsobject ? verblijfsobject(result.verblijfsobject) : {
        ...result,
        label: result._display
      };
    });
}
