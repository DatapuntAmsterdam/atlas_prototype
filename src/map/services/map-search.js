import * as address from '../../shared/services/adressen/adressen-nummeraanduiding';
import * as monument from '../../shared/services/monument/monument';
import * as vestiging from '../../shared/services/vestiging/vestiging';

import apiUrl from '../../shared/services/api';

const endpoints = [
  { uri: 'geosearch/nap/', radius: 25 },
  { uri: 'geosearch/atlas/' },
  { uri: 'geosearch/munitie/' },
  { uri: 'geosearch/bominslag/', radius: 25 },
  { uri: 'geosearch/monumenten/',
    radius: 25,
    extra_params: {
      monumenttype: 'isnot_pand_bouwblok'
    }
  }
];

const categoryLabels = {
  address: 'Adres',
  explosief: 'Explosief',
  gebied: 'Gebied',
  gemeentelijkeBeperking: 'Gemeentelijke beperking',
  kadastraalObject: 'Kadastraal object',
  ligplaats: 'Ligplaats',
  meetbout: 'Meetbout',
  monument: 'Monument',
  napPijlmerk: 'NAP Peilmerk',
  openbareRuimte: 'Openbare ruimte',
  pand: 'Pand',
  standplaats: 'Standplaats',
  vestiging: 'Vestiging'
};

const categoryLabelsByType = {
  'bag/ligplaats': categoryLabels.ligplaats,
  'bag/openbareruimte': categoryLabels.openbareRuimte,
  'bag/pand': categoryLabels.pand,
  'bag/standplaats': categoryLabels.standplaats,
  'bommenkaart/bominslag': categoryLabels.explosief,
  'bommenkaart/gevrijwaardgebied': categoryLabels.explosief,
  'bommenkaart/uitgevoerdonderzoek': categoryLabels.explosief,
  'bommenkaart/verdachtgebied': categoryLabels.explosief,
  'gebieden/bouwblok': categoryLabels.gebied,
  'gebieden/buurt': categoryLabels.gebied,
  'gebieden/buurtcombinatie': categoryLabels.gebied,
  'gebieden/gebiedsgerichtwerken': categoryLabels.gebied,
  'gebieden/grootstedelijkgebied': categoryLabels.gebied,
  'gebieden/stadsdeel': categoryLabels.gebied,
  'gebieden/unesco': categoryLabels.gebied,
  'kadaster/kadastraal_object': categoryLabels.kadastraalObject,
  'meetbouten/meetbout': categoryLabels.meetbout,
  'monumenten/monument': categoryLabels.monument,
  'pand/address': categoryLabels.address,
  'pand/monument': categoryLabels.monument,
  'nap/peilmerk': categoryLabels.napPijlmerk,
  vestiging: categoryLabels.vestiging,
  'wkpb/beperking': categoryLabels.gemeentelijkeBeperking
};

const categoryTypeOrder = [
  'bag/openbareruimte',
  'bag/ligplaats',
  'bag/pand',
  'bag/standplaats',
  'pand/address',
  'vestiging',
  'pand/monument',
  'kadaster/kadastraal_object',
  'wkpb/beperking',
  'gebieden/bouwblok',
  'gebieden/buurt',
  'gebieden/buurtcombinatie',
  'gebieden/gebiedsgerichtwerken',
  'gebieden/grootstedelijkgebied',
  'gebieden/stadsdeel',
  'gebieden/unesco',
  'meetbouten/meetbout',
  'nap/peilmerk',
  'bommenkaart/bominslag',
  'bommenkaart/gevrijwaardgebied',
  'bommenkaart/uitgevoerdonderzoek',
  'bommenkaart/verdachtgebied',
  'monumenten/monument'
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

const fetchRelatedForUser = (user) => (data) => {
  const item = data.features.find((feature) => relatedResourcesByType[feature.properties.type]);

  if (!item) {
    return data.features;
  }

  const resources = relatedResourcesByType[item.properties.type];
  const requests = resources.map((resource) => (
    (resource.authScope &&
      (!user.authenticated || !user.scopes.includes(resource.authScope))
    ) ? [] :
      resource.fetch(item.properties.id)
        .then((results) => results
          .map((result) => ({
            properties: {
              uri: result._links.self.href,
              display: result._display,
              type: resource.type
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

    const queryString = Object.keys(searchParams)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`)
      .join('&');

    return fetch(`${apiUrl}${endpoint.uri}?${queryString}`)
      .then((response) => response.json())
      .then(fetchRelatedForUser(user))
      .then((features) => features
        .map((feature) => ({
          uri: feature.properties.uri,
          label: feature.properties.display,
          categoryLabel: categoryLabelsByType[feature.properties.type],
          type: feature.properties.type
        }))
      );
  });

  return Promise.all(allRequests)
    .then((results) => results
      .reduce((accumulator, subResults) => accumulator.concat(subResults)))
    .then((results) => [...results]
      .sort((a, b) => {
        const indexA = categoryTypeOrder.indexOf(a.type);
        const indexB = categoryTypeOrder.indexOf(b.type);
        return indexA < indexB ? -1 :
          (indexA > indexB ? 1 : 0);
      })
    );
}
