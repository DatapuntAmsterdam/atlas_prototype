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
        aanduidingInOnderzoek: result.aanduiding_in_onderzoek,
        indicatieGeconstateerd: result.indicatie_geconstateerd,
        status: {
          code: result.status ? result.status.code : '',
          description: result.status ? result.status.omschrijving : ''
        },
        eigendomsverhouding: get(result.eigendomsverhouding, 'omschrijving'),
        gebruiksdoelen: (result.gebruiksdoelen || []).map((item) => ({
          ...item,
          description: item.omschrijving,
          descriptionPlus: item.omschrijving_plus
        })),
        use: {
          code: result.gebruik ? result.gebruik.code : '',
          description: result.gebruik ? result.gebruik.omschrijving : ''
        },
        label: result._display,
        location: result.location || wgs84Center,
        // The API even returns a value of `1` when the size is unknown
        size: result.oppervlakte > 1 ? result.oppervlakte : 0,
        type: get(result.type_woonobject, 'omschrijving')
      };
    });
}
