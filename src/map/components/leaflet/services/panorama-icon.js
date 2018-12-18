import { Icon } from 'leaflet';

import ICON_CONFIG from './icon-config.constant';

export const panoramaPersonIcon = () => new Icon({
  ...ICON_CONFIG.PANORAMA_PERSON,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  className: 'panorama_person'
});

export const panoramaOrientationIcon = () => new Icon({
  ...ICON_CONFIG.PANORAMA_ORIENTATION,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  className: 'panorama_orientation'
});
