import getState from '../redux/get-state';
import SHARED_CONFIG from '../shared-config/shared-config';
import { encodeQueryParams } from '../query-string-parser/query-string-parser';
import { logout } from '../auth/auth';
// import { addToCache, getFromCache } from '../cache/cache';

export const getAccessToken = () => getState().user.accessToken;

export const generateParams = (data) => Object.entries(data).map((pair) => pair.map(encodeURIComponent).join('=')).join('&');

// Todo: DP-6393
const handleErrors = (response, reloadOnUnauthorized) => {
  if (response.status >= 400 && response.status <= 401 && reloadOnUnauthorized) {
    logout();
  }
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};


const handleCache = (response, key) => {
  if (sessionStorage.length > SHARED_CONFIG.CACHE_THRESHOLD) {
    Object.entries(sessionStorage).forEach(([itemKey]) => {
      if (itemKey.startsWith('http')) {
        const cache = JSON.parse(sessionStorage.getItem(itemKey));

        const now = new Date().getTime();
        let expiration = new Date(cache.timestamp);
        expiration = expiration.setMinutes(expiration.getMinutes()
          + SHARED_CONFIG.CACHE_EXPIRATION);

        if (now >= expiration) {
          sessionStorage.removeItem(itemKey);
        } else {
          sessionStorage.clear();
        }
      }
    });
  }

  sessionStorage.setItem(
    key,
    JSON.stringify({
      timestamp: new Date(),
      data: response
    })
  );

  return response;
};

const getFromCache = (key) => {
  const cache = JSON.parse(sessionStorage.getItem(key));
  if (!cache) return null;

  const now = new Date().getTime();
  let expiration = new Date(cache.timestamp);
  expiration = expiration.setMinutes(expiration.getMinutes() + SHARED_CONFIG.CACHE_EXPIRATION);

  if (now >= expiration) {
    sessionStorage.removeItem(key);
    return null;
  }

  return cache.data;
};

export const getWithToken = (url, params, cancel, token, reloadOnUnauthorized = false) => {
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

  // Retrieve from cache, otherwise execute API call
  const cachedResult = getFromCache(fullUrl);
  return cachedResult ||
    fetch(fullUrl, options)
      .then((response) => handleErrors(response, reloadOnUnauthorized))
      .then((response) => response.json())
      .then((response) => handleCache(response, fullUrl));
};

export const getByUrl = async (url, params, cancel, reloadOnUnauthorized) => {
  const token = getAccessToken();
  return Promise.resolve(getWithToken(url, params, cancel, token, reloadOnUnauthorized));
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
