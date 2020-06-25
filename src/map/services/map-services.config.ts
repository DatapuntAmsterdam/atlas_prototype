import NotificationLevel from '../../app/models/notification'
import { DetailResult, DetailResultItemType } from '../types/details'
import adressenNummeraanduiding from './adressen-nummeraanduiding/adressen-nummeraanduiding'
import categoryLabels from './map-search/category-labels'
import {
  adressenPand,
  adressenVerblijfsobject,
  bekendmakingen,
  evenementen,
  explosieven,
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
  constructionFiles: 'iiif-metadata/bouwdossier/',
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
  precarioShips: 'v1/precariobelasting/woonschepen/',
  precarioComVessels: 'v1/precariobelasting/bedrijfsvaartuigen/',
  precarioPassVessels: 'v1/precariobelasting/passagiersvaartuigen/',
  precarioTerraces: 'v1/precariobelasting/terrassen/',
  reclamebelasting: 'vsd/reclamebelasting/',
  vastgoed: 'vsd/vastgoed',
  vestiging: 'handelsregister/vestiging/',
  winkelgebied: 'vsd/winkgeb',
  wkpbBeperking: 'wkpb/beperking',
  wkpbUitreksel: 'brk/object-wkpb',
  woonplaats: 'bag/v1.1/woonplaats',
}

export interface ServiceDefinition {
  authScope?: string
  normalization?: (result: any) => any
  mapDetail: (result: any) => DetailResult
}

const servicesByEndpointType: { [type: string]: ServiceDefinition } = {
  [endpointTypes.adressenLigplaats]: {
    mapDetail: (result) => ({
      title: 'Adres (ligplaats)',
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.Default,
          label: 'Indicatie geconstateerd',
          value: result.indicatie_geconstateerd ? 'Ja' : 'Nee',
          status: result.indicatie_geconstateerd ? NotificationLevel.Error : '',
        },
        {
          type: DetailResultItemType.Default,
          label: 'Aanduiding in onderzoek',
          value: result.aanduiding_in_onderzoek ? 'Ja' : 'Nee',
          status: result.aanduiding_in_onderzoek ? NotificationLevel.Error : '',
        },
      ],
      notifications: [
        {
          value: result.indicatie_geconstateerd ? 'Indicatie geconstateerd' : false,
          level: NotificationLevel.Error,
        },
        {
          value: result.aanduiding_in_onderzoek ? 'In onderzoek' : false,
          level: NotificationLevel.Error,
        },
      ],
    }),
  },
  [endpointTypes.adressenNummeraanduiding]: {
    normalization: adressenNummeraanduiding,
    mapDetail: (result) => ({
      title: 'Adres (verblijfsobject)',
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.Default,
          label: 'Gebruiksdoel',
          value: result.verblijfsobject ? result.verblijfsobject.gebruiksdoelen : false,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Soort object (feitelijk gebruik)',
          value: result.verblijfsobject ? result.verblijfsobject.gebruik : false,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Status',
          value: result.verblijfsobject ? result.verblijfsobject.status : false,
          status: result.verblijfsobject && result.verblijfsobject.statusLevel,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Type adres',
          value: result.type_adres,
          status: result.isNevenadres ? NotificationLevel.Attention : '',
        },
        {
          type: DetailResultItemType.Default,
          label: 'Indicatie geconstateerd',
          value: result.indicatie_geconstateerd ? 'Ja' : 'Nee',
          status: result.indicatie_geconstateerd ? NotificationLevel.Error : '',
        },
        {
          type: DetailResultItemType.Default,
          label: 'Aanduiding in onderzoek',
          value: result.aanduiding_in_onderzoek ? 'Ja' : 'Nee',
          status: result.aanduiding_in_onderzoek ? NotificationLevel.Error : '',
        },
        {
          type: DetailResultItemType.Default,
          label: 'Oppervlakte',
          value: result.verblijfsobject ? result.verblijfsobject.size : false,
        },
      ],
      notifications: [
        {
          value:
            result.verblijfsobject && result.verblijfsobject.statusLevel
              ? `Status: ${result.verblijfsobject.status}`
              : false,
          level: result.verblijfsobject && result.verblijfsobject.statusLevel,
        },
        {
          value: result.isNevenadres ? 'Dit is een nevenadres' : false,
          level: NotificationLevel.Attention,
        },
        {
          value: result.indicatie_geconstateerd ? 'Indicatie geconstateerd' : false,
          level: NotificationLevel.Error,
        },
        {
          value: result.aanduiding_in_onderzoek ? 'In onderzoek' : false,
          level: NotificationLevel.Error,
        },
      ],
    }),
  },
  [endpointTypes.adressenVerblijfsobject]: {
    normalization: adressenVerblijfsobject,
    mapDetail: (result) => ({
      title: 'Adres (verblijfsobject)',
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.Default,
          label: 'Gebruiksdoel',
          value: result.gebruiksdoelen,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Soort object (feitelijk gebruik)',
          value: result.gebruik || '',
        },
        {
          type: DetailResultItemType.Default,
          label: 'Status',
          value: result.status ? result.status : false,
          status: result.statusLevel,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Type adres',
          value: result.typeAdres,
          status: result.isNevenadres ? NotificationLevel.Attention : '',
        },
        {
          type: DetailResultItemType.Default,
          label: 'Indicatie geconstateerd',
          value: result.indicatie_geconstateerd ? 'Ja' : 'Nee',
          status: result.indicatie_geconstateerd ? NotificationLevel.Error : '',
        },
        {
          type: DetailResultItemType.Default,
          label: 'Aanduiding in onderzoek',
          value: result.aanduiding_in_onderzoek ? 'Ja' : 'Nee',
          status: result.aanduiding_in_onderzoek ? NotificationLevel.Error : '',
        },
        {
          type: DetailResultItemType.Default,
          label: 'Oppervlakte',
          value: result.size,
        },
      ],
      notifications: [
        {
          type: DetailResultItemType.Default,
          value: result.statusLevel ? `Status: ${result.status}` : false,
          level: result.statusLevel,
        },
        {
          type: DetailResultItemType.Default,
          value: result.isNevenadres ? 'Dit is een nevenadres' : false,
          level: NotificationLevel.Attention,
        },
        {
          type: DetailResultItemType.Default,
          value: result.indicatie_geconstateerd ? 'Indicatie geconstateerd' : false,
          level: NotificationLevel.Error,
        },
        {
          type: DetailResultItemType.Default,
          value: result.aanduiding_in_onderzoek ? 'In onderzoek' : false,
          level: NotificationLevel.Error,
        },
      ],
    }),
  },
  [endpointTypes.adressenOpenbareRuimte]: {
    mapDetail: (result) => ({
      title: result.type,
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.Default,
          label: 'Naam 24-posities (NEN)',
          value: result.naam_24_posities,
        },
      ],
    }),
  },
  [endpointTypes.adressenPand]: {
    normalization: adressenPand,
    mapDetail: (result) => ({
      title: categoryLabels.pand.singular,
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.Default,
          label: 'Oorspronkelijk bouwjaar',
          value: result.year,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Naam',
          value: result.pandnaam,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Status',
          value: result.status ? result.status : false,
          status: result.statusLevel,
        },
      ],
      notifications: [
        {
          value: result.statusLevel ? result.status : false,
          level: result.statusLevel ? result.statusLevel : '',
        },
      ],
    }),
  },
  [endpointTypes.adressenStandplaats]: {
    mapDetail: (result) => ({
      title: 'Adres (standplaats)',
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.Default,
          label: 'Indicatie geconstateerd',
          value: result.indicatie_geconstateerd ? 'Ja' : 'Nee',
          status: result.indicatie_geconstateerd ? NotificationLevel.Error : '',
        },
        {
          type: DetailResultItemType.Default,
          label: 'Aanduiding in onderzoek',
          value: result.aanduiding_in_onderzoek ? 'Ja' : 'Nee',
          status: result.aanduiding_in_onderzoek ? NotificationLevel.Error : '',
        },
      ],
      notifications: [
        {
          value: result.indicatie_geconstateerd ? 'Indicatie geconstateerd' : false,
          level: NotificationLevel.Error,
        },
        {
          value: result.aanduiding_in_onderzoek ? 'In onderzoek' : false,
          level: NotificationLevel.Error,
        },
      ],
    }),
  },
  [endpointTypes.bedrijfsinvesteringszone]: {
    mapDetail: (result) => ({
      title: categoryLabels.bedrijfsinvesteringszone.singular,
      subTitle: result._display,
      items: [
        { type: DetailResultItemType.Default, label: 'Type', value: result.biz_type },
        {
          type: DetailResultItemType.Default,
          label: 'Heffingsgrondslag',
          value: result.heffingsgrondslag,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Jaarlijkse heffing',
          value: result.heffing_display,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Aantal heffingsplichtigen',
          value: result.bijdrageplichtigen,
        },
      ],
    }),
  },
  [endpointTypes.bekendmakingen]: {
    normalization: bekendmakingen,
    mapDetail: (result) => ({
      title: categoryLabels.bekendmakingen.singular,
      subTitle: result._display,
      items: [
        { type: DetailResultItemType.Default, label: 'Datum', value: result.date },
        { type: DetailResultItemType.Default, label: 'Categorie', value: result.categorie },
        { type: DetailResultItemType.Default, label: 'Onderwerp', value: result.onderwerp },
        {
          type: DetailResultItemType.Default,
          label: 'Beschrijving',
          value: result.beschrijving,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Meer informatie',
          value: result.url,
          link: result.url,
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
  [endpointTypes.explosievenGevrijwaardGebied]: {
    normalization: explosieven,
    mapDetail: (result) => ({
      title: 'Gevrijwaard gebied',
      subTitle: result._display,
      items: [
        { type: DetailResultItemType.Default, label: 'Datum rapport', value: result.date },
        { type: DetailResultItemType.Default, label: 'Soort handeling', value: result.type },
        { type: DetailResultItemType.Default, label: 'Bron', value: result.bron },
        {
          type: DetailResultItemType.Default,
          label: 'Opmerkingen',
          value: result.opmerkingen,
        },
      ],
    }),
  },
  [endpointTypes.explosievenInslag]: {
    normalization: explosieven,
    mapDetail: (result) => ({
      title: 'Inslag',
      subTitle: result._display,
      items: [
        { type: DetailResultItemType.Default, label: 'Datum', value: result.datum },
        {
          type: DetailResultItemType.Default,
          label: 'Datum van inslag',
          value: result.datum_inslag,
        },
        { type: DetailResultItemType.Default, label: 'Soort handeling', value: result.type },
        { type: DetailResultItemType.Default, label: 'Bron', value: result.bron },
        { type: DetailResultItemType.Default, label: 'Opmerkingen', value: result.opmerkingen },
      ],
    }),
  },
  [endpointTypes.explosievenUitgevoerdOnderzoek]: {
    normalization: explosieven,
    mapDetail: (result) => ({
      title: 'Reeds uitgevoerd CE onderzoek',
      subTitle: result._display,
      items: [
        { type: DetailResultItemType.Default, label: 'Datum rapport', value: result.date },
        { type: DetailResultItemType.Default, label: 'Soort rapportage', value: result.type },
        {
          type: DetailResultItemType.Default,
          label: 'Onderzoeksgebied',
          value: result.onderzoeksgebied,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Verdacht gebied',
          value: result.verdacht_gebied,
        },
      ],
    }),
  },
  [endpointTypes.explosievenVerdachtGebied]: {
    mapDetail: (result) => ({
      title: 'Verdacht gebied',
      subTitle: result._display,
      items: [
        { type: DetailResultItemType.Default, label: 'Hoofdgroep', value: result.type },
        { type: DetailResultItemType.Default, label: 'Subsoort', value: result.subtype },
        {
          type: DetailResultItemType.Default,
          label: 'Opmerkingen',
          value: result.opmerkingen,
        },
      ],
    }),
  },
  [endpointTypes.fietspaaltjes]: {
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
          { type: DetailResultItemType.Default, label: 'Type', value: formatList(result.type) },
          { type: DetailResultItemType.Default, label: 'Aantal', value: result.count },
          {
            type: DetailResultItemType.Default,
            label: 'Noodzaak',
            value: formatList(result.noodzaak),
          },
          {
            type: DetailResultItemType.Default,
            label: 'Uiterlijk',
            value: formatList(result.uiterlijk),
          },
          {
            type: DetailResultItemType.Default,
            label: 'Omschrijving',
            value: formatList(result.soortPaaltje),
          },
          { type: DetailResultItemType.Default, label: 'Ruimte', value: formatList(result.ruimte) },
          {
            type: DetailResultItemType.Default,
            label: 'Markering',
            value: formatList(result.markering),
          },
          {
            type: DetailResultItemType.Default,
            label: 'Soort weg',
            value: formatList(result.soortWeg),
          },
          {
            type: DetailResultItemType.Default,
            label: 'Status',
            value: formatList(result.paaltjesWeg),
          },
          {
            type: DetailResultItemType.Default,
            label: 'Zichtbaarheid',
            value: formatList(result.zichtInDonker),
          },
        ],
      }
    },
  },
  [endpointTypes.evenementen]: {
    normalization: evenementen,
    mapDetail: (result) => ({
      title: categoryLabels.evenementen.singular,
      subTitle: result.titel,
      items: [
        { type: DetailResultItemType.Default, label: 'Startdatum', value: result.startDate },
        { type: DetailResultItemType.Default, label: 'Einddatum', value: result.endDate },
        { type: DetailResultItemType.Default, label: 'Omschrijving', value: result.omschrijving },
        {
          type: DetailResultItemType.Default,
          label: 'Meer informatie',
          value: result.url,
          link: result.url,
        },
      ],
    }),
  },
  [endpointTypes.reclamebelasting]: {
    normalization: reclamebelasting,
    mapDetail: (result) => ({
      title: categoryLabels.reclamebelasting.singular,
      subTitle: result._display,
      items: [
        { type: DetailResultItemType.Default, label: 'Tarief per', value: result.localeDate },
        {
          type: DetailResultItemType.Default,
          label: 'Website',
          value: result.website,
          link: result.website,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Tarieven',
          value: result.tarieven,
          link: result.tarieven,
        },
      ],
    }),
  },
  [endpointTypes.gebiedenBouwblok]: {
    mapDetail: (result) => ({
      title: categoryLabels.bouwblok.singular,
      subTitle: result._display,
      items: [],
    }),
  },
  [endpointTypes.gebiedenBuurt]: {
    mapDetail: (result) => ({
      title: 'Buurt',
      subTitle: result._display,
      items: [{ type: DetailResultItemType.Default, label: 'Code', value: result.volledige_code }],
    }),
  },
  [endpointTypes.gebiedenGebiedsgerichtWerken]: {
    mapDetail: (result) => ({
      title: 'Gebiedsgerichtwerken-gebied',
      subTitle: result._display,
      items: [{ type: DetailResultItemType.Default, label: 'Code', value: result.code }],
    }),
  },
  [endpointTypes.gebiedenGrootstedelijk]: {
    mapDetail: (result) => ({
      title: 'Grootstedelijk gebied',
      subTitle: result._display,
      items: [],
    }),
  },
  [endpointTypes.gebiedenStadsdeel]: {
    mapDetail: (result) => ({
      title: 'Stadsdeel',
      subTitle: result._display,
      items: [{ type: DetailResultItemType.Default, label: 'Code', value: result.code }],
    }),
  },
  [endpointTypes.gebiedenUnesco]: {
    mapDetail: (result) => ({
      title: 'UNESCO',
      subTitle: result._display,
      items: [],
    }),
  },
  [endpointTypes.gebiedenWijk]: {
    mapDetail: (result) => ({
      title: 'Wijk',
      subTitle: result._display,
      items: [{ type: DetailResultItemType.Default, label: 'Code', value: result.code }],
    }),
  },
  [endpointTypes.grondexploitaties]: {
    normalization: grexProject,
    mapDetail: (result) => ({
      title: categoryLabels.grondexploitatie.singular,
      subTitle: result.plannaam,
      items: [
        { type: DetailResultItemType.Default, label: 'Nummer', value: result.id },
        { type: DetailResultItemType.Default, label: 'Status', value: result.planstatusFormatted },
        { type: DetailResultItemType.Default, label: 'Startdatum', value: result.startdatum },
        {
          type: DetailResultItemType.Default,
          label: 'Oppervlakte',
          value: result.oppervlakteFormatted,
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
          label: 'Kadastrale gemeente',
          value: result.cadastralName,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Gemeente',
          value: result.name,
        },
        { type: DetailResultItemType.Default, label: 'Grootte', value: result.size },
      ],
    }),
  },
  [endpointTypes.meetbout]: {
    normalization: meetbout,
    mapDetail: (result) => ({
      title: categoryLabels.meetbout.singular,
      subTitle: result.meetboutidentificatie,
      items: [
        { type: DetailResultItemType.Default, label: 'Adres', value: result.adres },
        { type: DetailResultItemType.Default, label: 'Zaksnelheid (mm/j)', value: result.speed },
      ],
    }),
  },
  [endpointTypes.monument]: {
    normalization: monument,
    mapDetail: (result) => ({
      title: categoryLabels.monument.singular,
      subTitle: result._display,
      items: [
        { type: DetailResultItemType.Default, label: 'Nummer', value: result.monumentnummer },
        { type: DetailResultItemType.Default, label: 'Type', value: result.monumenttype },
        { type: DetailResultItemType.Default, label: 'Status', value: result.monumentstatus },
      ],
    }),
  },
  [endpointTypes.monumentComplex]: {
    normalization: monument,
    mapDetail: (result) => ({
      title: categoryLabels.monument.singular,
      subTitle: result._display,
      items: [
        { type: DetailResultItemType.Default, label: 'Nummer', value: result.monumentnummer },
        { type: DetailResultItemType.Default, label: 'Type', value: result.monumenttype },
        { type: DetailResultItemType.Default, label: 'Status', value: result.monumentstatus },
      ],
    }),
  },
  [endpointTypes.napPeilmerk]: {
    normalization: napPeilmerk,
    mapDetail: (result) => ({
      title: categoryLabels.napPeilmerk.singular,
      subTitle: result.peilmerkidentificatie,
      items: [
        { type: DetailResultItemType.Default, label: 'Hoogte NAP', value: result.height },
        {
          type: DetailResultItemType.Default,
          label: 'Omschrijving',
          value: result.omschrijving,
        },
        { type: DetailResultItemType.Default, label: 'Windrichting', value: result.windrichting },
        {
          type: DetailResultItemType.Default,
          label: 'Muurvlakcoördinaten (cm)',
          value: result.wallCoordinates,
        },
      ],
    }),
  },
  [endpointTypes.oplaadpunten]: {
    normalization: oplaadpunten,
    mapDetail: (result) => ({
      title: categoryLabels.oplaadpunten.singular,
      subTitle: result._display,
      items: [
        { type: DetailResultItemType.Default, label: 'Adres', value: result.address },
        { type: DetailResultItemType.Default, label: 'Aantal', value: result.quantity },
        { type: DetailResultItemType.Default, label: 'Soort', value: result.type },
        {
          type: DetailResultItemType.Default,
          label: 'Capaciteit',
          value: result.charging_capability,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Connectortype',
          value: result.connector_type,
        },
        { type: DetailResultItemType.Default, label: 'Status', value: result.currentStatus },
      ],
    }),
  },
  [endpointTypes.parkeervak]: {
    normalization: parkeervak,
    mapDetail: (result) => ({
      title: categoryLabels.parkeervak.singular,
      subTitle: result.id,
      items: [
        { type: DetailResultItemType.Default, label: 'Straat', value: result.straatnaam },
        {
          type: DetailResultItemType.Table,
          label: 'Regimes',
          headings: [
            { label: 'Dagen', key: 'dagenFormatted' },
            { label: 'Tijdstip', key: 'tijdstip' },
            { label: 'Type', key: 'eTypeDescription' },
            { label: 'Bord', key: 'bord' },
          ],
          values: result.regimes,
        },
      ],
    }),
  },
  [endpointTypes.parkeerzones]: {
    normalization: parkeerzones,
    mapDetail: (result) => ({
      title: categoryLabels.parkeerzones.singular,
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.Default,
          label: 'Omschrijving',
          value: result.gebied_omschrijving,
        },
      ],
    }),
  },
  [endpointTypes.parkeerzonesUitz]: {
    normalization: parkeerzones,
    mapDetail: (result) => ({
      title: categoryLabels.parkeerzonesUitz.singular,
      subTitle: result._display,
      items: [
        {
          type: DetailResultItemType.Default,
          label: 'Omschrijving',
          value: result.omschrijving,
        },
      ],
    }),
  },
  [endpointTypes.vastgoed]: {
    normalization: vastgoed,
    mapDetail: (result) => ({
      title: 'Gemeentelijk eigendom',
      subTitle: result._display,
      items: [
        { type: DetailResultItemType.Default, label: 'Bouwjaar', value: result.construction_year },
        {
          type: DetailResultItemType.Default,
          label: 'Monumentstatus',
          value: result.monumental_status,
        },
        { type: DetailResultItemType.Default, label: 'Status', value: result.status },
      ],
    }),
  },
  [endpointTypes.vestiging]: {
    authScope: 'HR/R',
    normalization: vestiging,
    mapDetail: (result) =>
      result
        ? {
            title: categoryLabels.vestiging.singular,
            subTitle: result._display,
            items: [
              {
                type: DetailResultItemType.Default,
                label: 'KvK-nummer',
                value: result.kvkNumber,
              },
              {
                type: DetailResultItemType.Default,
                label: 'Vestigingsnummer',
                value: result.vestigingsnummer,
              },
              {
                type: DetailResultItemType.Default,
                label: 'Bezoekadres',
                value: result.bezoekadres.volledig_adres,
              },
              {
                type: DetailResultItemType.Default,
                label: 'SBI-code en -omschrijving',
                value: result.activities,
              },
              {
                type: DetailResultItemType.Default,
                label: 'Type',
                value: result.type,
              },
              {
                type: DetailResultItemType.Default,
                label: 'Soort bijzondere rechtstoestand',
                value:
                  result.bijzondereRechtstoestand && result.bijzondereRechtstoestand.label
                    ? result.bijzondereRechtstoestand.label
                    : false,
                status: NotificationLevel.Error,
              },
            ],
            notifications: [
              {
                value:
                  result.bijzondereRechtstoestand && result.bijzondereRechtstoestand.label
                    ? result.bijzondereRechtstoestand.label
                    : false,
                level: NotificationLevel.Error,
              },
              {
                value: !result._display
                  ? 'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken.'
                  : false,
                level: NotificationLevel.Attention,
              },
            ],
          }
        : {
            title: categoryLabels.vestiging.singular,
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
  [endpointTypes.winkelgebied]: {
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
          type: DetailResultItemType.Default,
          label: 'Categorie',
          value: result.categorie_naam ? `${result.categorie_naam} (${result.categorie})` : false, // check where to normalize
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
    mapDetail: (result) => ({
      title: categoryLabels.precarioShips.singular,
      subTitle: result.gebied,
      items: [
        {
          type: DetailResultItemType.Default,
          label: 'Categorie',
          value: result.categorie,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Jaar',
          value: result.jaar,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Stadsdeel',
          value: result.stadsdeel,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Tarief per jaar per m2',
          value: result.tariefPerJaarPerM2,
        },
      ],
    }),
  },
  [endpointTypes.precarioComVessels]: {
    mapDetail: (result) => ({
      title: categoryLabels.precarioComVessels.singular,
      subTitle: result.gebied,
      items: [
        {
          type: DetailResultItemType.Default,
          label: 'Categorie',
          value: result.categorie,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Jaar',
          value: result.jaar,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Stadsdeel',
          value: result.stadsdeel,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Tarief per jaar per m2',
          value: result.tariefPerJaarPerM2,
        },
      ],
    }),
  },
  [endpointTypes.precarioPassVessels]: {
    mapDetail: (result) => ({
      title: categoryLabels.precarioPassVessels.singular,
      subTitle: result.gebied,
      items: [
        {
          type: DetailResultItemType.Default,
          label: 'Categorie',
          value: result.categorie,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Jaar',
          value: result.jaar,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Gebied',
          value: result.gebied,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Tarief per jaar per m2',
          value: result.tariefPerJaarPerM2,
        },
      ],
    }),
  },
  [endpointTypes.precarioTerraces]: {
    mapDetail: (result) => ({
      title: categoryLabels.precarioTerraces.singular,
      subTitle: result.gebied,
      items: [
        {
          type: DetailResultItemType.Default,
          label: 'Categorie',
          value: result.categorie,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Jaar',
          value: result.jaar,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Stadsdeel',
          value: result.stadsdeel,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Gebied',
          value: result.gebied,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Overdekt terras per jaar per m2',
          value: result.tariefOverdektTerrasPerJaarPerM2,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Onverdekt terras per zomerseizoen per m2',
          value: result.tariefOnoverdektTerrasPerZomerseizoenPerM2,
        },
        {
          type: DetailResultItemType.Default,
          label: 'Onoverdekt terras per winterseizoen per m2',
          value: result.tariefOnoverdektTerrasPerWinterseizoenPerM2,
        },
      ],
    }),
  },
}

export default servicesByEndpointType
