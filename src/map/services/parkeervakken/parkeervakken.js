import apiUrl from '../../../shared/services/api';

export const selectParkeervakByLatLng = (latLng) =>
  fetch(`${apiUrl}parkeervakken/geosearch/?lat=${latLng[0]}&lon=${latLng[1]}`)
  .then((response) => response.json())
  .catch((error) => error);


export const getSelectedParkeervakkenByIds = (ids) =>
  fetch(`${apiUrl}parkeervakken/geoselection?ids=${ids}`)
  .then((response) => response.json())
  .catch((error) => error);
