import { routing } from '../../../app/routes'
import { BoundingBox, FilterObject } from '../../../app/components/DataSelection/types'
import getBrkMarkers from './getBrkMarkers'
import getMarkers from './getMarkers'

export interface LegacyDataSelectionConfigType {
  CUSTOM_API: {
    getMarkers: (
      signal: AbortSignal,
      config: LegacyDataSelectionConfigType,
      activeAttributeFilters: FilterObject,
      zoomLevel?: number,
      boundingBox?: BoundingBox,
    ) => Promise<any>
  }
  AUTH_SCOPE?: string
  PATH?: string
  MAX_AVAILABLE_PAGES?: number
  MAX_ITEMS_PER_PAGE?: number
  MAX_NUMBER_OF_CLUSTERED_MARKERS: number
  ENDPOINT_PREVIEW:
    | string
    | {
        TABLE: string
        LIST: string
      }
  ENDPOINT_MARKERS: string
  ENDPOINT_EXPORT: string
  ENDPOINT_DETAIL: string
  ENDPOINT_EXPORT_PARAM?: string
  PRIMARY_KEY: 'vestiging_id' | 'landelijk_id' | 'kadastraal_object_id'
  TITLE: string
  TITLE_TAB: string
  SHOW_NUMBER_OF_RECORDS: boolean
  SHOW_FILTER_OPTION_COUNTS?: boolean
  SORT_FILTERS: boolean
  FILTERS: Array<{
    slug: string
    label: string
    order?: string[]
    info_url?: string
    formatter?: string
  }>
  CONTENT: {
    TABLE: Array<{
      label: string
      variables: string[]
      template?: string
      formatter?: string
    }>
    LIST: Array<{
      variables: string[]
      formatter?: string
    }>
  }
}

const DATA_SELECTION_CONFIG: {
  datasets: {
    bag: LegacyDataSelectionConfigType
    brk: LegacyDataSelectionConfigType
    hr: LegacyDataSelectionConfigType
  }
} = {
  datasets: {
    bag: {
      CUSTOM_API: {
        getMarkers,
      },
      PATH: routing.addresses.path,
      MAX_AVAILABLE_PAGES: 100,
      MAX_NUMBER_OF_CLUSTERED_MARKERS: 10000,
      ENDPOINT_PREVIEW: 'dataselectie/bag/',
      ENDPOINT_MARKERS: 'dataselectie/bag/geolocation/',
      ENDPOINT_EXPORT: 'dataselectie/bag/export/',
      ENDPOINT_DETAIL: 'bag/nummeraanduiding/',
      PRIMARY_KEY: 'landelijk_id',
      TITLE: 'Adressen',
      TITLE_TAB: 'Adressen',
      SHOW_NUMBER_OF_RECORDS: true,
      SORT_FILTERS: false,
      FILTERS: [
        {
          slug: 'woonplaats',
          label: 'Woonplaats',
        },
        {
          slug: 'stadsdeel_naam',
          label: 'Stadsdeel',
        },
        {
          slug: 'ggw_naam',
          label: 'GGW-gebied',
        },
        {
          slug: 'buurtcombinatie_naam',
          label: 'Wijk',
        },
        {
          slug: 'buurt_naam',
          label: 'Buurt',
        },
        {
          slug: 'openbare_ruimte',
          label: 'Openbare ruimte',
        },
        {
          slug: 'postcode',
          label: 'Postcode',
        },
      ],
      CONTENT: {
        TABLE: [
          {
            label: 'Naam openbare ruimte',
            variables: ['_openbare_ruimte_naam'],
          },
          {
            label: 'Num.',
            variables: ['huisnummer'],
          },
          {
            label: 'Let.',
            variables: ['huisletter'],
          },
          {
            label: 'Toev.',
            variables: ['huisnummer_toevoeging'],
          },
          {
            label: 'Postcode',
            variables: ['postcode'],
          },
          {
            label: 'Woonplaats',
            variables: ['woonplaats'],
          },
          {
            label: 'Stadsdeel',
            variables: ['stadsdeel_naam'],
          },
          {
            label: 'Stadsdeel-code',
            variables: ['stadsdeel_code'],
          },
          {
            label: 'GGW-gebied',
            variables: ['ggw_naam'],
          },
          {
            label: 'GGW-code',
            variables: ['ggw_code'],
          },
          {
            label: 'Wijk',
            variables: ['buurtcombinatie_naam'],
          },
          {
            label: 'Wijk-code',
            variables: ['buurtcombinatie_code'],
          },
          {
            label: 'Buurt',
            variables: ['buurt_naam'],
          },
          {
            label: 'Buurt-code',
            variables: ['buurt_code'],
          },
        ],
        LIST: [
          {
            variables: [
              '_openbare_ruimte_naam',
              'huisnummer',
              'huisletter',
              'huisnummer_toevoeging',
            ],
            formatter: 'bagAddress',
          },
          {
            variables: ['ligplaats_id', 'standplaats_id'],
            formatter: 'nummeraanduidingType',
          },
          {
            variables: ['hoofdadres'],
            formatter: 'nevenadres',
          },
          {
            variables: ['status_id'],
            formatter: 'verblijfsobjectGevormd',
          },
        ],
      },
    },
    brk: {
      AUTH_SCOPE: 'BRK/RSN',
      CUSTOM_API: {
        // @ts-ignore
        getMarkers: getBrkMarkers,
      },
      PATH: routing.cadastralObjects.path,
      MAX_AVAILABLE_PAGES: 100,
      MAX_NUMBER_OF_CLUSTERED_MARKERS: Infinity,
      ENDPOINT_PREVIEW: {
        TABLE: 'dataselectie/brk/',
        LIST: 'dataselectie/brk/kot/',
      },
      ENDPOINT_MARKERS: 'dataselectie/brk/geolocation/',
      ENDPOINT_EXPORT: 'dataselectie/brk/export/',
      ENDPOINT_DETAIL: 'brk/object/',
      PRIMARY_KEY: 'kadastraal_object_id',
      TITLE: 'Kadastrale objecten met zakelijk rechthebbenden',
      TITLE_TAB: 'Kadastrale objecten',
      SHOW_NUMBER_OF_RECORDS: false,
      SORT_FILTERS: false,
      FILTERS: [
        {
          slug: 'eigenaar_type',
          label: 'Type zakelijk gerechtigde',
          order: ['Grondeigenaar', 'Pandeigenaar', 'Appartementseigenaar'],
          info_url: 'https://www.amsterdam.nl/stelselpedia/brk-index/producten-brk/kadastertabel/',
        },
        {
          slug: 'eigenaar_cat',
          label: 'Zakelijk gerechtigde',
          order: [
            'Gemeente Amsterdam',
            'Overige gemeenten',
            'Staat',
            'Provincies',
            'Waterschappen',
            'Woningbouwcorporaties',
            'Verenigingen van eigenaren',
            'Spoorwegen/ProRail',
            'Overige niet-natuurlijke personen',
            'Overige natuurlijke personen',
          ],
          info_url: 'https://www.amsterdam.nl/stelselpedia/brk-index/producten-brk/kadastertabel/',
        },
        {
          slug: 'woonplaats',
          label: 'Woonplaats',
        },
        {
          slug: 'stadsdeel_naam',
          label: 'Stadsdeel',
        },
        {
          slug: 'ggw_naam',
          label: 'GGW-gebied',
        },
        {
          slug: 'buurtcombinatie_naam',
          label: 'Wijk',
        },
        {
          slug: 'buurt_naam',
          label: 'Buurt',
        },
      ],
      CONTENT: {
        TABLE: [
          {
            label: 'Kad. object',
            variables: ['aanduiding'],
          },
          {
            label: '-eerste adres',
            variables: ['eerste_adres'],
          },
          {
            label: 'Kad. gemeente',
            variables: ['kadastrale_gemeentenaam'],
          },
          {
            label: 'Gemeente',
            variables: ['burgerlijke_gemeentenaam'],
          },
          {
            label: 'Zakelijk recht: aard',
            variables: ['aard_zakelijk_recht'],
          },
          {
            label: '-aandeel',
            variables: ['zakelijk_recht_aandeel'],
          },
          {
            label: 'Natuurlijk persoon: naam',
            variables: ['sjt_naam'],
          },
          {
            label: '-datum overlijden',
            variables: ['sjt_datum_overlijden'],
            formatter: 'date',
          },
          {
            label: 'Niet-natuurlijk persoon: statutaire naam',
            variables: ['sjt_statutaire_naam'],
          },
          {
            label: '-rechtsvorm',
            variables: ['sjt_statutaire_rechtsvorm'],
          },
        ],
        LIST: [{ variables: ['aanduiding'] }],
      },
    },
    hr: {
      CUSTOM_API: {
        getMarkers,
      },
      AUTH_SCOPE: 'HR/R',
      PATH: routing.establishments.path,
      MAX_AVAILABLE_PAGES: 100,
      MAX_NUMBER_OF_CLUSTERED_MARKERS: 10000,
      ENDPOINT_PREVIEW: 'dataselectie/hr/',
      ENDPOINT_MARKERS: 'dataselectie/hr/geolocation/',
      ENDPOINT_EXPORT: 'dataselectie/hr/export/',
      ENDPOINT_EXPORT_PARAM: 'dataset=ves',
      ENDPOINT_DETAIL: 'handelsregister/vestiging/',
      PRIMARY_KEY: 'vestiging_id',
      TITLE: 'Vestigingen',
      TITLE_TAB: 'Vestigingen',
      SHOW_NUMBER_OF_RECORDS: true,
      SORT_FILTERS: false,
      FILTERS: [
        {
          slug: 'sbi_code',
          label: 'SBI-code',
        },
        {
          slug: 'sbi_l2',
          label: 'SBI-L2',
        },
        {
          slug: 'sbi_l3',
          label: 'SBI-L3',
        },
        {
          slug: 'sbi_l4',
          label: 'SBI-L4',
        },
        {
          slug: 'sbi_l5',
          label: 'SBI-L5',
        },
        {
          slug: 'bijzondere_rechtstoestand',
          label: 'Bijzondere rechtstoestand',
        },
        {
          slug: 'woonplaats',
          label: 'Woonplaats',
        },
        {
          slug: 'stadsdeel_naam',
          label: 'Stadsdeel',
        },
        {
          slug: 'ggw_naam',
          label: 'GGW-gebied',
        },
        {
          slug: 'buurtcombinatie_naam',
          label: 'Wijk',
        },
        {
          slug: 'buurt_naam',
          label: 'Buurt',
        },
        {
          slug: 'openbare_ruimte',
          label: 'Openbare ruimte',
        },
        {
          slug: 'postcode',
          label: 'Postcode',
        },
      ],
      CONTENT: {
        TABLE: [
          {
            label: 'KvK-num.',
            variables: ['kvk_nummer'],
          },
          {
            label: 'Handelsnaam',
            variables: ['handelsnaam', 'bijzondere_rechtstoestand'],
            template: 'handelsnaam',
          },
          {
            label: 'SBI-code',
            variables: ['sbi_code'],
          },
          {
            label: 'SBI-omschrijving',
            variables: ['sbi_omschrijving'],
            template: 'sbi-omschrijving',
          },
          {
            label: 'Bezoekadres',
            variables: ['bezoekadres_volledig_adres', 'non_mailing'],
            formatter: 'hrBezoekadres',
            template: 'bezoekadres',
          },
        ],
        LIST: [
          {
            variables: ['handelsnaam'],
          },
        ],
      },
    },
  },
}

export default DATA_SELECTION_CONFIG
