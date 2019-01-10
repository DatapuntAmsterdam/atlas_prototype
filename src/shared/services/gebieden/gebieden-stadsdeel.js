import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';
import { getByUrl } from '../api/api';
import SHARED_CONFIG from '../shared-config/shared-config';

function fetchStadsdeel(uri) {
  return getByUrl(uri)
    .then((result) => {
      const geometryCenter = result.geometrie && getCenter(result.geometrie);
      const wgs84Center = geometryCenter ? rdToWgs84(geometryCenter) : null;

      return {
        ...result,
        label: result.naam,
        location: result.location || wgs84Center
      };
    });
}

export const fetchGrexStadsdeel = async (stadsdeelCode) => {
  const url = `${SHARED_CONFIG.API_ROOT}grondexploitatie/stadsdeel/${stadsdeelCode}/`;
  const grexStadsdeel = await getByUrl(url);
  return grexStadsdeel;
};

const fetchByUri = async (uri, user) => {
  const stadsdeel = await fetchStadsdeel(uri);
  if (user && user.scopes.includes('GREX/R')) {
    const grex = await fetchGrexStadsdeel(stadsdeel.code);
    return {
      ...stadsdeel,
      grex: {
        totalIncomeLabel: grex.totaal_baten_display,
        totalExpenseLabel: grex.totaal_kosten_display,
        totalResultLabel: grex.totaal_resultaat_display
      }
    };
  }
  return stadsdeel;
};

export default fetchByUri;
