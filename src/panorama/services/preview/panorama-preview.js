import SHARED_CONFIG from '../../../shared/services/shared-config/shared-config';

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

  return fetch(`${SHARED_CONFIG.API_ROOT}panorama/thumbnail/?${queryString}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 404) {
        return {};
      }
      throw new Error('Error requesting a panoramic view');
    })
    .then((response) => ({
      id: response.pano_id,
      heading: response.heading,
      url: response.url
    }));
}
