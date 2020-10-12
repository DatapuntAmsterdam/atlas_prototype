/* eslint-disable no-underscore-dangle,camelcase */
import { LatLngLiteral } from 'leaflet'
import NotificationLevel from '../../app/models/notification'
import config, { DataSelectionType } from '../../app/pages/MapPage/config'
import { getListFromApi } from '../../app/pages/MapPage/detail/api'
import buildDetailUrl from '../../app/pages/MapPage/detail/buildDetailUrl'
import { InfoBoxProps } from '../../app/pages/MapPage/detail/DetailInfoBox'
import formatDate from '../../app/utils/formatDate'
import getFileName from '../../app/utils/getFileName'
import GLOSSARY, { Definition } from '../../detail/services/glossary.constant'
import environment from '../../environment'
import { DEFAULT_LOCALE } from '../../shared/config/locale.config'
import { fetchWithToken } from '../../shared/services/api/api'
import PARAMETERS from '../../store/parameters'
import { getDetailPageData } from '../../store/redux-first-router/actions'
import {
  DetailResult,
  DetailResultItem,
  DetailResultItemDefinitionListEntry,
  DetailResultItemLinkList,
  DetailResultItemPaginatedData,
  DetailResultItemType,
  DetailResultNotification,
} from '../types/details'
import adressenNummeraanduiding from './adressen-nummeraanduiding/adressen-nummeraanduiding'
import { fetchDetailData, getServiceDefinition } from './map'
import categoryLabels from './map-search/category-labels'
import {
  adressenPand,
  adressenVerblijfsobject,
  bekendmakingen,
  evenementen,
  explosieven,
  formatSquareMetre,
  grexProject,
  kadastraalObject,
  meetbout,
  monument,
  napPeilmerk,
  oplaadpunten,
  parkeervak,
  parkeerzones,
  reclamebelasting,
  vastgoed,
  winkelgebied,
} from './normalize/normalize'
import vestiging from './vestiging/vestiging'

export const endpointTypes = {
  adressenLigplaats: 'bag/v1.1/ligplaats/',
  adressenNummeraanduiding: 'bag/v1.1/nummeraanduiding/',
  adressenOpenbareRuimte: 'bag/v1.1/openbareruimte/',
  adressenPand: 'bag/v1.1/pand/',
  adressenStandplaats: 'bag/v1.1/standplaats/',
  adressenVerblijfsobject: 'bag/v1.1/verblijfsobject/',
  bedrijfsinvesteringszone: 'vsd/biz/',
  bekendmakingen: 'vsd/bekendmakingen/',
  bouwstroompunten: 'bouwstroompunten/bouwstroompunten',
  constructionFiles: 'iiif-metadata/bouwdossier/',
  covid_19: 'v1/covid_19',
  evenementen: 'vsd/evenementen/',
  explosievenGevrijwaardGebied: 'milieuthemas/explosieven/gevrijwaardgebied/',
  explosievenInslag: 'milieuthemas/explosieven/inslagen/',
  explosievenUitgevoerdOnderzoek: 'milieuthemas/explosieven/uitgevoerdonderzoek/',
  explosievenVerdachtGebied: 'milieuthemas/explosieven/verdachtgebied/',
  fietspaaltjes: 'fietspaaltjes/fietspaaltjes',
  gebiedenBouwblok: 'gebieden/bouwblok/',
  gebiedenBuurt: 'gebieden/buurt/',
  gebiedenGebiedsgerichtWerken: 'gebieden/gebiedsgerichtwerken/',
  gebiedenGrootstedelijk: 'gebieden/grootstedelijkgebied/',
  gebiedenStadsdeel: 'gebieden/stadsdeel/',
  gebiedenUnesco: 'gebieden/unesco/',
  gebiedenWijk: 'gebieden/buurtcombinatie/',
  grondexploitaties: 'grex/projecten',
  kadastraalObject: 'brk/object/',
  kadastraalSubject: 'brk/subject/',
  maatschappelijkeActiviteiten: 'handelsregister/maatschappelijkeactiviteit/',
  meetbout: 'meetbouten/meetbout/',
  monument: 'monumenten/monumenten/',
  monumentComplex: 'monumenten/complexen',
  napPeilmerk: 'nap/peilmerk/',
  oplaadpunten: 'vsd/oplaadpunten/',
  parkeervak: 'parkeervakken/parkeervakken/',
  parkeerzones: 'vsd/parkeerzones/',
  parkeerzonesUitz: 'vsd/parkeerzones_uitz/',
  precarioShips: 'precariobelasting/woonschepen',
  precarioComVessels: 'precariobelasting/bedrijfsvaartuigen',
  precarioPassVessels: 'precariobelasting/passagiersvaartuigen',
  precarioTerraces: 'precariobelasting/terrassen',
  reclamebelasting: 'vsd/reclamebelasting/',
  tunnels: 'hoofdroutes/tunnels_gevaarlijke_stoffen',
  vastgoed: 'vsd/vastgoed',
  vestiging: 'handelsregister/vestiging/',
  winkelgebied: 'vsd/winkgeb',
  wkpbBeperking: 'wkpb/beperking',
  wkpbUitreksel: 'brk/object-wkpb',
  woonplaats: 'bag/v1.1/woonplaats',
}

export interface ServiceDefinition {
  // TODO: 'type' should be required once all service definitions have one.
  type?: string
  // TODO: 'endpoint' should be required once all service definitions have one.
  endpoint?: string
  authScope?: string
  normalization?: (result: any) => any | Promise<any>
  mapDetail: (result: any, location: LatLngLiteral) => DetailResult | Promise<DetailResult>
}

function buildMetaData(
  result: any,
  metadata?: Array<keyof typeof GLOSSARY.META>,
): DetailResultItemDefinitionListEntry[] {
  if (!metadata) {
    return []
  }

  return metadata
    .map((metaKey) => {
      const meta = GLOSSARY.META[metaKey]

      return {
        term: meta.label,
        description: 'filter' in meta ? meta.filter(result[metaKey]) : result[metaKey],
      }
    })
    .filter(({ description }) => description)
}

const getInfoBox = ({ description, url, plural }: Partial<Definition>): InfoBoxProps => ({
  description,
  url,
  plural,
})

const getPaginatedListBlock = (
  apiUrl: string,
  { description, url, plural }: Definition,
  settings?: {
    gridArea?: string
    pageSize?: number
    skipRouter?: boolean
  },
): DetailResultItemPaginatedData => ({
  type: DetailResultItemType.PaginatedData,
  getData: getListFromApi(apiUrl),
  pageSize: settings?.pageSize || 10,
  gridArea: settings?.gridArea || 'auto / 1 / auto / 3',
  toView: (data: any) => ({
    title: plural,
    type: DetailResultItemType.LinkList,
    skipRouter: settings?.skipRouter || false,
    links: data,
    infoBox: getInfoBox({ description, url, plural }),
  }),
})

const getLocationDefinitionListBlock = (result: any, gridArea: string): DetailResultItem => {
  const buurt = {
    config: GLOSSARY.DEFINITIONS.BUURT,
    value: result.buurt || result._buurt,
  }
  const wijk = {
    config: GLOSSARY.DEFINITIONS.BUURTCOMBINATIE,
    value: result.buurtcombinatie || result._buurtcombinatie,
  }
  const stadsdeel = {
    config: GLOSSARY.DEFINITIONS.STADSDEEL,
    value: result.stadsdeel || result._stadsdeel,
  }

  const gebiedsgerichtwerken = {
    config: GLOSSARY.DEFINITIONS.GEBIEDSGERICHTWERKEN,
    value: result.gebiedsgerichtwerken || result._gebiedsgerichtwerken,
  }

  const items = [stadsdeel, wijk, buurt, gebiedsgerichtwerken].filter((item) => item.value)

  return {
    title: 'Ligt in',
    type: DetailResultItemType.DefinitionList,
    entries: items.map(({ config: { singular }, value }) => ({
      term: singular,
      description: value._display,
      link: buildDetailUrl(getDetailPageData(value._links.self.href)),
    })),
    gridArea,
  }
}

const getShowInTableBlock = (filters: {
  key: string
  value: string
}): DetailResultItemLinkList[] => [
  {
    type: DetailResultItemType.LinkList,
    title: GLOSSARY.DEFINITIONS.NUMMERAANDUIDING.plural,
    infoBox: getInfoBox({
      description: GLOSSARY.DEFINITIONS.NUMMERAANDUIDING.description,
      url: GLOSSARY.DEFINITIONS.NUMMERAANDUIDING.url,
      plural: GLOSSARY.DEFINITIONS.NUMMERAANDUIDING.plural,
    }),
    links: [
      {
        to: {
          pathname: config[DataSelectionType.BAG].path,
          search: `${PARAMETERS.VIEW}=volledig&${PARAMETERS.FILTERS}={"${filters.key}":"${filters.value}"}`,
        },
        title: 'In tabel weergeven',
      },
    ],
  },
  {
    type: DetailResultItemType.LinkList,
    title: GLOSSARY.DEFINITIONS.VESTIGING.plural,
    infoBox: getInfoBox({
      description: GLOSSARY.DEFINITIONS.VESTIGING.description,
      url: GLOSSARY.DEFINITIONS.VESTIGING.url,
      plural: GLOSSARY.DEFINITIONS.VESTIGING.plural,
    }),
    links: [
      {
        to: {
          pathname: config[DataSelectionType.BAG].path,
          search: `${PARAMETERS.VIEW}=volledig&${PARAMETERS.FILTERS}={"${filters.key}":"${filters.value}"}`,
        },
        title: 'In tabel weergeven',
      },
    ],
  },
  {
    type: DetailResultItemType.LinkList,
    title: GLOSSARY.DEFINITIONS.OBJECT.plural,
    infoBox: getInfoBox({
      description: GLOSSARY.DEFINITIONS.OBJECT.description,
      url: GLOSSARY.DEFINITIONS.OBJECT.url,
      plural: GLOSSARY.DEFINITIONS.OBJECT.plural,
    }),
    links: [
      {
        to: {
          pathname: config[DataSelectionType.BAG].path,
          search: `${PARAMETERS.VIEW}=volledig&${PARAMETERS.FILTERS}={"${filters.key}":"${filters.value}"}`,
        },
        title: 'In tabel weergeven',
      },
    ],
  },
]

const gebiedInBeeldBlock: DetailResultItemLinkList = {
  type: DetailResultItemType.LinkList,
  title: 'Gebied in beeld',
  links: [
    {
      url: 'https://gebiedinbeeld.amsterdam.nl/#/dashboard',
      title: 'Ga naar gebied in beeld',
    },
  ],
}

const getMainMetaBlock = (result: any, definition: Definition): InfoBoxProps => ({
  ...getInfoBox(definition),
  meta: buildMetaData(result, definition.meta),
})

const servicesByEndpointType: { [type: string]: ServiceDefinition } = {
  [endpointTypes.adressenLigplaats]: {
    mapDetail: (result) => {
      const notifications: DetailResultNotification[] = []

      if (result.indicatie_geconstateerd) {
        notifications.push({
          value: 'Indicatie geconstateerd',
          level: NotificationLevel.Error,
        })
      }

      if (result.aanduiding_in_onderzoek) {
        notifications.push({
          value: 'In onderzoek',
          level: NotificationLevel.Error,
        })
      }

      return {
        notifications,
        title: 'Adres (ligplaats)',
        subTitle: result._display,
        items: [
          {
            type: DetailResultItemType.Default,
            label: 'Indicatie geconstateerd',
            value: result.indicatie_geconstateerd ? 'Ja' : 'Nee',
          },
          {
            type: DetailResultItemType.Default,
            label: 'Aanduiding in onderzoek',
            value: result.aanduiding_in_onderzoek ? 'Ja' : 'Nee',
          },
        ],
      }
    },
  },
  [endpointTypes.adressenNummeraanduiding]: {
    normalization: adressenNummeraanduiding,
    mapDetail: (result) => {
      const notifications: DetailResultNotification[] = []

      if (result.verblijfsobject && result.verblijfsobject.statusLevel) {
        notifications.push({
          value: `Status: ${result.verblijfsobject.status}`,
          level: NotificationLevel.Attention,
        })
      }

      if (result.isNevenadres) {
        notifications.push({
          value: 'Dit is een nevenadres',
          level: NotificationLevel.Attention,
        })
      }

      if (result.indicatie_geconstateerd) {
        notifications.push({
          value: 'Indicatie geconstateerd',
          level: NotificationLevel.Error,
        })
      }

      if (result.aanduiding_in_onderzoek) {
        notifications.push({
          value: 'In onderzoek',
          level: NotificationLevel.Error,
        })
      }

      return {
        notifications,
        title: 'Adres (verblijfsobject)',
        subTitle: result._display,
        items: [
          {
            type: DetailResultItemType.Default,
            title: 'Gebruiksdoel',
            value: result.verblijfsobject ? result.verblijfsobject.gebruiksdoelen : false,
          },
          {
            type: DetailResultItemType.Default,
            title: 'Soort object (feitelijk gebruik)',
            value: result.verblijfsobject ? result.verblijfsobject.gebruik : false,
          },
          {
            type: DetailResultItemType.Default,
            title: 'Status',
            value: result.verblijfsobject ? result.verblijfsobject.status : false,
            status: result.verblijfsobject && result.verblijfsobject.statusLevel,
          },
          {
            type: DetailResultItemType.Default,
            title: 'Type adres',
            value: result.type_adres,
            status: result.isNevenadres ? NotificationLevel.Attention : '',
          },
          {
            type: DetailResultItemType.Default,
            title: 'Indicatie geconstateerd',
            value: result.indicatie_geconstateerd ? 'Ja' : 'Nee',
            status: result.indicatie_geconstateerd ? NotificationLevel.Error : '',
          },
          {
            type: DetailResultItemType.Default,
            title: 'Aanduiding in onderzoek',
            value: result.aanduiding_in_onderzoek ? 'Ja' : 'Nee',
            status: result.aanduiding_in_onderzoek ? NotificationLevel.Error : '',
          },
          {
            type: DetailResultItemType.Default,
            title: 'Oppervlakte',
            value: result.verblijfsobject ? result.verblijfsobject.size : false,
          },
        ],
      }
    },
  },
  [endpointTypes.adressenVerblijfsobject]: {
    normalization: adressenVerblijfsobject,
    mapDetail: (result) => {
      const notifications: DetailResultNotification[] = []

      if (result.statusLevel) {
        notifications.push({
          value: result.status,
          level: result.statusLevel ?? NotificationLevel.Attention,
        })
      }

      if (result.isNevenadres) {
        notifications.push({
          value: 'Dit is een nevenadres',
          level: NotificationLevel.Attention,
        })
      }

      if (result.indicatie_geconstateerd) {
        notifications.push({
          value: 'Indicatie geconstateerd',
          level: NotificationLevel.Error,
        })
      }

      if (result.aanduiding_in_onderzoek) {
        notifications.push({
          value: 'In onderzoek',
          level: NotificationLevel.Error,
        })
      }

      return {
        notifications,
        title: 'Adres (verblijfsobject)',
        subTitle: result._display,
        items: [
          {
            type: DetailResultItemType.Default,
            title: 'Gebruiksdoel',
            value: result.gebruiksdoelen,
          },
          {
            type: DetailResultItemType.Default,
            title: 'Soort object (feitelijk gebruik)',
            value: result.gebruik || '',
          },
          {
            type: DetailResultItemType.Default,
            title: 'Status',
            value: result.status ? result.status : false,
            status: result.statusLevel,
          },
          {
            type: DetailResultItemType.Default,
            title: 'Type adres',
            value: result.typeAdres,
            status: result.isNevenadres ? NotificationLevel.Attention : '',
          },
          {
            type: DetailResultItemType.Default,
            title: 'Indicatie geconstateerd',
            value: result.indicatie_geconstateerd ? 'Ja' : 'Nee',
            status: result.indicatie_geconstateerd ? NotificationLevel.Error : '',
          },
          {
            type: DetailResultItemType.Default,
            title: 'Aanduiding in onderzoek',
            value: result.aanduiding_in_onderzoek ? 'Ja' : 'Nee',
            status: result.aanduiding_in_onderzoek ? NotificationLevel.Error : '',
          },
          {
            type: DetailResultItemType.Default,
            title: 'Oppervlakte',
            value: result.size,
          },
        ],
      }
    },
  },
  [endpointTypes.adressenOpenbareRuimte]: {
    mapDetail: (result) => ({
      title: result.type,
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.Default,
          title: 'Naam 24-posities (NEN)',
          value: result.naam_24_posities,
        },
      ],
    }),
  },
  [endpointTypes.adressenPand]: {
    normalization: adressenPand,
    mapDetail: (result) => {
      const notifications: DetailResultNotification[] = []

      if (result.statusLevel) {
        notifications.push({
          value: result.status,
          level: result.statusLevel ?? NotificationLevel.Attention,
        })
      }

      return {
        notifications,
        title: categoryLabels.pand.singular,
        subTitle: result._display,
        items: [
          {
            type: DetailResultItemType.Default,
            title: 'Oorspronkelijk bouwjaar',
            value: result.year,
          },
          {
            type: DetailResultItemType.Default,
            title: 'Naam',
            value: result.pandnaam,
          },
          {
            type: DetailResultItemType.Default,
            title: 'Status',
            value: result.status ? result.status : false,
            status: result.statusLevel,
          },
        ],
      }
    },
  },
  [endpointTypes.adressenStandplaats]: {
    mapDetail: (result) => {
      const notifications: DetailResultNotification[] = []

      if (result.indicatie_geconstateerd) {
        notifications.push({
          value: 'Indicatie geconstateerd',
          level: NotificationLevel.Error,
        })
      }

      if (result.aanduiding_in_onderzoek) {
        notifications.push({
          value: 'In onderzoek',
          level: NotificationLevel.Error,
        })
      }

      return {
        notifications,
        title: 'Adres (standplaats)',
        subTitle: result._display,
        items: [
          {
            type: DetailResultItemType.Default,
            title: 'Indicatie geconstateerd',
            value: result.indicatie_geconstateerd ? 'Ja' : 'Nee',
            status: result.indicatie_geconstateerd ? NotificationLevel.Error : '',
          },
          {
            type: DetailResultItemType.Default,
            title: 'Aanduiding in onderzoek',
            value: result.aanduiding_in_onderzoek ? 'Ja' : 'Nee',
            status: result.aanduiding_in_onderzoek ? NotificationLevel.Error : '',
          },
        ],
      }
    },
  },
  [endpointTypes.bedrijfsinvesteringszone]: {
    type: 'vsd/biz',
    endpoint: 'vsd/biz',
    mapDetail: (result) => ({
      title: categoryLabels.bedrijfsinvesteringszone.singular,
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            { term: 'Naam', description: result._display },
            { term: 'Type', description: result.biz_type },
            { term: 'Heffingsgrondslag', description: result.heffingsgrondslag },
            { term: 'Jaarlijkse heffing', description: result.heffing_display },
            { term: 'Aantal heffingsplichtigen', description: result.bijdrageplichtigen },
            { term: 'Website', description: result.website, link: result.website },
            { term: 'Verordening', description: result.verordening, link: result.verordening },
          ].filter(hasDescription),
        },
      ],
    }),
  },
  [endpointTypes.bekendmakingen]: {
    normalization: bekendmakingen,
    type: 'vsd/bekendmakingen',
    endpoint: 'vsd/bekendmakingen',
    mapDetail: (result) => ({
      title: categoryLabels.bekendmakingen.singular,
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            { term: 'Datum', description: result.date },
            { term: 'Categorie', description: result.categorie },
            { term: 'Onderwerp', description: result.onderwerp },
            { term: 'Beschrijving', description: result.beschrijving },
            { term: 'Meer informatie', description: result.url, link: result.url },
          ].filter(hasDescription),
        },
      ],
    }),
  },
  [endpointTypes.bouwstroompunten]: {
    type: 'bouwstroompunten/bouwstroompunten',
    endpoint: 'v1/bouwstroompunten/bouwstroompunten',
    mapDetail: (result) => ({
      title: categoryLabels.bouwstroompunten.singular,
      subTitle: result.bouwstroompuntId,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            {
              term: 'Capaciteit',
              description: result.capaciteit || 'onbekend',
            },
            {
              term: 'Beschikbare aansluiting(en)',
              description: result.beschikbareAansluitingen.map((item: string) => item).join('\n'),
            },
            {
              term: 'Beheerorganisatie',
              description: result.organisatie || 'onbekend',
            },
            {
              term: 'Contactgegevens',
              description: result.email || 'onbekend',
            },
            {
              term: 'Licentie benodigd',
              description: result.vergunningsplichtig ? 'Ja' : 'Nee',
            },
            {
              term: 'Adresgegevens',
              description: `${result.straat} ${result.huisnummer}, ${result.plaats}`,
            },
          ].filter(hasDescription),
        },
      ],
    }),
  },
  [endpointTypes.constructionFiles]: {
    mapDetail: (result) => ({
      title: 'categoryLabels.constructionFiles.singular',
      subTitle: result._display,
      items: [],
    }),
  },
  [endpointTypes.covid_19]: {
    type: 'covid_19',
    mapDetail: (result) => {
      return {
        title: 'COVID-19 Maatregelen',
        subTitle: result.naam,
        items: [
          {
            type: DetailResultItemType.DefinitionList,
            entries: [
              {
                term: 'Soort maatregel',
                description: result.omschrijving,
              },
              {
                term: 'Tijd',
                description: result.tijd,
              },
              {
                term: 'Geldigheid',
                description: result.geldigheid,
              },
              {
                term: 'Besluit',
                description: result.url,
                link: result.url,
              },
            ].filter(hasDescription),
          },
        ],
      }
    },
  },
  [endpointTypes.explosievenGevrijwaardGebied]: {
    type: 'explosieven/gevrijwaardgebied',
    endpoint: 'milieuthemas/explosieven/gevrijwaardgebied',
    normalization: explosieven,
    mapDetail: (result) => ({
      title: 'Gevrijwaard gebied',
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            { term: 'Soort handeling', description: result.type },
            { term: 'Bron', description: result.bron },
            { term: 'Datum rapport', description: result.date && formatDate(result.date) },
            { term: 'Intekening', description: result.intekening },
            {
              term: 'Opmerkingen',
              description: result.opmerkingen,
            },
          ].filter(hasDescription),
        },
      ],
    }),
  },
  [endpointTypes.explosievenInslag]: {
    type: 'explosieven/inslagen',
    endpoint: 'milieuthemas/explosieven/inslagen',
    normalization: explosieven,
    mapDetail: (result) => ({
      title: 'Inslag',
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            { term: 'Datum brondocument', description: result.datum && formatDate(result.datum) },
            {
              term: 'Datum van inslag',
              description: result.datum_inslag && formatDate(result.datum_inslag),
            },
            { term: 'Soort handeling', description: result.type },
            { term: 'Bron', description: result.bron },
            { term: 'Intekening', description: result.intekening },
            { term: 'Nouwkeurigheid', description: result.nouwkeurig },
            { term: 'Opmerkingen', description: result.opmerkingen },
            {
              term: 'Oorlogsincidentrapport',
              description: getFileName(result.pdf),
              link: result.pdf,
            },
          ].filter(hasDescription),
        },
      ],
    }),
  },
  [endpointTypes.explosievenUitgevoerdOnderzoek]: {
    type: 'explosieven/uitgevoerdonderzoek',
    endpoint: 'milieuthemas/explosieven/uitgevoerdonderzoek',
    normalization: explosieven,
    mapDetail: (result) => ({
      title: 'Reeds uitgevoerd CE onderzoek',
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            { term: 'Soort rapportage', description: result.type },
            { term: 'Onderzoeksgebied', description: result.onderzoeksgebied },
            { term: 'Opdrachtnemer', description: result.opdrachtnemer },
            { term: 'Opdrachtgever', description: result.opdrachtgever },
            { term: 'Verdacht gebied', description: result.verdacht_gebied },
            { term: 'Datum rapport', description: result.datum && formatDate(result.datum) },
          ].filter(hasDescription),
        },
      ],
    }),
  },
  [endpointTypes.explosievenVerdachtGebied]: {
    type: 'explosieven/verdachtgebied',
    endpoint: 'milieuthemas/explosieven/verdachtgebied',
    mapDetail: (result) => ({
      title: 'Verdacht gebied',
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            { term: 'Hoofdgroep', description: result.type },
            { term: 'Subsoort', description: result.subtype },
            { term: 'Kaliber', description: result.kaliber },
            { term: 'Aantallen', description: result.aantal },
            { term: 'Verschijning', description: result.verschijning },
            { term: 'Afbakening', description: result.afbakening },
            { term: 'Horizontaal', description: result.horizontaal },
            { term: 'Cartografie', description: result.cartografie },
            { term: 'Opmerkingen', description: result.opmerkingen },
            {
              term: 'Oorlogshandelingsrapport',
              description: getFileName(result.pdf),
              link: result.pdf,
            },
          ].filter(hasDescription),
        },
      ],
    }),
  },
  [endpointTypes.fietspaaltjes]: {
    type: 'fietspaaltjes/fietspaaltjes',
    endpoint: 'v1/fietspaaltjes/fietspaaltjes',
    mapDetail: (result) => {
      function formatList(items: string[] | null) {
        if (items instanceof Array) {
          return items.join(', ')
        }

        return items
      }

      return {
        title: categoryLabels.fietspaaltje.singular,
        subTitle: result.id,
        items: [
          {
            type: DetailResultItemType.DefinitionList,
            entries: [
              { term: 'Type', description: formatList(result.type) },
              { term: 'Aantal', description: result.count },
              { term: 'Noodzaak', description: formatList(result.noodzaak) },
              { term: 'Uiterlijk', description: formatList(result.uiterlijk) },
              { term: 'Omschrijving', description: formatList(result.soortPaaltje) },
              { term: 'Ruimte', description: formatList(result.ruimte) },
              { term: 'Markering', description: formatList(result.markering) },
              { term: 'Soort weg', description: formatList(result.soortWeg) },
              { term: 'Status', description: formatList(result.paaltjesWeg) },
              { term: 'Zichtbaarheid', description: formatList(result.zichtInDonker) },
            ].filter(hasDescription),
          },
        ],
      }
    },
  },
  [endpointTypes.evenementen]: {
    type: 'vsd/evenementen',
    endpoint: 'vsd/evenementen',
    normalization: evenementen,
    mapDetail: (result) => ({
      title: categoryLabels.evenementen.singular,
      subTitle: result.titel,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            { term: 'Startdatum', description: result.startDate },
            { term: 'Starttijd', description: result.startTime },
            { term: 'Einddatum', description: result.endDate },
            { term: 'Eindtijd', description: result.endTime },
            { term: 'Omschrijving', description: result.omschrijving },
            { term: 'Meer informatie', description: result.url, link: result.url },
          ].filter(hasDescription),
        },
      ],
    }),
  },
  [endpointTypes.reclamebelasting]: {
    type: 'vsd/reclamebelasting',
    endpoint: 'vsd/reclamebelasting',
    normalization: reclamebelasting,
    mapDetail: (result) => ({
      title: categoryLabels.reclamebelasting.singular,
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            { term: 'Tarief per', description: result.localeDate },
            { term: 'Website', description: result.website, link: result.website },
            { term: 'Tarieven', description: result.tarieven, link: result.tarieven },
          ].filter(hasDescription),
        },
      ],
    }),
  },
  [endpointTypes.gebiedenBouwblok]: {
    type: 'gebieden/bouwblok',
    endpoint: 'gebieden/bouwblok',
    mapDetail: (result) => ({
      title: categoryLabels.bouwblok.singular,
      subTitle: result._display,
      infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.BOUWBLOK),
      items: [
        getLocationDefinitionListBlock(result, '1 / 1 / 3 / 1'),
        getPaginatedListBlock(result?.panden?.href, GLOSSARY.DEFINITIONS.PAND, {
          skipRouter: true,
        }),
        getPaginatedListBlock(result?.meetbouten, GLOSSARY.DEFINITIONS.MEETBOUT, {
          skipRouter: true,
        }),
      ],
    }),
  },
  [endpointTypes.gebiedenBuurt]: {
    type: 'gebieden/buurt',
    endpoint: 'gebieden/buurt',
    mapDetail: (result) => ({
      title: 'Buurt',
      subTitle: result._display,
      infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.BUURT),
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [{ term: 'Volledige code', description: result.volledige_code }],
          gridArea: '1 / 1 / 1 / 2',
        },
        getLocationDefinitionListBlock(result, '2 / 1 / 3 / 2'),
        getPaginatedListBlock(result?.bouwblokken?.href, GLOSSARY.DEFINITIONS.BOUWBLOK),
        ...getShowInTableBlock({
          key: 'buurt_naam',
          value: result.naam,
        }),
        gebiedInBeeldBlock,
      ],
    }),
  },
  [endpointTypes.gebiedenGebiedsgerichtWerken]: {
    type: 'gebieden/gebiedsgerichtwerken',
    endpoint: 'gebieden/gebiedsgerichtwerken',
    mapDetail: (result) => {
      return {
        title: 'Gebiedsgerichtwerken-gebied',
        subTitle: result._display,
        infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.GEBIEDSGERICHTWERKEN),
        items: [
          {
            type: DetailResultItemType.DefinitionList,
            entries: [{ term: 'Code', description: result.code }],
            gridArea: '1 / 1 / 1 / 3',
          },
          getLocationDefinitionListBlock(result, '2 / 1 / 3 / 2'),
          ...getShowInTableBlock({
            key: 'ggw_naam',
            value: result.naam,
          }),
          gebiedInBeeldBlock,
          getPaginatedListBlock(result?.buurten?.href, GLOSSARY.DEFINITIONS.BUURT),
        ],
      }
    },
  },
  [endpointTypes.gebiedenGrootstedelijk]: {
    type: 'gebieden/grootstedelijkgebied',
    endpoint: 'gebieden/grootstedelijkgebied',
    mapDetail: (result) => ({
      title: 'Grootstedelijk gebied',
      infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.GROOTSTEDELIJKGEBIED),
      subTitle: result._display,
      items: [],
    }),
  },
  [endpointTypes.gebiedenStadsdeel]: {
    type: 'gebieden/stadsdeel',
    endpoint: 'gebieden/stadsdeel',
    mapDetail: (result) => ({
      title: 'Stadsdeel',
      subTitle: result._display,
      infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.STADSDEEL),
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          title: 'Code',
          gridArea: '1 / 1 / 1 / 3',
          entries: [
            { term: 'Code', description: result.code },
            { term: 'Gemeente', description: result.gemeente._display },
          ],
        },
        getPaginatedListBlock(
          result?.buurtcombinaties?.href,
          GLOSSARY.DEFINITIONS.BUURTCOMBINATIE,
          {
            gridArea: '2 / 1 / 3 / 2',
          },
        ),
        getPaginatedListBlock(
          result?.gebiedsgerichtwerken?.href,
          GLOSSARY.DEFINITIONS.GEBIEDSGERICHTWERKEN,
        ),
        gebiedInBeeldBlock,
      ],
    }),
  },
  [endpointTypes.gebiedenUnesco]: {
    type: 'gebieden/unesco',
    endpoint: 'gebieden/unesco',
    mapDetail: (result) => ({
      title: 'UNESCO',
      infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.UNESCO),
      subTitle: result._display,
      items: [],
    }),
  },
  [endpointTypes.gebiedenWijk]: {
    type: 'gebieden/buurtcombinatie',
    endpoint: 'gebieden/buurtcombinatie',
    mapDetail: (result) => {
      return {
        title: 'Wijk',
        infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.BUURTCOMBINATIE),
        subTitle: result._display,
        items: [
          {
            type: DetailResultItemType.DefinitionList,
            entries: [{ term: 'Code', description: result.code }],
            gridArea: '1 / 1 / 1 / 3',
          },
          getLocationDefinitionListBlock(result, '2 / 1 / 3 / 2'),
          getPaginatedListBlock(result?.buurten?.href, GLOSSARY.DEFINITIONS.BUURT),
          ...getShowInTableBlock({
            key: 'buurtcombinatie_naam',
            value: result.naam,
          }),
          gebiedInBeeldBlock,
        ],
      }
    },
  },
  [endpointTypes.grondexploitaties]: {
    type: 'grex/projecten',
    endpoint: 'v1/grex/projecten',
    normalization: grexProject,
    mapDetail: (result) => ({
      title: categoryLabels.grondexploitatie.singular,
      subTitle: result.plannaam,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            { term: 'Nummer', description: result.id },
            { term: 'Status', description: result.planstatusFormatted },
            { term: 'Startdatum', description: result.startdatum },
            { term: 'Oppervlakte', description: result.oppervlakteFormatted },
          ].filter(hasDescription),
        },
      ],
    }),
  },
  [endpointTypes.kadastraalObject]: {
    normalization: kadastraalObject,
    mapDetail: (result) => ({
      title: categoryLabels.kadastraalObject.singular,
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.Default,
          title: 'Kadastrale gemeente',
          value: result.cadastralName,
        },
        {
          type: DetailResultItemType.Default,
          title: 'Gemeente',
          value: result.name,
        },
        { type: DetailResultItemType.Default, title: 'Grootte', value: result.size },
      ],
    }),
  },
  [endpointTypes.meetbout]: {
    normalization: meetbout,
    mapDetail: (result) => ({
      title: categoryLabels.meetbout.singular,
      subTitle: result.meetboutidentificatie,
      items: [
        { type: DetailResultItemType.Default, title: 'Adres', value: result.adres },
        { type: DetailResultItemType.Default, title: 'Zaksnelheid (mm/j)', value: result.speed },
      ],
    }),
  },
  [endpointTypes.monument]: {
    normalization: monument,
    mapDetail: (result) => ({
      title: categoryLabels.monument.singular,
      subTitle: result._display,
      items: [
        { type: DetailResultItemType.Default, title: 'Nummer', value: result.monumentnummer },
        { type: DetailResultItemType.Default, title: 'Type', value: result.monumenttype },
        { type: DetailResultItemType.Default, title: 'Status', value: result.monumentstatus },
      ],
    }),
  },
  [endpointTypes.monumentComplex]: {
    normalization: monument,
    mapDetail: (result) => ({
      title: categoryLabels.monument.singular,
      subTitle: result._display,
      items: [
        { type: DetailResultItemType.Default, title: 'Nummer', value: result.monumentnummer },
        { type: DetailResultItemType.Default, title: 'Type', value: result.monumenttype },
        { type: DetailResultItemType.Default, title: 'Status', value: result.monumentstatus },
      ],
    }),
  },
  [endpointTypes.napPeilmerk]: {
    type: 'nap/peilmerk',
    endpoint: 'nap/peilmerk',
    normalization: napPeilmerk,
    mapDetail: (result) => ({
      title: categoryLabels.napPeilmerk.singular,
      subTitle: result.peilmerkidentificatie,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            {
              term: 'Hoogte NAP',
              description: result.hoogte_nap
                ? `${parseFloat(result.hoogte_nap).toLocaleString(DEFAULT_LOCALE)} m`
                : undefined,
            },
            { term: 'Jaar', description: result.jaar },
            { term: 'Omschrijving', description: result.omschrijving },
            { term: 'Windrichting', description: result.windrichting },
            {
              term: 'Muurvlakcoördinaten (cm)',
              description: `${result.x_muurvlak}, ${result.y_muurvlak}`,
            },
            { term: 'Merk', description: result.merk },
            { term: 'RWS nummer', description: result.rws_nummer },
          ].filter(hasDescription),
        },
      ],
    }),
  },
  [endpointTypes.oplaadpunten]: {
    type: 'vsd/oplaadpunten',
    endpoint: 'vsd/oplaadpunten',
    normalization: oplaadpunten,
    mapDetail: (result) => ({
      title: categoryLabels.oplaadpunten.singular,
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            { term: 'Adres', description: result.address },
            { term: 'Aantal', description: result.quantity },
            { term: 'Soort', description: result.type },
            { term: 'Capaciteit', description: result.charging_capability },
            { term: 'Connectortype', description: result.connector_type },
            { term: 'Status', description: result.currentStatus },
          ].filter(hasDescription),
        },
      ],
    }),
  },
  [endpointTypes.parkeervak]: {
    type: 'parkeervakken/parkeervakken',
    endpoint: 'v1/parkeervakken/parkeervakken',
    normalization: parkeervak,
    mapDetail: (result) => ({
      title: categoryLabels.parkeervak.singular,
      subTitle: result.id,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [{ term: 'Straat', description: result.straatnaam }],
        },
        {
          type: DetailResultItemType.Table,
          title: 'Regimes',
          headings: [
            { title: 'Dagen', key: 'dagenFormatted' },
            { title: 'Tijdstip', key: 'tijdstip' },
            { title: 'Type', key: 'eTypeDescription' },
            { title: 'Bord', key: 'bord' },
            { title: 'Einddatum', key: 'eindDatum' },
            { title: 'Opmerking', key: 'opmerking' },
            { title: 'Begindatum', key: 'beginDatum' },
          ],
          values: result.regimes,
        },
      ],
    }),
  },
  [endpointTypes.parkeerzones]: {
    type: 'vsd/parkeerzones',
    endpoint: 'vsd/parkeerzones',
    normalization: parkeerzones,
    mapDetail: (result) => ({
      title: categoryLabels.parkeerzones.singular,
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [{ term: 'Omschrijving', description: result.gebied_omschrijving }].filter(
            hasDescription,
          ),
        },
      ],
    }),
  },
  [endpointTypes.parkeerzonesUitz]: {
    type: 'vsd/parkeerzones_uitz',
    endpoint: 'vsd/parkeerzones_uitz',
    normalization: parkeerzones,
    mapDetail: (result) => ({
      title: categoryLabels.parkeerzonesUitz.singular,
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [{ term: 'Omschrijving', description: result.omschrijving }].filter(
            hasDescription,
          ),
        },
      ],
    }),
  },
  [endpointTypes.vastgoed]: {
    type: 'vsd/vastgoed',
    endpoint: 'vsd/vastgoed',
    normalization: vastgoed,
    mapDetail: async (result, location) => {
      // TODO: What is happening here is a bit rediculous, but it was migrated from existing code.
      // Basically we do a GeoSearch which returns all the nearby buildings that are on this location.
      // This will in some cases return a bunch of buildings on the exact same location, since they share the same space (see the Geometery)
      // It's a bit dumb since our initial GeoSearch to see if the user clicked something already returns all of these.
      // Either way this is needed because we need to put some identifier in the URL so it might as well be the first one we find.
      // Technically we should really have some kind of model in the API to hold these collections so we can identify them with a single identifier.
      // Really more of a task for the API team to figure this one out...
      const { features } = await fetchWithToken(
        `${environment.API_ROOT}geosearch/vastgoed/?${new URLSearchParams({
          lat: location.lat.toString(),
          lon: location.lng.toString(),
          item: 'vastgoed',
          radius: '0',
        }).toString()}`,
      )

      const serviceDefinition = getServiceDefinition('vsd/vastgoed')

      if (!serviceDefinition) {
        throw new Error('Unable to retrieve service defintition for vastgoed details.')
      }

      const units = await Promise.all(
        features.map(
          async ({ properties }: { properties: { id: string } }) =>
            (await fetchDetailData(serviceDefinition, properties.id)).data,
        ),
      )

      const additionalItems: DetailResultItem[] = units.map((unit: any) => ({
        type: DetailResultItemType.DefinitionList,
        title: unit._display,
        entries: [
          { term: 'Verhuurde eenheid', description: unit.vhe_adres },
          { term: 'Gebruiksdoel', description: unit.bag_verblijfsobject_gebruiksdoelen },
          {
            term: 'Oppervlakte (indicatie)',
            description: unit.oppervlakte > 0 ? formatSquareMetre(unit.oppervlakte) : 'Onbekend',
          },
          { term: 'Monumentstatus', description: unit.monumental_status },
          { term: 'Status', description: unit.status },
          { term: 'Contractueel gebruik', description: unit.huurtype },
        ].filter(hasDescription),
      }))

      return {
        title: 'Gemeentelijk eigendom',
        subTitle: result._display,
        items: [
          {
            type: DetailResultItemType.DefinitionList,
            gridArea: '2 / 1 / 3 / 2',
            entries: [
              { term: 'Bouwjaar', description: result.construction_year },
              { term: 'Aantal verhuurde eenheden', description: additionalItems.length },
              { term: 'Monumentstatus', description: result.monumental_status },
              { term: 'Status', description: result.status },
            ].filter(hasDescription),
          },
          {
            type: DetailResultItemType.Heading,
            title: `Verhuurde eenheden (${additionalItems.length})`,
          },
          ...additionalItems,
        ],
      }
    },
  },
  [endpointTypes.vestiging]: {
    authScope: 'HR/R',
    normalization: vestiging,
    mapDetail: (result) => {
      if (!result) {
        return {
          title: categoryLabels.vestiging.singular,
          subTitle: 'Authenticatie vereist',
          items: [],
          notifications: [
            {
              value:
                'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken.',
              level: NotificationLevel.Attention,
            },
          ],
        }
      }

      const notifications: DetailResultNotification[] = []

      if (result.bijzondereRechtstoestand && result.bijzondereRechtstoestand.title) {
        notifications.push({
          value:
            result.bijzondereRechtstoestand && result.bijzondereRechtstoestand.title
              ? result.bijzondereRechtstoestand.title
              : false,
          level: NotificationLevel.Error,
        })
      }

      if (!result._display) {
        notifications.push({
          value:
            'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken.',
          level: NotificationLevel.Attention,
        })
      }

      return {
        notifications,
        title: categoryLabels.vestiging.singular,
        subTitle: result._display,
        items: [
          {
            type: DetailResultItemType.Default,
            title: 'KvK-nummer',
            value: result.kvkNumber,
          },
          {
            type: DetailResultItemType.Default,
            title: 'Vestigingsnummer',
            value: result.vestigingsnummer,
          },
          {
            type: DetailResultItemType.Default,
            title: 'Bezoekadres',
            value: result.bezoekadres.volledig_adres,
          },
          {
            type: DetailResultItemType.Default,
            title: 'SBI-code en -omschrijving',
            value: result.activities,
          },
          {
            type: DetailResultItemType.Default,
            title: 'Type',
            value: result.type,
          },
          {
            type: DetailResultItemType.Default,
            title: 'Soort bijzondere rechtstoestand',
            value:
              result.bijzondereRechtstoestand && result.bijzondereRechtstoestand.title
                ? result.bijzondereRechtstoestand.title
                : false,
            status: NotificationLevel.Error,
          },
        ],
      }
    },
  },
  [endpointTypes.winkelgebied]: {
    type: 'vsd/winkgeb',
    endpoint: 'vsd/winkgeb',
    normalization: winkelgebied,
    mapDetail: (result) => ({
      title: categoryLabels.winkelgebied.singular,
      subTitle: result._display,
      notifications: [
        {
          value:
            'De grenzen van dit winkelgebied zijn indicatief. Er kunnen geen rechten aan worden ontleend.',
          level: NotificationLevel.Attention,
        },
      ],
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            {
              term: 'Categorie',
              description: result.categorie_naam
                ? `${result.categorie_naam} (${result.categorie})`
                : undefined,
            },
          ].filter(hasDescription),
        },
      ],
    }),
  },
  [endpointTypes.wkpbBeperking]: {
    mapDetail: (result) => ({
      title: categoryLabels.gemeentelijkeBeperking.singular,
      subTitle: result._display,
      items: [],
    }),
  },
  [endpointTypes.wkpbUitreksel]: {
    mapDetail: (result) => ({
      title: 'WKPB-uittreksel',
      subTitle: result._display,
      items: [],
    }),
  },
  [endpointTypes.kadastraalSubject]: {
    authScope: 'BRK/RS',
    mapDetail: (result) =>
      result
        ? {
            title: categoryLabels.kadastraalSubject.singular,
            subTitle: result._display,
            items: [],
          }
        : {
            title: categoryLabels.kadastraalSubject.singular,
            subTitle: 'Authenticatie vereist',
            items: [],
            notifications: [
              {
                value:
                  'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om kadastrale subjecten te bekijken. Om ook zakelijke rechten van natuurlijke personen te bekijken, moet je als medewerker bovendien speciale bevoegdheden hebben.',
                level: NotificationLevel.Attention,
              },
            ],
          },
  },
  [endpointTypes.maatschappelijkeActiviteiten]: {
    authScope: 'HR/R',
    mapDetail: (result) =>
      result
        ? {
            title: categoryLabels.mac.singular,
            subTitle: result._display,
            items: [],
          }
        : {
            title: categoryLabels.mac.singular,
            subTitle: 'Authenticatie vereist',
            items: [],
            notifications: [
              {
                value:
                  'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken.',
                level: NotificationLevel.Attention,
              },
            ],
          },
  },
  [endpointTypes.woonplaats]: {
    mapDetail: (result) => ({
      title: 'Woonplaats',
      subTitle: result._display,
      items: [],
    }),
  },
  [endpointTypes.precarioShips]: {
    type: 'precariobelasting/woonschepen',
    endpoint: 'v1/precariobelasting/woonschepen',
    mapDetail: (result) => ({
      title: categoryLabels.precarioShips.singular,
      subTitle: result.gebied,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          gridArea: '2 / 1 / 3 / 2',
          entries: [
            {
              term: 'Categorie',
              description: result.categorie,
            },
            {
              term: 'Jaar',
              description: result.jaar,
            },
            {
              term: 'Stadsdeel',
              description: result.stadsdeel,
            },
            {
              term: 'Tarief per jaar per m2',
              description: result.tariefPerJaarPerM2,
            },
          ].filter(hasDescription),
        },
      ],
    }),
  },
  [endpointTypes.precarioComVessels]: {
    type: 'precariobelasting/bedrijfsvaartuigen',
    endpoint: 'v1/precariobelasting/bedrijfsvaartuigen',
    mapDetail: (result) => ({
      title: categoryLabels.precarioComVessels.singular,
      subTitle: result.gebied,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            {
              term: 'Categorie',
              description: result.categorie,
            },
            {
              term: 'Jaar',
              description: result.jaar,
            },
            {
              term: 'Stadsdeel',
              description: result.stadsdeel,
            },
            {
              term: 'Tarief per jaar per m2',
              description: result.tariefPerJaarPerM2,
            },
          ].filter(hasDescription),
        },
      ],
    }),
  },
  [endpointTypes.precarioPassVessels]: {
    type: 'precariobelasting/passagiersvaartuigen',
    endpoint: 'v1/precariobelasting/passagiersvaartuigen',
    mapDetail: (result) => ({
      title: categoryLabels.precarioPassVessels.singular,
      subTitle: result.gebied,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            {
              term: 'Categorie',
              description: result.categorie,
            },
            {
              term: 'Jaar',
              description: result.jaar,
            },
            {
              term: 'Gebied',
              description: result.gebied,
            },
            {
              term: 'Tarief per jaar per m2',
              description: result.tariefPerJaarPerM2,
            },
          ].filter(hasDescription),
        },
      ],
    }),
  },
  [endpointTypes.precarioTerraces]: {
    type: 'precariobelasting/terrassen',
    endpoint: 'v1/precariobelasting/terrassen',
    mapDetail: (result) => ({
      title: categoryLabels.precarioTerraces.singular,
      subTitle: result.gebied,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            {
              term: 'Categorie',
              description: result.categorie,
            },
            {
              term: 'Jaar',
              description: result.jaar,
            },
            {
              term: 'Stadsdeel',
              description: result.stadsdeel,
            },
            {
              term: 'Gebied',
              description: result.gebied,
            },
            {
              term: 'Overdekt terras per jaar per m2',
              description: result.tariefOverdektTerrasPerJaarPerM2,
            },
            {
              term: 'Onverdekt terras per zomerseizoen per m2',
              description: result.tariefOnoverdektTerrasPerZomerseizoenPerM2,
            },
            {
              term: 'Onoverdekt terras per winterseizoen per m2',
              description: result.tariefOnoverdektTerrasPerWinterseizoenPerM2,
            },
          ].filter(hasDescription),
        },
      ],
    }),
  },
  [endpointTypes.tunnels]: {
    type: 'hoofdroutes/tunnels_gevaarlijke_stoffen',
    endpoint: 'v1/hoofdroutes/tunnels_gevaarlijke_stoffen',
    mapDetail: (result) => ({
      title: categoryLabels.tunnels.singular,
      subTitle: result.title,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            { term: 'Titel', description: result.title },
            { term: 'Categorie', description: result.categorie },
          ].filter(hasDescription),
        },
      ],
    }),
  },
}

export default servicesByEndpointType

// TODO: Remove 'servicesByEndpointType' and export 'serviceDefinitions' only.
const serviceDefinitions = Object.values(servicesByEndpointType)

export function getServiceDefinitions() {
  return serviceDefinitions
}

export const genericDetailTypes = getServiceDefinitions()
  .map((service) => service.type)
  .filter((type) => !!type)

export function isGenericTemplate(templateUrl?: string) {
  if (!templateUrl) {
    return templateUrl
  }

  // @ts-ignore
  return genericDetailTypes.some((type) => templateUrl.includes(type))
}

function hasDescription({ description }: { description: any }) {
  return !!description
}
