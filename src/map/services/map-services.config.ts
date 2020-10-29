/* eslint-disable no-underscore-dangle,camelcase */
import { LatLngLiteral } from 'leaflet'
import NotificationLevel from '../../app/models/notification'
import config, { DataSelectionType } from '../../app/pages/MapPage/config'
import getListFromApi from '../../app/pages/MapPage/detail/getListFromApi'
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
  DetailAuthentication,
  DetailInfo,
  DetailResult,
  DetailResultItem,
  DetailResultItemDefinitionList,
  DetailResultItemDefinitionListEntry,
  DetailResultItemLinkList,
  DetailResultItemPaginatedData,
  DetailResultItemType,
  DetailResultNotification,
  ExtraApiResults,
  PotentialApiResult,
} from '../types/details'
import adressenNummeraanduiding from './adressen-nummeraanduiding/adressen-nummeraanduiding'
import { fetchDetailData, getServiceDefinition } from './map'
import categoryLabels from './map-search/category-labels'
import {
  addNummeraanduiding,
  adressenPand,
  adressenVerblijfsobject,
  bekendmakingen,
  evenementen,
  explosieven,
  formatSquareMetre,
  grexProject,
  kadastraalObject,
  meetbout,
  meetboutTable,
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
import getRdAndWgs84Coordinates from '../../shared/services/coordinate-reference-system/getRdAndWgs84Coordinates'
import AuthScope from '../../shared/services/api/authScope'

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
  covid19Alcohol: 'v1/covid_19/alcoholverkoopverbod/',
  covid19Mooring: 'v1/covid_19/aanlegverbod/',
  covid19Artist: 'v1/covid_19/straatartiestverbod/',
  covid19Mask: 'v1/covid_19/mondmaskerverplichting/',
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
  woonplaats: 'bag/v1.1/woonplaats',
}

export interface ServiceDefinition extends DetailAuthentication {
  type: string
  endpoint: string
  definition?: Definition
  normalization?: (result: any) => any | Promise<any>
  mapDetail: (
    result: PotentialApiResult & ExtraApiResults,
    detailInfo: DetailInfo,
    location?: LatLngLiteral,
  ) => DetailResult | Promise<DetailResult>
}

function buildMetaData(
  result: any,
  metadata?: Array<keyof typeof GLOSSARY.META>,
): DetailResultItemDefinitionListEntry[] {
  if (!metadata) {
    return []
  }

  return metadata.map((metaKey) => {
    const meta = GLOSSARY.META[metaKey]

    return {
      term: meta.label,
      description: 'filter' in meta ? meta.filter(result[metaKey]) : result[metaKey],
    }
  })
}

const getInfoBox = ({ description, url, plural }: Omit<InfoBoxProps, 'meta'>): InfoBoxProps => ({
  description,
  url,
  plural,
})

const getLinkListBlock = (
  definition: Definition,
  result?: any,
  displayFormatter?: (data: any) => string,
): DetailResultItemLinkList => ({
  title: definition.plural,
  type: DetailResultItemType.LinkList,
  links: result?.map((res: any) => ({
    to: buildDetailUrl(getDetailPageData(res._links.self.href)),
    title: displayFormatter ? displayFormatter(res) : res._display,
  })),
  infoBox: getInfoBox(definition),
})

const typeAddressDisplayFormatter = (result: any) => {
  let extraInfo = ''
  if (result.type_adres && result.type_adres !== 'Hoofdadres') {
    extraInfo = `${result?.type_adres} `
  }
  if (result.situering_nummeraanduiding) {
    if (result.situering_nummeraanduiding === 'Actueel/Bij') {
      extraInfo = `${extraInfo}(gelegen bij) `
    }
    if (result.situering_nummeraanduiding === 'Actueel/Tegenover') {
      extraInfo = `${extraInfo}(gelegen tegenover) `
    }
    if (result.situering_nummeraanduiding === 'Actueel/Via') {
      extraInfo = `${extraInfo}(betreden via) `
    }
  }

  if (
    result.vbo_status &&
    result.vbo_status !== 'Verblijfsobject in gebruik (niet ingemeten)' &&
    result.vbo_status !== 'Verblijfsobject in gebruik' &&
    result.vbo_status.status !== 'Verbouwing verblijfsobject'
  ) {
    extraInfo = `${extraInfo}(${result?.vbo_status.toLowerCase()})`
  }

  return result.type_adres !== 'Hoofdadres' ? `${result._display} ${extraInfo}` : result._display
}

const getPaginatedListBlock = (
  definition: Definition,
  apiUrl?: string | null,
  settings?: {
    gridArea?: string
    pageSize?: number
    displayFormatter?: (data: any) => string
    normalize?: (data: any[]) => any[] | Promise<any>
  } & DetailAuthentication,
): DetailResultItemPaginatedData => ({
  type: DetailResultItemType.PaginatedData,
  getData: getListFromApi(apiUrl, settings?.normalize),
  pageSize: settings?.pageSize || 10,
  // Todo: AfterBeta: gridArea can be removed
  gridArea: settings?.gridArea || 'auto / 1 / auto / 3',
  infoBox: getInfoBox({
    description: definition.description,
    url: definition.url,
    plural: definition.plural,
  }),
  title: definition.plural,
  ...settings,
  toView: (data) => {
    const results = data?.map((result: any) => ({
      to: buildDetailUrl(getDetailPageData(result._links.self.href)),
      title: settings?.displayFormatter ? settings.displayFormatter(result) : result._display,
    }))
    return {
      type: DetailResultItemType.LinkList,
      links: results,
    }
  },
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

  const bouwblok = {
    config: GLOSSARY.DEFINITIONS.BOUWBLOK,
    value: result.bouwblok || result._bouwblok,
  }

  const items = [stadsdeel, wijk, buurt, gebiedsgerichtwerken, bouwblok].filter(
    (item) => item.value,
  )

  return {
    title: 'Ligt in',
    type: DetailResultItemType.DefinitionList,
    entries: items.map(({ config: { singular }, value }) => ({
      term: singular,
      description: value._display,
      to: buildDetailUrl(getDetailPageData(value._links.self.href)),
    })),
    gridArea,
  }
}

const getShowInTableBlock = (filters: {
  key: string
  value?: string | null
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
          pathname: config[DataSelectionType.HR].path,
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
          pathname: config[DataSelectionType.BRK].path,
          search: `${PARAMETERS.VIEW}=volledig&${PARAMETERS.FILTERS}={"${filters.key}":"${filters.value}"}`,
        },
        title: 'In tabel weergeven',
      },
    ],
  },
]

const gebiedInBeeldBlock: DetailResultItemLinkList = {
  type: DetailResultItemType.LinkList,
  title: 'Feiten en cijfers over deze buurt',
  links: [
    {
      url: 'https://gebiedinbeeld.amsterdam.nl/#/dashboard',
      title: 'Ga naar Gebied in beeld',
    },
  ],
}

const getBagDefinitionList = (result?: any): DetailResultItemDefinitionList => ({
  type: DetailResultItemType.DefinitionList,
  entries: [
    {
      term: 'Naam openbare ruimte',
      description: result?.openbare_ruimte._display,
      to: result ? buildDetailUrl(getDetailPageData(result?.openbare_ruimte._links.self.href)) : '',
    },
    { term: 'Huisnummer', description: result?.huisnummer },
    { term: 'Huisletter', description: result?.huisletter },
    { term: 'Huisnummertoevoeging', description: result?.huisnummer_toevoeging },
    { term: 'Postcode', description: result?.postcode },
    {
      term: 'Woonplaats',
      description: result?.woonplaats._display,
      to: result ? buildDetailUrl(getDetailPageData(result?.woonplaats?._links?.self.href)) : '',
    },
    { term: 'Type adres', description: result?.type_adres },
  ],
})

const getConstructionFileList = (detailInfo: DetailInfo) =>
  getPaginatedListBlock(
    GLOSSARY.DEFINITIONS.BOUWDOSSIER,
    `${environment.API_ROOT}iiif-metadata/bouwdossier/?${detailInfo.subType}=${detailInfo.id}`,
    {
      pageSize: 25,
      displayFormatter: ({ stadsdeel, dossiernr, datering, dossier_type }: any) =>
        `${stadsdeel}${dossiernr} ${
          datering
            ? new Date(datering).toLocaleDateString(DEFAULT_LOCALE, {
                year: 'numeric',
              })
            : ''
        } ${dossier_type}`,
      normalize: (data) => data.sort((a, b) => (a.datering < b.datering ? 1 : -1)),
    },
  )

const getMainMetaBlock = (result: any, definition: Definition): InfoBoxProps => ({
  ...getInfoBox(definition),
  meta: buildMetaData(result, definition.meta),
})

const getCovidBlock = (result: any): DetailResult => ({
  title: 'COVID-19 Maatregelen',
  subTitle: result.naam,
  noPanorama: true,
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
          href: result.url,
        },
      ],
    },
  ],
})

const getVerblijfsObjectBlock = (result: any): DetailResultItemDefinitionList => ({
  type: DetailResultItemType.DefinitionList,
  title: GLOSSARY.DEFINITIONS.VERBLIJFSOBJECT.singular,
  infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.VERBLIJFSOBJECT),
  entries: [
    {
      term: 'Gebruiksdoel',
      description: result?.gebruiksdoel?.join(', '),
    },
    {
      term: 'Gebruiksdoel woonfunctie',
      description: result.gebruiksdoel_woonfunctie,
    },
    {
      term: 'Gebruiksdoel gezondheidszorgfunctie',
      description: result.gebruiksdoel_gezondheidszorgfunctie,
    },
    {
      term: 'Aantal eenheden complex',
      description: result.aantal_eenheden_complex,
    },
    {
      term: 'Soort object (feitelijk gebruik) volgens de WOZ',
      description: result.gebruik,
    },
    {
      term: 'Status',
      description: result.status,
    },
    {
      term: 'Indicatie geconstateerd',
      description: result.indicatie_geconstateerd ? 'Ja' : 'Nee',
    },
    {
      term: 'Aanduiding in onderzoek',
      description: result.aanduiding_in_onderzoek ? 'Ja' : 'Nee',
    },
    {
      term: 'Oppervlakte',
      description:
        result.oppervlakte === '1'
          ? 'onbekend'
          : `${result.oppervlakte.toLocaleString(DEFAULT_LOCALE)} m²`,
    },
    {
      term: 'Aantal kamers',
      description: result.aantal_kamers,
    },
    {
      term: 'Verdieping toegang',
      description: result.verdieping_toegang,
    },
    {
      term: 'Toegang',
      description: result.toegang.join(', '),
    },
    {
      term: 'Aantal bouwlagen',
      description: result.bouwlagen,
    },
    {
      term: 'Hoogste bouwlaag',
      description: result.hoogste_bouwlaag,
    },
    {
      term: 'Laagste bouwlaag',
      description: result.laagste_bouwlaag,
    },
    {
      term: 'Reden opvoer',
      description: result.reden_opvoer,
    },
    {
      term: 'Eigendomsverhouding',
      description: result.eigendomsverhouding,
    },
    {
      term: 'Coördinaten',
      description: getRdAndWgs84Coordinates(result.geometrie.coordinates, 'RD'),
    },
  ],
})

// Todo: DI-1208 Split this page into seperate files grouped by type
const servicesByEndpointType: { [type: string]: ServiceDefinition } = {
  [endpointTypes.adressenLigplaats]: {
    type: 'bag/ligplaats',
    endpoint: 'bag/v1.1/ligplaats',
    normalization: addNummeraanduiding,
    mapDetail: (result) => {
      const notifications: DetailResultNotification[] = []

      if (result.indicatie_geconstateerd) {
        notifications.push({
          id: 1,
          value: 'Indicatie geconstateerd',
          level: NotificationLevel.Error,
        })
      }

      if (result.aanduiding_in_onderzoek) {
        notifications.push({
          id: 2,
          value: 'In onderzoek',
          level: NotificationLevel.Error,
        })
      }

      const { nummeraanduidingData } = result
      return {
        notifications,
        title: 'Adres (ligplaats)',
        subTitle: result._display,
        infoBox: getMainMetaBlock(nummeraanduidingData, GLOSSARY.DEFINITIONS.NUMMERAANDUIDING),
        items: [
          getBagDefinitionList(nummeraanduidingData),
          getLocationDefinitionListBlock(nummeraanduidingData, '2 / 1 / 3 / 1'),
          {
            type: DetailResultItemType.DefinitionList,
            title: GLOSSARY.DEFINITIONS.LIGPLAATS.singular,
            infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.LIGPLAATS),
            entries: [
              {
                term: 'Status',
                description: result?.status,
              },
              {
                term: 'Indicatie geconstateerd',
                description: result.indicatie_geconstateerd ? 'Ja' : 'Nee',
              },
              {
                term: 'Aanduiding in onderzoek',
                description: result.aanduiding_in_onderzoek ? 'Ja' : 'Nee',
              },
            ],
          },
          getPaginatedListBlock(
            GLOSSARY.DEFINITIONS.VESTIGING,
            `${environment.API_ROOT}handelsregister/vestiging/?nummeraanduiding=${result.hoofdadres?.landelijk_id}`,
            {
              authScopes: [AuthScope.HrR],
              authScopeRequired: true,
            },
          ),
        ],
      }
    },
  },
  [endpointTypes.adressenNummeraanduiding]: {
    type: 'bag/nummeraanduiding',
    endpoint: 'bag/v1.1/nummeraanduiding',
    normalization: adressenNummeraanduiding,
    mapDetail: (result, detailInfo) => {
      const notifications: DetailResultNotification[] = []

      if (result.verblijfsobject && result.verblijfsobject?.statusLevel) {
        notifications.push({
          id: 1,
          value: `Status: ${result.verblijfsobject?.status}`,
          level: NotificationLevel.Attention,
        })
      }

      if (result.isNevenadres) {
        notifications.push({
          id: 2,
          value: 'Dit is een nevenadres',
          level: NotificationLevel.Attention,
        })
      }

      if (result.indicatie_geconstateerd) {
        notifications.push({
          id: 3,
          value: 'Indicatie geconstateerd',
          level: NotificationLevel.Error,
        })
      }

      if (result.aanduiding_in_onderzoek) {
        notifications.push({
          id: 4,
          value: 'In onderzoek',
          level: NotificationLevel.Error,
        })
      }

      const { verblijfsobjectData } = result
      return {
        notifications,
        title: 'Adres (nummeraanduiding)',
        subTitle: result._display,
        infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.NUMMERAANDUIDING),
        items: [
          getBagDefinitionList(result),
          getLocationDefinitionListBlock(result, '2 / 1 / 3 / 1'),
          getVerblijfsObjectBlock(verblijfsobjectData),
          getPaginatedListBlock(GLOSSARY.DEFINITIONS.PAND, verblijfsobjectData?.panden?.href),
          getPaginatedListBlock(
            GLOSSARY.DEFINITIONS.VESTIGING,
            `${environment.API_ROOT}handelsregister/vestiging/?pand=${verblijfsobjectData?.hoofdadres?.landelijk_id}`,
            {
              authScopes: [AuthScope.HrR],
              authScopeRequired: true,
            },
          ),
          getPaginatedListBlock(
            GLOSSARY.DEFINITIONS.OBJECT,
            verblijfsobjectData?.kadastrale_objecten?.href,
            {
              authScopes: [AuthScope.BdR],
            },
          ),
          getPaginatedListBlock(
            GLOSSARY.DEFINITIONS.MONUMENTEN,
            `${environment.API_ROOT}monumenten/situeringen/?betreft_nummeraanduiding=${verblijfsobjectData?.hoofdadres?.landelijk_id}`,
          ),
          getConstructionFileList(detailInfo),
          getPaginatedListBlock(GLOSSARY.DEFINITIONS.STANDPLAATS, result?.standplaats),
          getPaginatedListBlock(GLOSSARY.DEFINITIONS.LIGPLAATS, result?.ligplaats),
        ],
      }
    },
  },
  [endpointTypes.adressenVerblijfsobject]: {
    normalization: (result) => addNummeraanduiding(adressenVerblijfsobject(result)),
    endpoint: 'bag/v1.1/verblijfsobject',
    type: 'bag/verblijfsobject',
    mapDetail: (result, detailInfo) => {
      const notifications: DetailResultNotification[] = []

      if (result.statusLevel) {
        notifications.push({
          id: 1,
          value: result.status,
          level: NotificationLevel.Attention,
        })
      }

      if (result.isNevenadres) {
        notifications.push({
          id: 2,
          value: 'Dit is een nevenadres',
          level: NotificationLevel.Attention,
        })
      }

      if (result.indicatie_geconstateerd) {
        notifications.push({
          id: 3,
          value: 'Indicatie geconstateerd',
          level: NotificationLevel.Error,
        })
      }

      if (result.aanduiding_in_onderzoek) {
        notifications.push({
          id: 4,
          value: 'In onderzoek',
          level: NotificationLevel.Error,
        })
      }

      const { nummeraanduidingData } = result
      return {
        notifications,
        title: 'Adres (verblijfsobject)',
        subTitle: result._display,
        infoBox: getMainMetaBlock(nummeraanduidingData, GLOSSARY.DEFINITIONS.NUMMERAANDUIDING),
        items: [
          getBagDefinitionList(nummeraanduidingData),
          getLocationDefinitionListBlock(nummeraanduidingData, '2 / 1 / 3 / 1'),
          getVerblijfsObjectBlock(result),
          getPaginatedListBlock(GLOSSARY.DEFINITIONS.NUMMERAANDUIDING, result?.adressen?.href, {
            displayFormatter: typeAddressDisplayFormatter,
          }),
          getPaginatedListBlock(GLOSSARY.DEFINITIONS.PAND, result?.panden?.href),
          getPaginatedListBlock(
            GLOSSARY.DEFINITIONS.VESTIGING,
            `${environment.API_ROOT}handelsregister/vestiging/?verblijfsobject=${result.verblijfsobjectidentificatie}`,
            {
              authScopes: [AuthScope.HrR],
              authScopeRequired: true,
            },
          ),
          // Todo: DI-1207 Create sub link list (example: /data/bag/verblijfsobject/id0363010000665114/)
          getPaginatedListBlock(GLOSSARY.DEFINITIONS.OBJECT, result.kadastrale_objecten?.href, {
            authScopes: [AuthScope.BdR],
          }),
          getPaginatedListBlock(
            GLOSSARY.DEFINITIONS.MONUMENTEN,
            `${environment.API_ROOT}monumenten/situeringen/?betreft_nummeraanduiding=${result.hoofdadres?.landelijk_id}`,
            {
              // This is pretty terrible, but if a result has the key 'hoort_bij_monument', it should fetch data
              // that is linked to that and show that in the frontend instead.
              normalize: async (resultToNormalize: any) =>
                Promise.all(
                  resultToNormalize?.map(async (res: any) =>
                    res?.hoort_bij_monument
                      ? fetchWithToken(res?.hoort_bij_monument?._links?.self?.href)
                      : res,
                  ),
                ),
            },
          ),
          getConstructionFileList(detailInfo),
        ],
      }
    },
  },
  [endpointTypes.adressenOpenbareRuimte]: {
    type: 'bag/openbareruimte',
    endpoint: 'bag/v1.1/openbareruimte',
    mapDetail: (result) => ({
      title: GLOSSARY.DEFINITIONS.OPENBARERUIMTE.singular,
      subTitle: result._display,
      infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.OPENBARERUIMTE),
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            { term: 'Naam 24-posities (NEN)', description: result.naam_24_posities },
            {
              term: 'Woonplaats',
              description: result.woonplaats?._display,
              to: buildDetailUrl(getDetailPageData(result.woonplaats?._links?.self?.href)),
            },
            { term: 'Type', description: result.type as string },
            { term: 'Status', description: result.status },
            { term: 'Omschrijving', description: result.omschrijving },
          ],
        },
        ...getShowInTableBlock({
          key: 'openbare_ruimte',
          value: result.naam,
        }),
      ],
    }),
  },
  [endpointTypes.adressenPand]: {
    normalization: adressenPand,
    type: 'bag/pand',
    endpoint: 'bag/v1.1/pand',
    mapDetail: (result) => {
      const notifications: DetailResultNotification[] = []

      if (result.statusLevel) {
        notifications.push({
          id: 1,
          value: result.status,
          level: NotificationLevel.Attention,
        })
      }

      return {
        notifications,
        title: categoryLabels.pand.singular,
        subTitle: result._display,
        infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.PAND),
        items: [
          {
            type: DetailResultItemType.DefinitionList,
            entries: [
              {
                term: 'Oorspronkelijk bouwjaar',
                description:
                  result.oorspronkelijk_bouwjaar !== '1005'
                    ? result.oorspronkelijk_bouwjaar
                    : 'onbekend',
              },
              { term: 'Status', description: result.status },
              { term: 'Naam', description: result.pandnaam },
              { term: 'Type woonobject', description: result.type_woonobject },
              { term: 'Ligging', description: result.ligging },
              { term: 'Aantal bouwlagen', description: result.bouwlagen },
              { term: 'Hoogste bouwlaag', description: result.hoogste_bouwlaag },
              { term: 'Laagste bouwlaag', description: result.laagste_bouwlaag },
            ],
          },
          getLocationDefinitionListBlock(result, '2 / 1 / 3 / 2'),
          getPaginatedListBlock(GLOSSARY.DEFINITIONS.NUMMERAANDUIDING, result?._adressen?.href, {
            displayFormatter: typeAddressDisplayFormatter,
          }),
          getPaginatedListBlock(
            GLOSSARY.DEFINITIONS.VESTIGING,
            `${environment.API_ROOT}handelsregister/vestiging/?pand=${result.pandidentificatie}`,
            {
              authScopes: [AuthScope.HrR],
              authScopeRequired: true,
            },
          ),
          getPaginatedListBlock(GLOSSARY.DEFINITIONS.MONUMENTEN, result?._monumenten?.href),
        ],
      }
    },
  },
  [endpointTypes.adressenStandplaats]: {
    type: 'bag/standplaats',
    endpoint: 'bag/v1.1/standplaats',
    normalization: addNummeraanduiding,
    mapDetail: (result) => {
      const notifications: DetailResultNotification[] = []

      if (result.indicatie_geconstateerd) {
        notifications.push({
          id: 1,
          value: 'Indicatie geconstateerd',
          level: NotificationLevel.Error,
        })
      }

      if (result.aanduiding_in_onderzoek) {
        notifications.push({
          id: 2,
          value: 'In onderzoek',
          level: NotificationLevel.Error,
        })
      }

      const { nummeraanduidingData } = result

      return {
        notifications,
        title: 'Adres (standplaats)',
        subTitle: result._display,
        infoBox: getMainMetaBlock(nummeraanduidingData, GLOSSARY.DEFINITIONS.NUMMERAANDUIDING),
        items: [
          getBagDefinitionList(nummeraanduidingData),
          getLocationDefinitionListBlock(nummeraanduidingData, '2 / 1 / 3 / 1'),
          {
            type: DetailResultItemType.DefinitionList,
            title: GLOSSARY.DEFINITIONS.STANDPLAATS.singular,
            infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.STANDPLAATS),
            entries: [
              {
                term: 'Status',
                description: result?.status,
              },
              {
                term: 'Indicatie geconstateerd',
                description: result.indicatie_geconstateerd ? 'Ja' : 'Nee',
              },
              {
                term: 'Aanduiding in onderzoek',
                description: result.aanduiding_in_onderzoek ? 'Ja' : 'Nee',
              },
            ],
          },
          getPaginatedListBlock(
            GLOSSARY.DEFINITIONS.VESTIGING,
            `${environment.API_ROOT}handelsregister/vestiging/?nummeraanduiding=${result.hoofdadres?.landelijk_id}`,
            {
              authScopes: [AuthScope.HrR],
              authScopeRequired: true,
            },
          ),
          getPaginatedListBlock(
            GLOSSARY.DEFINITIONS.MONUMENTEN,
            `${environment.API_ROOT}monumenten/situeringen/?betreft_nummeraanduiding=${result.landelijk_id}`,
          ),
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
            { term: 'Website', description: result.website, href: result.website },
            { term: 'Verordening', description: result.verordening, href: result.verordening },
          ],
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
            { term: 'Meer informatie', description: result.url, href: result.url },
          ],
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
              description: result.beschikbareAansluitingen?.map((item: string) => item).join('\n'),
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
          ],
        },
      ],
    }),
  },
  [endpointTypes.covid19Alcohol]: {
    type: 'covid_19/alcoholverkoopverbod',
    endpoint: 'v1/covid_19/alcoholverkoopverbod',
    mapDetail: (result) => getCovidBlock(result),
  },
  [endpointTypes.covid19Mooring]: {
    type: 'covid_19/aanlegverbod',
    endpoint: 'v1/covid_19/aanlegverbod',
    mapDetail: (result) => getCovidBlock(result),
  },
  [endpointTypes.covid19Artist]: {
    type: 'covid_19/straatartiestverbod',
    endpoint: 'v1/covid_19/straatartiestverbod',
    mapDetail: (result) => getCovidBlock(result),
  },
  [endpointTypes.covid19Mask]: {
    type: 'covid_19/mondmaskerverplichting',
    endpoint: 'v1/covid_19/mondmaskerverplichting',
    mapDetail: (result) => getCovidBlock(result),
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
            { term: 'Soort handeling', description: result.type as string },
            { term: 'Bron', description: result.bron },
            {
              term: 'Datum rapport',
              description: result.date && formatDate(new Date(result.date)),
            },
            { term: 'Intekening', description: result.intekening },
            {
              term: 'Opmerkingen',
              description: result.opmerkingen,
            },
          ],
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
            {
              term: 'Datum brondocument',
              description: result.datum && formatDate(new Date(result.datum)),
            },
            {
              term: 'Datum van inslag',
              description: result.datum_inslag && formatDate(new Date(result.datum_inslag)),
            },
            { term: 'Soort handeling', description: result.type as string },
            { term: 'Bron', description: result.bron },
            { term: 'Intekening', description: result.intekening },
            { term: 'Nouwkeurigheid', description: result.nouwkeurig },
            { term: 'Opmerkingen', description: result.opmerkingen },
            {
              term: 'Oorlogsincidentrapport',
              description: result.pdf && getFileName(result.pdf),
              href: result.pdf && result.pdf,
            },
          ],
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
            { term: 'Soort rapportage', description: result.type as string },
            { term: 'Onderzoeksgebied', description: result.onderzoeksgebied },
            { term: 'Opdrachtnemer', description: result.opdrachtnemer },
            { term: 'Opdrachtgever', description: result.opdrachtgever },
            { term: 'Verdacht gebied', description: result.verdacht_gebied },
            {
              term: 'Datum rapport',
              description: result.datum && formatDate(new Date(result.datum)),
            },
          ],
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
            { term: 'Hoofdgroep', description: result.type as string },
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
              description: result.pdf && getFileName(result.pdf),
              href: result.pdf && result.pdf,
            },
          ],
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
              { term: 'Type', description: result.type && formatList(result.type as string[]) },
              { term: 'Aantal', description: result.count },
              { term: 'Noodzaak', description: result.noodzaak && formatList(result.noodzaak) },
              { term: 'Uiterlijk', description: result.uiterlijk && formatList(result.uiterlijk) },
              {
                term: 'Omschrijving',
                description: result.soortPaaltje && formatList(result.soortPaaltje),
              },
              { term: 'Ruimte', description: result.ruimte && formatList(result.ruimte) },
              { term: 'Markering', description: result.markering && formatList(result.markering) },
              { term: 'Soort weg', description: result.soortWeg && formatList(result.soortWeg) },
              { term: 'Status', description: result.paaltjesWeg && formatList(result.paaltjesWeg) },
              {
                term: 'Zichtbaarheid',
                description: result.zichtInDonker && formatList(result.zichtInDonker),
              },
            ],
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
            { term: 'Meer informatie', description: result.url, href: result.url },
          ],
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
            { term: 'Website', description: result.website, href: result.website },
            { term: 'Tarieven', description: result.tarieven, href: result.tarieven },
          ],
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
        getPaginatedListBlock(GLOSSARY.DEFINITIONS.PAND, result?.panden?.href),
        getPaginatedListBlock(GLOSSARY.DEFINITIONS.MEETBOUT, result?.meetbouten),
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
        getPaginatedListBlock(GLOSSARY.DEFINITIONS.BOUWBLOK, result?.bouwblokken?.href),
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
          getPaginatedListBlock(GLOSSARY.DEFINITIONS.BUURT, result?.buurten?.href),
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
          gridArea: '1 / 1 / 1 / 3',
          entries: [
            { term: 'Code', description: result.code },
            { term: 'Gemeente', description: result.gemeente?._display },
          ],
        },
        getPaginatedListBlock(
          GLOSSARY.DEFINITIONS.BUURTCOMBINATIE,
          result?.buurtcombinaties?.href,
          {
            gridArea: '2 / 1 / 3 / 2',
          },
        ),
        getPaginatedListBlock(
          GLOSSARY.DEFINITIONS.GEBIEDSGERICHTWERKEN,
          result?.gebiedsgerichtwerken?.href,
        ),
        ...getShowInTableBlock({
          key: 'stadsdeel_naam',
          value: result.naam,
        }),
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
          getPaginatedListBlock(GLOSSARY.DEFINITIONS.BUURT, result?.buurten?.href),
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
          ],
        },
      ],
    }),
  },
  [endpointTypes.kadastraalObject]: {
    normalization: (result) => kadastraalObject(result),
    type: 'brk/object',
    endpoint: 'brk/object',
    authScopes: [AuthScope.BrkRo],
    authExcludedInfo:
      'koopsom, koopjaar en cultuur (on)bebouwd; zakelijke rechten en aantekeningen',
    mapDetail: (result) => {
      const { brkData } = result
      return {
        title: categoryLabels.kadastraalObject.singular,
        subTitle: result._display,
        infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.OBJECT),
        items: [
          {
            type: DetailResultItemType.DefinitionList,
            entries: [
              {
                term: 'Kadastrale gemeentecode',
                description: result.kadastrale_gemeente?._display,
              },
              { term: 'Sectie', description: result.sectie?.sectie },
              { term: 'Objectnummer', description: result.objectnummer },
              { term: 'Indexletter', description: result.indexletter },
              { term: 'Indexnummer', description: result.indexnummer },
              {
                term: 'Kadastrale gemeente',
                description: result.kadastrale_gemeente?.naam,
              },
              {
                term: 'Gemeente',
                description: result.kadastrale_gemeente?.gemeente._display,
              },
              {
                term: 'Grootte',
                description: result.grootte && `${result.grootte} m²`,
              },
              {
                term: 'Koopsom',
                description: result.koopsom && result.koopsom,
              },
              { term: 'Koopjaar', description: result.koopjaar },
              {
                term: 'Cultuur bebouwd',
                description: result.cultuurcode_bebouwd?.omschrijving,
              },
              {
                term: 'Cultuur onbebouwd',
                description: result.cultuurcode_onbebouwd?.omschrijving,
              },
            ],
          },
          getLinkListBlock(GLOSSARY.DEFINITIONS.ZAKELIJK_RECHT, brkData?.rechten),
          {
            type: DetailResultItemType.BulletList,
            title: GLOSSARY.DEFINITIONS.AANTEKENING.plural,
            entries: brkData?.aantekeningen?.map(({ _display, opgelegd_door }) =>
              opgelegd_door ? `${_display}, opgelegd door: ${opgelegd_door._display}` : _display,
            ),
          },
          getLinkListBlock(GLOSSARY.DEFINITIONS.ONTSTAAN_UIT, brkData?.ontstaan_uit),
          getLinkListBlock(GLOSSARY.DEFINITIONS.BETROKKEN_BIJ, brkData?.betrokken_bij),
          /**
           There is no _adressen.count variable. But this check is still valid, because:
           - A pand has 0-n verblijfsobjecten
           - A verblijfsobject has 1-n adressen
           - An adres is always related to a verblijfsobject
           So; there are no adressen if there are no verblijfsobjecten. And if there are any verblijfsobjecten there must
           be at least one adres for each verblijfsobject as well.
           */
          // @ts-ignore
          result.verblijfsobjecten?.count
            ? getPaginatedListBlock(
                GLOSSARY.DEFINITIONS.NUMMERAANDUIDING,
                result?._adressen?.href,
                {
                  displayFormatter: typeAddressDisplayFormatter,
                },
              )
            : undefined,
        ],
      }
    },
  },
  [endpointTypes.meetbout]: {
    type: 'meetbouten/meetbout',
    endpoint: 'meetbouten/meetbout',
    normalization: meetbout,
    mapDetail: (result) => ({
      title: categoryLabels.meetbout.singular,
      subTitle: result.meetboutidentificatie,
      infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.MEETBOUT),
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            {
              term: 'Status',
              description: result?.status,
            },
            {
              term: 'Adres',
              description: result.adres,
            },
            {
              term: 'Locatie',
              description: result.locatie,
            },
            {
              term: 'Coördinaten',
              description:
                result.geometrie?.coordinates &&
                getRdAndWgs84Coordinates(result.geometrie.coordinates, 'RD'),
            },
            {
              term: 'Bouwblok',
              description: result.bouwblok,
              to: buildDetailUrl(getDetailPageData(result.bouwblok_link)),
            },
            {
              term: 'Bouwblokzijde',
              description: result.bouwblokzijde,
            },
            {
              term: 'Bouwblokeenheid',
              description: result.blokeenheid,
            },
            {
              term: 'Stadsdeel',
              description: result.stadsdeel,
              to: buildDetailUrl(getDetailPageData(result.stadsdeel_link)),
            },
            {
              term: 'Indicatie beveiligd',
              description: result.beveiligd ? 'Ja' : 'Nee',
            },
          ],
        },
        {
          type: DetailResultItemType.PaginatedData,
          pageSize: 10,
          getData: getListFromApi(result?.metingen?.href, meetboutTable),
          title: 'Metingen',
          toView: (data) => ({
            type: DetailResultItemType.Table,
            headings: [
              { title: 'Datum', key: 'datum' },
              { title: 'Hoogte NAP', key: 'hoogte_nap' },
              { title: 'Zakking (mm)', key: 'zakking' },
              { title: 'Zaksnelheid (mm/j)', key: 'zakkingssnelheid' },
              { title: 'Zakking cum. (mm)', key: 'zakking_cumulatief' },
            ],
            values: data,
          }),
        },
        {
          type: DetailResultItemType.Image,
          title: 'Rollaag',
          src: result.rollaagImage,
        },
      ],
    }),
  },
  [endpointTypes.monument]: {
    normalization: monument,
    type: 'monumenten/monumenten',
    endpoint: 'monumenten/monumenten',
    mapDetail: (result) => ({
      title: categoryLabels.monument.singular,
      infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.MONUMENTEN),
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          authExcludedInfo:
            'type, architect en opdrachtgever, bouwjaar, oorspronkelijke functie, beschrijving en redengevende omschrijving',
          authScopes: [AuthScope.MonRdm],
          entries: [
            {
              term: 'Nummer',
              description: result?.monumentnummer,
            },
            {
              term: 'Naam',
              description: result?.monumentnaam,
            },
            {
              term: 'Status',
              description: result?.monumentstatus,
            },
            {
              term: 'Type',
              description: result?.monumenttype,
            },
            {
              term: 'Architect ontwerp',
              description: result?.architect_ontwerp_monument,
            },
            {
              term: 'Opdrachtgever bouw',
              description: result?.opdrachtgever_bouw_monument,
            },
            {
              term: 'Bouwjaar start bouwperiode',
              description: result?.bouwjaar_start_bouwperiode_monument,
            },
            {
              term: 'Oorspronkelijke functie',
              description: result?.oorspronkelijke_functie_monument,
            },
            {
              term: 'In onderzoek',
              description: result?.in_onderzoek === 'J' ? 'Ja' : 'Nee',
            },
            {
              term: 'Beschrijving',
              description: result?.beschrijving_monument,
            },
            {
              term: 'Redengevende omschrijving',
              description: result?.redengevende_omschrijving_monument,
            },
          ],
        },
        getPaginatedListBlock(
          GLOSSARY.DEFINITIONS.COMPLEXEN,
          result.ligt_in_complex?._links?.self?.href,
        ),
        getLinkListBlock(
          GLOSSARY.DEFINITIONS.PAND,
          result.betreft_pand,
          (res: any) => res.pandidentificatie,
        ),
        getPaginatedListBlock(GLOSSARY.DEFINITIONS.ADRES, result.heeft_situeringen?.href, {
          normalize: (data: any[]) =>
            data.map((object) => ({
              ...object,
              _links: object?.betreft_nummeraanduiding?._links,
            })),
          displayFormatter: typeAddressDisplayFormatter,
        }),
      ],
    }),
  },
  [endpointTypes.monumentComplex]: {
    type: 'monumenten/complexen',
    endpoint: 'monumenten/complexen',
    normalization: monument,
    mapDetail: (result) => ({
      title: GLOSSARY.DEFINITIONS.COMPLEXEN.singular,
      subTitle: result._display,
      infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.COMPLEXEN),
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          authScopes: [AuthScope.MonRbc],
          authExcludedInfo: 'beschrijving',
          entries: [
            { term: 'Nummer', description: result.monumentnummer_complex },
            { term: 'Naam', description: result.complexnaam },
            { term: 'Beschrijving', description: result.beschrijving_complex?.trim() },
          ],
        },
        getPaginatedListBlock(GLOSSARY.DEFINITIONS.MONUMENTEN, result.monumenten?.href),
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
          ],
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
            { term: 'Soort', description: result.type as string },
            { term: 'Capaciteit', description: result.charging_capability },
            { term: 'Connectortype', description: result.connector_type },
            { term: 'Status', description: result.currentStatus },
          ],
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
      noPanorama: true,
      infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.PARKEERVAKKEN),
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [{ term: 'Straat', description: result.straatnaam }],
        },
        result.regimes
          ? {
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
              values: result.regimes as any,
            }
          : undefined,
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
          entries: [{ term: 'Omschrijving', description: result.gebied_omschrijving }],
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
          entries: [{ term: 'Omschrijving', description: result.omschrijving }],
        },
      ],
    }),
  },
  [endpointTypes.vastgoed]: {
    type: 'vsd/vastgoed',
    endpoint: 'vsd/vastgoed',
    normalization: vastgoed,
    // We are sure location is set here
    mapDetail: async (result, detailInfo, location) => {
      // TODO: What is happening here is a bit ridiculous, but it was migrated from existing code.
      // Basically we do a GeoSearch which returns all the nearby buildings that are on this location.
      // This will in some cases return a bunch of buildings on the exact same location, since they share the same space (see the Geometery)
      // It's a bit dumb since our initial GeoSearch to see if the user clicked something already returns all of these.
      // Either way this is needed because we need to put some identifier in the URL so it might as well be the first one we find.
      // Technically we should really have some kind of model in the API to hold these collections so we can identify them with a single identifier.
      // Really more of a task for the API team to figure this one out...

      const { features } = await fetchWithToken(
        `${environment.API_ROOT}geosearch/vastgoed/?${new URLSearchParams({
          ...(location ? { lat: location.lat.toString(), lon: location.lng.toString() } : {}),
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
        ],
      }))

      return {
        title: 'Gemeentelijk eigendom',
        subTitle: result._display,
        items: [
          {
            type: DetailResultItemType.DefinitionList,
            entries: [
              { term: 'Bouwjaar', description: result.construction_year },
              { term: 'Aantal verhuurde eenheden', description: `${additionalItems.length}` },
              { term: 'Monumentstatus', description: result.monumental_status },
              { term: 'Status', description: result.status },
            ],
          },
          {
            type: DetailResultItemType.GroupedItems,
            title: `Verhuurde eenheden (${additionalItems.length})`,
            entries: additionalItems,
          },
        ],
      }
    },
  },
  [endpointTypes.vestiging]: {
    type: 'handelsregister/vestiging',
    endpoint: 'handelsregister/vestiging',
    definition: GLOSSARY.DEFINITIONS.VESTIGING,
    authScopes: [AuthScope.HrR],
    authScopeRequired: true,
    normalization: vestiging,
    mapDetail: (result) => {
      const notifications: DetailResultNotification[] = []

      if (result.bijzondereRechtstoestand && result.bijzondereRechtstoestand.title) {
        notifications.push({
          id: 1,
          value:
            result.bijzondereRechtstoestand && result.bijzondereRechtstoestand.title
              ? result.bijzondereRechtstoestand.title
              : false,
          level: NotificationLevel.Error,
        })
      }

      return {
        notifications,
        title: categoryLabels.vestiging.singular,
        subTitle: result._display,
        infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.VESTIGING),
        items: [
          {
            type: DetailResultItemType.DefinitionList,
            entries: [
              {
                term: 'Eerste handelsnaam',
                description: result.naam,
              },
              {
                term: 'KvK-nummer',
                description:
                  result.maatschappelijke_activiteit &&
                  // @ts-ignore
                  result.maatschappelijke_activiteit.match(/([^/]*)\/*$/)[1],
              },
              {
                term: 'Vestigingsnummer',
                description: result.vestigingsnummer,
              },
              {
                term: 'Type vestiging',
                // eslint-disable-next-line no-nested-ternary
                description: result.hoofdvestiging
                  ? 'Hoofdvestiging'
                  : !result.hoofdvestiging
                  ? 'Nevenvestiging'
                  : '',
              },
              {
                term: 'Postadres',
                description: result.postadres?.volledig_adres,
                alert:
                  result.postadres?.correctie &&
                  `Officieel BAG-adres niet bekend, schatting: ${result.postadres?.query_string}`,
              },
              {
                term: 'Bezoekadres',
                description: result.bezoekadres?.volledig_adres,
                alert:
                  result.bezoekadres?.correctie &&
                  `Officieel BAG-adres niet bekend, schatting: ${result.bezoekadres?.query_string}`,
              },
              {
                term: 'SBI-code en -omschrijving',
                description: result.activiteiten
                  ?.map(({ sbi_code, sbi_omschrijving }) => `${sbi_code}: ${sbi_omschrijving}`)
                  .join(', '),
              },
              {
                term: 'Datum aanvang',
                description:
                  result.datum_aanvang &&
                  new Date(result.datum_aanvang).toLocaleDateString(DEFAULT_LOCALE, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  }),
              },
              {
                term: 'Soort bijzondere rechtstoestand',
                // eslint-disable-next-line no-nested-ternary
                description: result._bijzondere_rechts_toestand?.faillissement
                  ? 'Faillissement'
                  : result._bijzondere_rechts_toestand?.status === 'Voorlopig' ||
                    result._bijzondere_rechts_toestand?.status === 'Definitief'
                  ? 'Surseance van betaling'
                  : '',
              },
              {
                term: 'Coördinaten',
                description:
                  result.bezoekadres?.geometrie?.coordinates &&
                  getRdAndWgs84Coordinates(result.bezoekadres.geometrie.coordinates, 'RD'),
              },
            ],
          },
          {
            type: DetailResultItemType.LinkList,
            title: GLOSSARY.DEFINITIONS.MAATSCHAPPELIJKEACTIVITEIT.singular,
            infoBox: getInfoBox(GLOSSARY.DEFINITIONS.MAATSCHAPPELIJKEACTIVITEIT),
            links: [
              {
                title: result.naam,
                to: buildDetailUrl(getDetailPageData(result.maatschappelijke_activiteit)),
              },
            ],
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
          id: 1,
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
          ],
        },
      ],
    }),
  },
  [endpointTypes.kadastraalSubject]: {
    type: 'brk/subject',
    endpoint: 'brk/subject',
    definition: GLOSSARY.DEFINITIONS.SUBJECT,
    authScopes: [AuthScope.BrkRs],
    authScopeRequired: true,
    authExcludedInfo: `kadastrale subjecten. Om ook zakelijke rechten van natuurlijke personen te bekijken, moet je als medewerker bovendien speciale bevoegdheden hebben`,
    mapDetail: (result) => {
      const zakelijkRechtNormalizer = (res: { object_href?: string }[]) =>
        res?.map((obj) => ({
          ...obj,
          _links: {
            self: {
              href: obj.object_href,
            },
          },
        }))
      return {
        title: categoryLabels.kadastraalSubject.singular,
        subTitle: result._display,
        infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.SUBJECT),
        items: [
          !result?.is_natuurlijk_persoon
            ? {
                type: DetailResultItemType.DefinitionList,
                entries: [
                  {
                    term: 'Statutaire zetel',
                    description: result.statutaire_zetel,
                  },
                  {
                    term: 'Rechtsvorm',
                    description: result.rechtsvorm?.omschrijving,
                  },
                  {
                    term: 'RSIN',
                    description: result.rsin,
                  },
                  {
                    term: 'KvK nummer',
                    description: result.kvknummer,
                  },
                  {
                    term: 'Woonadres',
                    description:
                      result.woonadres?.openbareruimte_naam &&
                      `${result.woonadres?.openbareruimte_naam} ${result.woonadres?.huisnummer} ${result.woonadres?.huisletter} ${result.woonadres?.toevoeging} ${result.woonadres?.postcode} ${result.woonadres?.woonplaats}`,
                  },
                  {
                    term: 'Woonadres buitenland',
                    description:
                      result.woonadres?.buitenland_adres &&
                      `${result.woonadres?.buitenland_adres} ${result.woonadres?.buitenland_woonplaats} ${result.woonadres?.buitenland_naam} ${result.woonadres?.buitenland_land?.omschrijving}`,
                  },
                  {
                    term: 'Postadres',
                    description:
                      result.postadres?.openbareruimte_naam &&
                      `${result.postadres?.openbareruimte_naam} ${result.postadres?.huisnummer} ${result.postadres?.huisletter} ${result.postadres?.toevoeging} ${result.postadres?.woonplaats}`,
                  },
                  {
                    term: 'Postadres buitenland',
                    description:
                      result.postadres?.buitenland_adres &&
                      `${result.postadres?.buitenland_adres} ${result.postadres?.buitenland_woonplaats} ${result.postadres?.buitenland_naam} ${result.postadres?.buitenland_land?.omschrijving}`,
                  },
                  {
                    term: 'Postadres postbus',
                    description:
                      result.postadres?.postbus_nummer &&
                      `Postbus ${result.postadres?.postbus_nummer} ${result.postadres?.postbus_postcode} ${result.postadres?.postbus_woonplaats}`,
                  },
                ],
              }
            : undefined,
          result.is_natuurlijk_persoon
            ? {
                type: DetailResultItemType.DefinitionList,
                entries: [
                  {
                    term: 'Voornamen',
                    description: result.voornamen,
                  },
                  {
                    term: 'Voorvoegsels',
                    description: result.voorvoegsels,
                  },
                  {
                    term: 'Geslachtsnaam',
                    description: result.naam,
                  },
                  {
                    term: 'Geslacht',
                    description: result.geslacht?.omschrijving,
                  },
                  {
                    term: 'Geboortedatum',
                    description:
                      result.geboortedatum &&
                      new Date(result.geboortedatum).toLocaleDateString(DEFAULT_LOCALE, {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                      }),
                  },
                  {
                    term: 'Geboorteplaats',
                    description: result.geboorteplaats,
                  },
                  {
                    term: 'Geboorteland',
                    description: result.geboorteland?.omschrijving,
                  },
                  {
                    term: 'Datum van overlijden',
                    description:
                      result.overlijdensdatum &&
                      new Date(result.overlijdensdatum).toLocaleDateString(DEFAULT_LOCALE, {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                      }),
                  },
                  {
                    term: 'Woonadres',
                    description: `${result.woonadres?.openbareruimte_naam} ${result.woonadres?.huisnummer} ${result.woonadres?.huisletter} ${result.woonadres?.toevoeging} ${result.woonadres?.postcode} ${result.woonadres?.woonplaats}`,
                  },
                  {
                    term: 'Woonadres buitenland',
                    description:
                      result.woonadres?.buitenland_adres &&
                      `${result.woonadres?.buitenland_adres} ${result.woonadres?.buitenland_woonplaats} ${result.woonadres?.buitenland_naam} ${result.woonadres?.buitenland_land?.omschrijving}`,
                  },
                  {
                    term: 'Postadres',
                    description:
                      result.postadres?.openbareruimte_naam &&
                      `${result.postadres?.openbareruimte_naam} ${result.postadres?.huisnummer} ${result.postadres?.huisletter} ${result.postadres?.toevoeging} ${result.postadres?.postcode} ${result.postadres?.woonplaats}`,
                  },
                  {
                    term: 'Postadres buitenland',
                    description:
                      result.postadres?.buitenland_adres &&
                      `${result.postadres?.buitenland_adres} ${result.postadres?.buitenland_woonplaats} ${result.postadres?.buitenland_naam} ${result.postadres?.buitenland_land?.omschrijving}`,
                  },
                  {
                    term: 'Postadres postbus',
                    description:
                      result.postadres?.postbus_nummer &&
                      `Postbus ${result.postadres?.postbus_nummer} ${result.postadres?.postbus_postcode} ${result.postadres?.postbus_woonplaats}`,
                  },
                ],
              }
            : undefined,
          getPaginatedListBlock(
            GLOSSARY.DEFINITIONS.ZAKELIJK_RECHT,
            result.rechten?.href,
            result?.is_natuurlijk_persoon
              ? {
                  authScopes: [AuthScope.BrkRsn],
                  authScopeRequired: true,
                  specialAuthLevel: true,
                  normalize: zakelijkRechtNormalizer,
                }
              : {
                  normalize: zakelijkRechtNormalizer,
                },
          ),
        ],
      }
    },
  },
  [endpointTypes.maatschappelijkeActiviteiten]: {
    type: 'handelsregister/maatschappelijkeactiviteit',
    endpoint: 'handelsregister/maatschappelijkeactiviteit',
    definition: GLOSSARY.DEFINITIONS.MAATSCHAPPELIJKEACTIVITEIT,
    authScopes: [AuthScope.HrR],
    authScopeRequired: true,
    normalization: async (data) => {
      if (data.eigenaar) {
        const extraData = await fetchWithToken(data.eigenaar)
        const functieVervullingUrl = extraData?.heeft_aansprakelijke?.href
        return {
          ...data,
          functieVervullingUrl,
        }
      }

      return data
    },
    mapDetail: (result) => ({
      title: categoryLabels.mac.singular,
      subTitle: result._display,
      infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.MAATSCHAPPELIJKEACTIVITEIT),
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            {
              term: 'Handelsnaam',
              description:
                result.onderneming?.handelsnamen
                  ?.map(({ handelsnaam }) => handelsnaam)
                  ?.join(', ') || result.naam,
            },
            {
              term: 'KvK-nummer',
              description: result.kvk_nummer,
            },
            {
              term: 'Postadres',
              description: result.postadres?.volledig_adres,
              alert:
                result.postadres?.correctie &&
                `Officieel BAG-adres niet bekend, schatting: ${result.postadres.query_string}`,
            },
            {
              term: 'Bezoekadres',
              description: result.bezoekadres?.volledig_adres,
              alert:
                result.bezoekadres?.correctie &&
                `Officieel BAG-adres niet bekend, schatting: ${result.bezoekadres.query_string}`,
            },
            {
              term: 'Datum aanvang',
              description:
                result.datum_aanvang &&
                new Date(result.datum_aanvang).toLocaleDateString(DEFAULT_LOCALE, {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                }),
            },
            {
              term: 'Soort bijzondere rechtstoestand',
              // eslint-disable-next-line no-nested-ternary
              description: result._bijzondere_rechts_toestand?.faillissement
                ? 'Faillissement'
                : result._bijzondere_rechts_toestand?.status === 'Voorlopig' ||
                  result._bijzondere_rechts_toestand?.status === 'Definitief'
                ? 'Surseance van betaling'
                : '',
            },
          ],
        },
        result.functieVervullingUrl
          ? getPaginatedListBlock(
              GLOSSARY.DEFINITIONS.FUNCTIEVERVULLING,
              result.functieVervullingUrl,
            )
          : undefined,
        result.vestigingen?.href
          ? getPaginatedListBlock(GLOSSARY.DEFINITIONS.VESTIGING, result.vestigingen.href)
          : undefined,
      ],
    }),
  },
  [endpointTypes.woonplaats]: {
    type: 'bag/woonplaats',
    endpoint: 'bag/v1.1/woonplaats',
    mapDetail: (result) => ({
      title: 'Woonplaats',
      subTitle: result._display,
      noPanorama: true,
      infoBox: getMainMetaBlock(result, GLOSSARY.DEFINITIONS.WOONPLAATS),
      items: [
        result.openbare_ruimtes
          ? getPaginatedListBlock(
              GLOSSARY.DEFINITIONS.OPENBARERUIMTE,
              result.openbare_ruimtes.href,
              {
                pageSize: 25,
              },
            )
          : undefined,
      ],
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
          ],
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
          ],
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
          ],
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
          ],
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
          ],
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
  .map((service) => service.type as string)
  .filter((type) => !!type)

export function isGenericTemplate(templateUrl?: string) {
  if (!templateUrl) {
    return templateUrl
  }

  // @ts-ignore
  return genericDetailTypes.some((type) => templateUrl.includes(type))
}
