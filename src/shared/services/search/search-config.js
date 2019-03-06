export default {
  QUERY_ENDPOINTS: [
    {
      // The slug variable is used to identify this category in list.component.js
      slug: 'straatnamen',
      label_singular: 'Straatnamen',
      label_plural: 'Straatnamen',
      uri: 'atlas/search/openbareruimte/',
      options: { subtype: 'weg' }
    }, {
      // The slug variable is used to identify this category in list.component.js
      slug: 'adres',
      label_singular: 'Adres',
      label_plural: 'Adressen',
      uri: 'atlas/search/adres/'
    }, {
      // The slug variable is used to identify this category in list.component.js
      slug: 'openbareruimte',
      label_singular: 'Openbare ruimte',
      label_plural: 'Openbare ruimtes',
      uri: 'atlas/search/openbareruimte/',
      options: { subtype: 'not_weg' }
    }, {
      slug: 'pand',
      label_singular: 'Pand',
      label_plural: 'Panden',
      uri: 'atlas/search/pand/'
    }, {
      slug: 'vestiging',
      label_singular: 'Vestiging',
      label_plural: 'Vestigingen',
      uri: 'handelsregister/search/vestiging/',
      authScope: 'HR/R'
    }, {
      slug: 'mac',
      label_singular: 'Maatschappelijke activiteit',
      label_plural: 'Maatschappelijke activiteiten',
      uri: 'handelsregister/search/maatschappelijkeactiviteit/',
      authScope: 'HR/R'
    }, {
      slug: 'object',
      label_singular: 'Kadastraal object',
      label_plural: 'Kadastrale objecten',
      uri: 'atlas/search/kadastraalobject/'
    }, {
      slug: 'subject',
      label_singular: 'Kadastraal subject',
      label_plural: 'Kadastrale subjecten',
      uri: 'atlas/search/kadastraalsubject/',
      authScope: 'BRK/RS',
      specialAuthScope: 'BRK/RSN'
    }, {
      // The slug variable is used to identify this category in list.component.js
      slug: 'gebied',
      label_singular: 'Gebied',
      label_plural: 'Gebieden',
      uri: 'atlas/search/gebied/',
      subtypes: {
        grootstedelijk: 'grootstedelijk gebied',
        gebiedsgerichtwerken: 'gebiedsgericht werken'
      }
    }, {
      slug: 'meetbout',
      label_singular: 'Meetbout',
      label_plural: 'Meetbouten',
      uri: 'meetbouten/search/'
    }, {
      slug: 'monument',
      label_singular: 'Monument',
      label_plural: 'Monumenten',
      uri: 'monumenten/search/'
    }
  ],
  COORDINATES_ENDPOINTS: [
    {
      uri: 'geosearch/nap/',
      radius: 25
    }, {
      uri: 'geosearch/bag/',
      radius: null
    }, {
      uri: 'geosearch/munitie/',
      radius: null
    }, {
      uri: 'geosearch/bominslag/',
      radius: 25
    }, {
      uri: 'geosearch/monumenten/',
      radius: 25,
      extra_params: {
        monumenttype: 'isnot_pand_bouwblok'
      }
    },
    { uri: 'geosearch/grondexploitatie/' },
    { uri: 'geosearch/biz/' },
    { uri: 'geosearch/winkgeb/' },
    { uri: 'parkeervakken/geosearch/' },
    { uri: 'geosearch/oplaadpunten/' }
  ],
  COORDINATES_HIERARCHY: [
    {
      // The slug variable is used to identify this category in list.component.js
      slug: 'openbareruimte',
      label_singular: 'Openbare ruimte',
      label_plural: 'Openbare ruimtes',
      features: ['bag/openbareruimte']
    }, {
      slug: 'pand',
      label_singular: 'Pand',
      label_plural: 'Panden',
      features: ['bag/pand']
    }, {
      slug: 'standplaats',
      label_singular: 'Adres',
      label_plural: 'Adressen',
      features: ['bag/standplaats']
    }, {
      slug: 'ligplaats',
      label_singular: 'Adres',
      label_plural: 'Adressen',
      features: ['bag/ligplaats']
    }, {
      slug: 'kadastraal-object',
      label_singular: 'Kadastraal object',
      label_plural: 'Kadastrale objecten',
      features: ['kadaster/kadastraal_object']
    }, {
      slug: 'gemeentelijke-beperking',
      label_singular: 'Gemeentelijke beperking',
      label_plural: 'Gemeentelijke beperkingen',
      features: ['wkpb/beperking']
    }, {
      slug: 'gebied',
      label_singular: 'Gebied',
      label_plural: 'Gebieden',
      features: [
        'gebieden/stadsdeel',
        'gebieden/gebiedsgerichtwerken',
        'gebieden/buurtcombinatie',
        'gebieden/buurt',
        'gebieden/bouwblok',
        'gebieden/grootstedelijkgebied',
        'gebieden/unesco'
      ],
      subtypes: {
        grootstedelijkgebied: 'grootstedelijk gebied',
        gebiedsgerichtwerken: 'gebiedsgericht werken'
      }
    }, {
      slug: 'meetbout',
      label_singular: 'Meetbout',
      label_plural: 'Meetbouten',
      features: ['meetbouten/meetbout']
    }, {
      slug: 'nap-peilmerk',
      label_singular: 'NAP Peilmerk',
      label_plural: 'NAP Peilmerken',
      features: ['nap/peilmerk']
    }, {
      slug: 'oplaadpunten',
      label_singular: 'Oplaadpunt',
      label_plural: 'Oplaadpunten',
      features: ['vsd/oplaadpunten']
    }, {
      slug: 'explosief',
      label_singular: 'Explosief',
      label_plural: 'Explosieven',
      features: [
        'bommenkaart/bominslag',
        'bommenkaart/verdachtgebied',
        'bommenkaart/gevrijwaardgebied',
        'bommenkaart/uitgevoerdonderzoek'
      ],
      subtypes: {
        bominslag: 'inslag',
        gevrijwaardgebied: 'gevrijwaard gebied',
        uitgevoerdonderzoek: 'reeds uitgevoerd CE onderzoek',
        verdachtgebied: 'verdacht gebied'
      }
    }, {
      slug: 'monument',
      label_singular: 'Monument',
      label_plural: 'Monumenten',
      features: [
        'monumenten/monument'
      ]
    }, {
      slug: 'grondexploitatie',
      label_singular: 'Grondexploitatie',
      label_plural: 'Grondexploitaties',
      features: ['grex/grondexploitatie']
    }, {
      slug: 'bedrijfsinvesteringszone',
      label_singular: 'Bedrijfsinvesteringszone',
      label_plural: 'Bedrijfsinvesteringszones',
      features: ['vsd/biz']
    }, {
      slug: 'winkelgebieden',
      label_singular: 'Winkelgebied',
      label_plural: 'Winkelgebieden',
      features: ['vsd/winkgeb']
    }, {
      slug: 'parkeervakken',
      label_singular: 'Parkeervak',
      label_plural: 'Parkeervakken',
      features: ['parkeervakken/parkeervakken']
    }
  ]
};
