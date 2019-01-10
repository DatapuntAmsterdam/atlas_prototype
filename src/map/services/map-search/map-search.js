import * as address from '../../../shared/services/adressen/adressen-nummeraanduiding';
import * as monument from '../../../shared/services/monument/monument';
import * as vestiging from '../../../shared/services/vestiging/vestiging';

import SHARED_CONFIG from '../../../shared/services/shared-config/shared-config';

import transformResultByType from './transform-result-by-type';

import { createMapSearchResultsModel } from '../../services/map-search-results/map-search-results';
import { getByUrl } from '../../../shared/services/api/api';

const endpoints = [
  { uri: 'geosearch/nap/', radius: 25 },
  { uri: 'geosearch/atlas/' },
  { uri: 'geosearch/munitie/' },
  { uri: 'geosearch/bominslag/', radius: 25 },
  {
    uri: 'geosearch/monumenten/',
    radius: 25,
    extra_params: {
      monumenttype: 'isnot_pand_bouwblok'
    }
  },
  { uri: 'geosearch/grondexploitatie/' },
  { uri: 'geosearch/biz/' }
];

const relatedResourcesByType = {
  'bag/ligplaats': [
    {
      fetch: (ligplaatsId) => address
        .fetchHoofdadresByLigplaatsId(ligplaatsId)
        .then((result) => vestiging.fetchByAddressId(result.id)),
      type: 'vestiging',
      authScope: 'HR/R'
    }
  ],
  'bag/pand': [
    {
      fetch: address.fetchByPandId,
      type: 'pand/address'
    }, {
      fetch: vestiging.fetchByPandId,
      type: 'vestiging',
      authScope: 'HR/R'
    }, {
      fetch: monument.fetchByPandId,
      type: 'pand/monument'
    }
  ],
  'bag/standplaats': [
    {
      fetch: (standplaatsId) => address
        .fetchHoofdadresByStandplaatsId(standplaatsId)
        .then((result) => vestiging.fetchByAddressId(result.id)),
      type: 'vestiging',
      authScope: 'HR/R'
    }
  ]
};

export const fetchRelatedForUser = (user) => (data) => {
  const item = data.features.find((feature) => relatedResourcesByType[feature.properties.type]);
  if (!item) {
    return data.features;
  }

  const resources = relatedResourcesByType[item.properties.type];
  const requests = resources.map((resource) => (
    (resource.authScope &&
      (!user.authenticated || !user.scopes.includes(resource.authScope))
    ) ? []
      : resource.fetch(item.properties.id)
        .then((results) => results
          .map((result) => ({
            ...result,
            properties: {
              uri: result._links.self.href,
              display: result._display,
              type: resource.type,
              parent: item.properties.type
            }
          }))
        )
  ));

  return Promise.all(requests)
    .then((results) => results
        .reduce((accumulator, subResults) => accumulator.concat(subResults),
          data.features));
};

export default function search(location, user) {
  const allRequests = endpoints.map((endpoint) => {
    const searchParams = {
      ...endpoint.extra_params,
      lat: location.latitude,
      lon: location.longitude,
      radius: endpoint.radius || 0
    };

    const queryString = Object
      .keys(searchParams)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`)
      .join('&');

    return getByUrl(`${SHARED_CONFIG.API_ROOT}${endpoint.uri}?${queryString}`)
      .then(fetchRelatedForUser(user))
      .then((features) => features.map((feature) => transformResultByType(feature)));
  });
  return Promise.all(allRequests
    .map((p) => p
      .then((result) => Promise.resolve(result))
      .catch(() => Promise.resolve([]))))  // ignore the failing calls
    .then((results) => [].concat.apply([], [...results]))
    .then((results) => createMapSearchResultsModel(results));
}
