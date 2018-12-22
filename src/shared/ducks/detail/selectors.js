import { createSelector } from 'reselect';
import { pageTypeToEndpoint } from '../../../store/redux-first-router';
import { REDUCER_KEY } from './constants';

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
