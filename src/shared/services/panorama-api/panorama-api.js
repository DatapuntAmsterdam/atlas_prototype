import sharedConfig from '../shared-config/shared-config';
import { getByUrl } from '../api/api';
import getCenter from '../geo-json/geo-json';

export const PANORAMA_CONFIG = {
  PANORAMA_ENDPOINT_PREFIX: 'panorama/panoramas',
  PANORAMA_ENDPOINT_SUFFIX: 'adjacencies',
  SRID: 4326, // For latitude, longitude
  DEFAULT_FOV: 80,
  MAX_FOV: 90,
  MAX_RADIUS: 100,
  MAX_RESOLUTION: 12 * 1024,
  CAMERA_HEIGHT: 1.8,
  LEVEL_PROPERTIES_LIST: [
    {
      tileSize: 256,
      size: 256,
      fallbackOnly: true
    },
    {
      tileSize: 512,
      size: 512
    },
    {
      tileSize: 512,
      size: 1024
    },
    {
      tileSize: 512,
      size: 2048
    }
  ]
};

function imageData(response) {
  const panorama = response[0];
  const adjacencies = response.filter((adjacency) => adjacency !== response[0]);

  if (panorama.geometry !== null && typeof panorama.geometry === 'object') {
    const formattedGeometry = {
      coordinates: [
        panorama.geometry.coordinates[1],
        panorama.geometry.coordinates[0]
      ],
      type: panorama.geometry.type
    };

    const center = getCenter(formattedGeometry);

    const data = {
      date: new Date(panorama.timestamp),
      id: panorama.pano_id,
      hotspots: Array.isArray(adjacencies) ?
        adjacencies.map((adjacency) => ({
          id: adjacency.pano_id,
          heading: adjacency.heading,
          distance: adjacency.distance,
          year: adjacency.timestamp.substring(0, 4)
        })) : [],
      location: [center.x, center.y],
      image: {
        baseurl: panorama.cubic_img_baseurl,
        pattern: panorama.cubic_img_pattern,
        preview: panorama.cubic_img_baseurl
      }
    };

    return data;
  }

  return null;
}

function fetchPanorama(url, key) {
  const promise = new Promise((resolve, reject) => {
    getByUrl(url)
      .then((json) => json._embedded)
      .then((data) => {
        resolve(imageData(data[key]));
      })
      .catch((error) => reject(error));
  });

  return promise;
}

export function getImageDataByLocation(location, year) {
  const maxRadius = `radius=${PANORAMA_CONFIG.MAX_RADIUS}`;
  const locationRange = Array.isArray(location) ?
    `near=${location[0]},${location[1]}&srid=${PANORAMA_CONFIG.SRID}` : '';
  const yearRange = year ? `timestamp_before=${year}-12-21&timestamp_after=${year}-01-01` : '';

  const endpoint = `${PANORAMA_CONFIG.PANORAMA_ENDPOINT_PREFIX}?${maxRadius}&${locationRange}&${yearRange}`;

  return fetchPanorama(`${sharedConfig.API_ROOT}${endpoint}`, 'panoramas');
}

export function getImageDataById(id, year) {
  const yearRange = year ? `timestamp_before=${year}-12-21&timestamp_after=${year}-01-01` : 'newest_in_range=true';

  const endpoint = `${PANORAMA_CONFIG.PANORAMA_ENDPOINT_PREFIX}/${id}/${PANORAMA_CONFIG.PANORAMA_ENDPOINT_SUFFIX}?${yearRange}`;

  return fetchPanorama(`${sharedConfig.API_ROOT}${endpoint}`, 'adjacencies');
}
