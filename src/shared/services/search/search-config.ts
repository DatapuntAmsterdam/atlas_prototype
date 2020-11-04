import categoryLabels from '../../../map/services/map-search/category-labels'

export default {
  QUERY_ENDPOINTS: [
    {
      // The slug variable is used to identify this category in list.component.js
      ...categoryLabels.straatnamen,
      slug: 'straatnamen',
      uri: 'atlas/search/openbareruimte/',
      options: { subtype: 'weg' },
    },
    {
      ...categoryLabels.address,
      slug: 'adres',
      uri: 'atlas/search/adres/',
    },
    {
      // The slug variable is used to identify this category in list.component.js
      ...categoryLabels.openbareRuimte,
      slug: 'openbareruimte',
      uri: 'atlas/search/openbareruimte/',
      options: { subtype: 'not_weg' },
    },
    {
      ...categoryLabels.pand,
      slug: 'pand',
      uri: 'atlas/search/pand/',
    },
    {
      ...categoryLabels.vestiging,
      slug: 'vestiging',
      uri: 'handelsregister/search/vestiging/',
      authScope: 'HR/R',
    },
    {
      ...categoryLabels.mac,
      slug: 'mac',
      uri: 'handelsregister/search/maatschappelijkeactiviteit/',
      authScope: 'HR/R',
    },
    {
      ...categoryLabels.kadastraalObject,
      slug: 'object',
      uri: 'atlas/search/kadastraalobject/',
    },
    {
      ...categoryLabels.kadastraalSubject,
      slug: 'subject',
      uri: 'atlas/search/kadastraalsubject/',
      authScope: 'BRK/RS',
      specialAuthScope: 'BRK/RSN',
    },
    {
      ...categoryLabels.gebied,
      slug: 'gebied',
      uri: 'atlas/search/gebied/',
      subtypes: {
        grootstedelijk: 'grootstedelijk gebied',
        gebiedsgerichtwerken: 'gebiedsgericht werken',
      },
    },
    {
      ...categoryLabels.meetbout,
      slug: 'meetbout',
      uri: 'meetbouten/search/',
    },
    {
      ...categoryLabels.monument,
      slug: 'monument',
      uri: 'monumenten/search/',
    },
  ],
  COORDINATES_ENDPOINTS: [
    {
      uri: 'geosearch/nap/',
      radius: 25,
    },
    {
      uri: 'geosearch/bag/',
      radius: null,
    },
    {
      uri: 'geosearch/munitie/',
      radius: null,
    },
    {
      uri: 'geosearch/bominslag/',
      radius: 25,
    },
    {
      uri: 'geosearch/monumenten/',
      radius: 25,
      params: {
        monumenttype: 'isnot_pand_bouwblok',
      },
    },
    { uri: 'geosearch/biz/' },
    { uri: 'geosearch/winkgeb/' },
    { uri: 'geosearch/', params: { datasets: 'parkeervakken' } },
    { uri: 'geosearch/oplaadpunten/' },
    { uri: 'geosearch/bekendmakingen/', radius: 25 },
    { uri: 'geosearch/evenementen/', radius: 25 },
    { uri: 'geosearch/reclamebelasting/' },
  ],
  COORDINATES_HIERARCHY: [
    {
      // The slug variable is used to identify this category in list.component.js
      ...categoryLabels.openbareRuimte,
      slug: 'openbareruimte',
      features: ['bag/openbareruimte'],
    },
    {
      ...categoryLabels.pand,
      slug: 'pand',
      features: ['bag/pand'],
    },
    {
      ...categoryLabels.standplaats,
      slug: 'standplaats',
      features: ['bag/standplaats'],
    },
    {
      ...categoryLabels.ligplaats,
      slug: 'ligplaats',
      features: ['bag/ligplaats'],
    },
    {
      ...categoryLabels.kadastraalObject,
      slug: 'kadastraal-object',
      features: ['kadaster/kadastraal_object'],
    },
    {
      ...categoryLabels.gebied,
      slug: 'gebied',
      features: [
        'gebieden/stadsdeel',
        'gebieden/gebiedsgerichtwerken',
        'gebieden/buurtcombinatie',
        'gebieden/buurt',
        'gebieden/bouwblok',
        'gebieden/grootstedelijkgebied',
        'gebieden/unesco',
      ],
      subtypes: {
        grootstedelijkgebied: 'grootstedelijk gebied',
        gebiedsgerichtwerken: 'gebiedsgericht werken',
      },
    },
    {
      ...categoryLabels.meetbout,
      slug: 'meetbout',
      features: ['meetbouten/meetbout'],
    },
    {
      ...categoryLabels.napPeilmerk,
      slug: 'nap-peilmerk',
      features: ['nap/peilmerk'],
    },
    {
      ...categoryLabels.oplaadpunten,
      slug: 'oplaadpunten',
      features: ['vsd/oplaadpunten'],
    },
    {
      ...categoryLabels.explosief,
      slug: 'explosief',
      features: [
        'bommenkaart/bominslag',
        'bommenkaart/verdachtgebied',
        'bommenkaart/gevrijwaardgebied',
        'bommenkaart/uitgevoerdonderzoek',
      ],
      subtypes: {
        bominslag: 'inslag',
        gevrijwaardgebied: 'gevrijwaard gebied',
        uitgevoerdonderzoek: 'reeds uitgevoerd CE onderzoek',
        verdachtgebied: 'verdacht gebied',
      },
    },
    {
      ...categoryLabels.monument,
      slug: 'monument',
      features: ['monumenten/monument'],
    },
    {
      ...categoryLabels.bedrijfsinvesteringszone,
      slug: 'bedrijfsinvesteringszone',
      features: ['vsd/biz'],
    },
    {
      ...categoryLabels.vastgoed,
      slug: 'vastgoed',
      features: ['vsd/vastgoed'],
    },
    {
      ...categoryLabels.winkelgebied,
      slug: 'winkelgebieden',
      features: ['vsd/winkgeb'],
    },
    {
      ...categoryLabels.parkeervak,
      slug: 'parkeervakken',
      features: ['parkeervakken/parkeervakken'],
    },
    {
      ...categoryLabels.precarioShips,
      slug: 'precariobelasting-woonschepen',
      features: ['precariobelasting/woonschepen'],
    },
    {
      ...categoryLabels.precarioComVessels,
      slug: 'precariobelasting-bedrijfsvaartuigen',
      features: ['precariobelasting/bedrijfsvaartuigen'],
    },
    {
      ...categoryLabels.precarioPassVessels,
      slug: 'precariobelasting-passagiersvaartuigen',
      features: ['precariobelasting/passagiersvaartuigen'],
    },
    {
      ...categoryLabels.precarioTerraces,
      slug: 'precariobelasting-terrassen',
      features: ['precariobelasting/terrassen'],
    },
    {
      ...categoryLabels.tunnels,
      slug: 'tunnels-gevaarlijke-stoffen',
      features: ['hoofdroutes/tunnels_gevaarlijke_stoffen/'],
    },
    {
      ...categoryLabels.bekendmakingen,
      slug: 'bekendmakingen',
      features: ['vsd/bekendmakingen'],
    },
    {
      ...categoryLabels.evenementen,
      slug: 'evenementen',
      features: ['vsd/evenementen'],
    },
    {
      ...categoryLabels.reclamebelasting,
      slug: 'reclamebelasting',
      features: ['vsd/reclamebelasting'],
    },
  ],
}
