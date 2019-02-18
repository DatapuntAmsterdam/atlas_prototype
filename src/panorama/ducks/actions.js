// Actions creators
import {
  CLOSE_PANORAMA,
  FETCH_PANORAMA_ERROR,
  FETCH_PANORAMA_HOTSPOT_REQUEST,
  FETCH_PANORAMA_REQUEST,
  FETCH_PANORAMA_REQUEST_EXTERNAL,
  FETCH_PANORAMA_SUCCESS,
  SET_PANORAMA_LOCATION,
  SET_PANORAMA_ORIENTATION,
  SET_PANORAMA_TAGS
} from './constants';

export const fetchPanoramaRequest = (payload) => ({
  type: FETCH_PANORAMA_REQUEST,
  payload,
  meta: {
    tracking: true
  }
});

export const fetchPanoramaHotspotRequest = (payload) => ({
  type: FETCH_PANORAMA_HOTSPOT_REQUEST,
  payload,
  meta: {
    tracking: true
  }
});

export const setPanoramaTags = (payload) => ({
  type: SET_PANORAMA_TAGS,
  payload,
  meta: {
    tracking: payload
  }
});

export const fetchPanoramaRequestExternal = () => ({
  type: FETCH_PANORAMA_REQUEST_EXTERNAL,
  meta: {
    tracking: true
  }
});

export const fetchPanoramaSuccess = (payload) => ({
  type: FETCH_PANORAMA_SUCCESS,
  payload,
  meta: {
    tracking: payload
  }
});
export const fetchPanoramaError = (error) => ({
  type: FETCH_PANORAMA_ERROR,
  payload: error
});

export const closePanorama = () => ({
  type: CLOSE_PANORAMA
});
export const setPanoramaLocation = (payload) => ({
  type: SET_PANORAMA_LOCATION,
  payload,
  meta: {
    tracking: true
  }
});
export const setPanoramaOrientation = ({ heading, pitch, fov }) => ({
  type: SET_PANORAMA_ORIENTATION,
  payload: {
    heading,
    pitch,
    fov
  }
});
