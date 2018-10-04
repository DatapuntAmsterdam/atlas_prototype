import getState from '../redux/get-state';
import SHARED_CONFIG from '../shared-config/shared-config';
import { encodeQueryParams } from '../query-string-parser/query-string-parser';

export const getAccessToken = () => getState().user.accessToken;

export const generateParams = (data) => Object.entries(data).map((pair) => pair.map(encodeURIComponent).join('=')).join('&');

const handleErrors = (response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};


// TODO: This function is not used yet because it is not finished
// cancel functionality doesn't work yet and is needed for the straatbeeld-api.js
export const getWithToken = (url, params, cancel, token) => {
  const headers = {};

  if (token) {
    headers.Authorization = SHARED_CONFIG.AUTH_HEADER_PREFIX + token;
  }

  const options = {
    method: 'GET',
    headers
  };

  if (cancel) {
    options.signal = cancel;
  }

  const fullUrl = `${url}${params ? `?${generateParams(params)}` : ''}`;
  return fetch(fullUrl, options)
    .then((response) => handleErrors(response))
    .then((response) => response.json());
};

export const getByUrl = async (url, params, cancel) => {
  const token = getAccessToken();
  return Promise.resolve(getWithToken(url, params, cancel, token));
};

export const createUrlWithToken = (url, token) => {
  const params = {};
  if (token) {
    params.access_token = token;
  }
  const queryStart = url.indexOf('?') !== -1 ? '&' : '?';
  const paramString = encodeQueryParams(params);
  const queryString = paramString ? queryStart + paramString : '';
  return url + queryString;
};
