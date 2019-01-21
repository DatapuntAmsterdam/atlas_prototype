import { createSelector } from 'reselect';
import { REDUCER_KEY } from './constants';
import { pageTypeToEndpoint } from '../../../map/services/map-detail';

export const getDetail = (state) => state[REDUCER_KEY];
export const getDetailView = (state) => state[REDUCER_KEY].view;
export const getDetailGeometry = createSelector(getDetail, (detail) => detail && detail.geometry);
export const getDetailEndpoint = createSelector(getDetail, (detail) => {
  if (detail && detail.type && detail.subtype && detail.id) {
    return pageTypeToEndpoint(detail.type, detail.subtype, detail.id);
  }
  return undefined;
});
export const getDetailDisplay = createSelector(getDetail, (detail) => detail && detail.display);
export const isDetailLoading = createSelector(getDetail, (detail) => detail && detail.isLoading);
export const getView = createSelector(getDetail, (detail) => detail && detail.view);
