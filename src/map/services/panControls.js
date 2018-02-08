import ACTIONS from '../../shared/actions';

export const getCurrentLocation = (leafletMap) => {
  const center = leafletMap.getCenter();

  return [center.lat, center.lng];
};

export const panTo = (leafletMap, location) => {
  // Prevent infinite loop; the 'moveend' event triggers panTo,
  // and panning always triggers a 'moveend' event.
  const currentLocation = getCurrentLocation(leafletMap);
  if (
    !currentLocation ||
    location[0] !== currentLocation[0] ||
    location[1] !== currentLocation[1]
  ) {
    // location != currentLocation
    leafletMap.panTo(location, { animate: false });
  }
};

export const initialize = (store, leafletMap) => {
  leafletMap.on('dragend', () => {
    store.dispatch({
      type: ACTIONS.MAP_PAN,
      payload: getCurrentLocation(leafletMap)
    });
  });
};
