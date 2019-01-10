import SHARED_CONFIG from '../../../shared/services/shared-config/shared-config';

import { getByUrl } from '../../../shared/services/api/api';

export default function fetchPano(location) {
  const searchParams = {
    lat: location.latitude,
    lon: location.longitude,
    width: 438,
    radius: 180
  };

  const queryString = Object.keys(searchParams)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`)
    .join('&');

  return getByUrl(`${SHARED_CONFIG.API_ROOT}panorama/thumbnail/?${queryString}`)
    .then((response) => ({
      id: response.pano_id,
      heading: response.heading,
      url: response.url
    }));
}
