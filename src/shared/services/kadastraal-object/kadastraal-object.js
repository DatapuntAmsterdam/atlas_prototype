import get from 'lodash.get';

import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

import { getByUrl } from '../api/api';

export default function fetchByUri(uri) {
  return getByUrl(uri)
    .then((result) => {
      const geometryCenter = result.geometrie && getCenter(result.geometrie);
      const wgs84Center = geometryCenter ? rdToWgs84(geometryCenter) : null;

      return {
        ...result,
        kadastraleGemeente: {
          ...result.kadastrale_gemeente,
          label: get(result.kadastrale_gemeente, '_display'),
          name: get(result.kadastrale_gemeente, 'naam'),
          gemeente: get(result.kadastrale_gemeente, ['gemeente', 'gemeente'])
        },
        label: result._display,
        location: result.location || wgs84Center,
        objectNumber: result.objectnummer,
        size: result.grootte
      };
    });
}
