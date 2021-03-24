import brkApi from './data-selection-api-brk'
import dataSelectionApi from './data-selection-api-data-selection'
import dcatApi from './data-selection-api-dcatd'
import { routing } from '../../../app/routes'

const DATA_SELECTION_CONFIG = {
  datasets: {
    bag: {
      CUSTOM_API: dataSelectionApi,
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
          slug: 'stadsdeel_naam',
          label: 'Stadsdeel',
        },
        {
          slug: 'woonplaats',
          label: 'Woonplaats',
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
            label: '-code',
            variables: ['stadsdeel_code'],
          },
          {
            label: 'GGW-gebied',
            variables: ['ggw_naam'],
          },
          {
            label: '-code',
            variables: ['ggw_code'],
          },
          {
            label: 'Wijk',
            variables: ['buurtcombinatie_naam'],
          },
          {
            label: '-code',
            variables: ['buurtcombinatie_code'],
          },
          {
            label: 'Buurt',
            variables: ['buurt_naam'],
          },
          {
            label: '-code',
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
        MAP: [
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
      CUSTOM_API: brkApi,
      PATH: routing.cadastralObjects.path,
      MAX_AVAILABLE_PAGES: 100,
      MAX_NUMBER_OF_CLUSTERED_MARKERS: Infinity,
      ENDPOINT_PREVIEW: {
        TABLE: 'dataselectie/brk/',
        LIST: 'dataselectie/brk/kot/',
        MAP: 'dataselectie/brk/kot/',
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
          slug: 'stadsdeel_naam',
          label: 'Stadsdeel',
        },
        {
          slug: 'woonplaats',
          label: 'Woonplaats',
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
        MAP: [{ variables: ['aanduiding'] }],
      },
    },
    hr: {
      CUSTOM_API: dataSelectionApi,
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
          slug: 'stadsdeel_naam',
          label: 'Stadsdeel',
        },
        {
          slug: 'woonplaats',
          label: 'Woonplaats',
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
        MAP: [
          {
            variables: ['handelsnaam'],
          },
        ],
      },
    },
    dcatd: {
      MAX_ITEMS_PER_PAGE: 100,
      CUSTOM_API: dcatApi,
      ENDPOINT_METADATA: 'dcatd/openapi',
      ENDPOINT_PREVIEW: 'dcatd/datasets',
      ENDPOINT_DETAIL: 'dcatd/datasets',
      TITLE: 'Catalogus',
      TITLE_TAB: 'Catalogus',
      SHOW_NUMBER_OF_RECORDS: true,
      PRIMARY_KEY: 'dct:identifier',
      SHOW_FILTER_OPTION_COUNTS: false,
      SORT_FILTERS: true,
      FILTERS: [
        {
          slug: 'status',
          label: 'Status',
        },
        {
          slug: 'groups',
          label: "Thema's",
        },
        {
          slug: 'owners',
          label: 'Eigenaar',
        },
        {
          slug: 'distributionTypes',
          label: 'Verschijningsvorm',
        },
        {
          slug: 'serviceTypes',
          label: 'API/Service formaten',
        },
        {
          slug: 'formats',
          label: 'Bestandsformaten',
          formatter: 'lowercase',
        },
      ],
      CONTENT: {
        CATALOG: [],
      },
    },
  },
}

export default DATA_SELECTION_CONFIG
