const isObject = (value) => (value !== null && typeof value === 'object');

export const isStraatbeeldActive = (state) => Boolean(state.straatbeeld);
export const isMapOverlaysActive = (state) => Boolean(state.map.overlays.length);
export const isHomePageActive = (state) => Boolean(state.page && state.page.name === 'home');
export const isMapFullscreen = (state) => Boolean(state.ui.isMapFullscreen);
export const getGeosearchLocation = (state) => (
  state.search && state.search.location && state.search.location.toString()
);
export const getDetailEndpoint = (state) => (state.detail && state.detail.endpoint);

export const isMapPreviewPanelActive = (state) => {
  const geoSearchActive = (isObject(state.search)) &&
    (Array.isArray(state.search.location));

  return (state.ui.isMapFullscreen &&
    (geoSearchActive || isObject(state.detail)) &&
    !isObject(state.dataSelection));
};
