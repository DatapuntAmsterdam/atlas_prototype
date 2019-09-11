import adressenNummeraanduiding from './adressen-nummeraanduiding/adressen-nummeraanduiding'
import gebiedenStadsdeel from './gebieden-stadsdeel/gebieden-stadsdeel'
import vestiging from './vestiging/vestiging'

import {
  oplaadpunten,
  bekendmakingen,
  napPeilmerk,
  adressenPand,
  adressenVerblijfsobject,
  kadastraalObject,
  explosieven,
  evenementen,
  grondexploitatie,
  vastgoed,
  winkelgebied,
  parkeerzones,
  monument,
  meetbout,
} from './normalize/normalize'

export const endpointTypes = {
  adressenLigplaats: 'bag/ligplaats/',
  adressenNummeraanduiding: 'bag/nummeraanduiding/',
  adressenOpenbareRuimte: 'bag/openbareruimte/',
  adressenPand: 'bag/pand/',
  adressenStandplaats: 'bag/standplaats/',
  adressenVerblijfsobject: 'bag/verblijfsobject/',
  bedrijfsinvesteringszone: 'vsd/biz/',
  bekendmakingen: 'vsd/bekendmakingen/',
  explosievenGevrijwaardGebied: 'milieuthemas/explosieven/gevrijwaardgebied/',
  explosievenInslag: 'milieuthemas/explosieven/inslagen/',
  explosievenUitgevoerdOnderzoek: 'milieuthemas/explosieven/uitgevoerdonderzoek/',
  explosievenVerdachtGebied: 'milieuthemas/explosieven/verdachtgebied/',
  evenementen: 'vsd/evenementen/',
  gebiedenBouwblok: 'gebieden/bouwblok/',
  gebiedenBuurt: 'gebieden/buurt/',
  gebiedenGebiedsgerichtWerken: 'gebieden/gebiedsgerichtwerken/',
  gebiedenGrootstedelijk: 'gebieden/grootstedelijkgebied/',
  gebiedenStadsdeel: 'gebieden/stadsdeel/',
  gebiedenUnesco: 'gebieden/unesco/',
  gebiedenWijk: 'gebieden/buurtcombinatie/',
  grondexploitatie: 'grondexploitatie/project/',
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
  vastgoed: 'vsd/vastgoed',
  vestiging: 'handelsregister/vestiging/',
  winkelgebied: 'vsd/winkgeb',
  wkpbBeperking: 'wkpb/beperking',
  wkpbUitreksel: 'brk/object-wkpb',
}

const servicesByEndpointType = {
  [endpointTypes.adressenLigplaats]: {
    mapDetail: result => ({
      title: 'Adres (ligplaats)',
      subTitle: result._display,
      items: [
        {
          label: 'Indicatie geconstateerd',
          value: result.indicatie_geconstateerd ? 'Ja' : 'Nee',
          status: result.indicatie_geconstateerd ? 'alert' : '',
        },
        {
          label: 'Aanduiding in onderzoek',
          value: result.aanduiding_in_onderzoek ? 'Ja' : 'Nee',
          status: result.aanduiding_in_onderzoek ? 'alert' : '',
        },
      ],
      notifications: [
        {
          value: result.indicatie_geconstateerd ? 'Indicatie geconstateerd' : false,
          level: 'alert',
        },
        {
          value: result.aanduiding_in_onderzoek ? 'In onderzoek' : false,
          level: 'alert',
        },
      ],
    }),
  },
  [endpointTypes.adressenNummeraanduiding]: {
    normalization: adressenNummeraanduiding,
    mapDetail: result => ({
      title: 'Adres (verblijfsobject)',
      subTitle: result._display,
      items: [
        {
          label: 'Gebruiksdoel',
          value: result.verblijfsobject ? result.verblijfsobject.gebruiksdoelen : false,
          multiLine: true,
        },
        {
          label: 'Feitelijk gebruik',
          value: result.verblijfsobject ? result.verblijfsobject.gebruiksomschrijving : false,
        },
        {
          label: 'Status',
          value: result.verblijfsobject ? result.verblijfsobject.statusomschrijving : false,
          status: result.verblijfsobject && result.verblijfsobject.statusLevel,
        },
        {
          label: 'Indicatie hoofdadres',
          value: result.isNevenadres ? 'Nee' : 'Ja',
          status: result.isNevenadres ? 'info' : '',
        },
        {
          label: 'Indicatie geconstateerd',
          value: result.indicatie_geconstateerd ? 'Ja' : 'Nee',
          status: result.indicatie_geconstateerd ? 'alert' : '',
        },
        {
          label: 'Aanduiding in onderzoek',
          value: result.aanduiding_in_onderzoek ? 'Ja' : 'Nee',
          status: result.aanduiding_in_onderzoek ? 'alert' : '',
        },
        {
          label: 'Oppervlakte',
          value: result.verblijfsobject ? result.verblijfsobject.size : false,
        },
      ],
      notifications: [
        {
          value:
            result.verblijfsobject && result.verblijfsobject.statusLevel
              ? `Status: ${result.verblijfsobject.statusomschrijving}`
              : false,
          level: result.verblijfsobject && result.verblijfsobject.statusLevel,
        },
        {
          value: result.isNevenadres ? 'Dit is een nevenadres' : false,
          level: 'info',
        },
        {
          value: result.indicatie_geconstateerd ? 'Indicatie geconstateerd' : false,
          level: 'alert',
        },
        {
          value: result.aanduiding_in_onderzoek ? 'In onderzoek' : false,
          level: 'alert',
        },
      ],
    }),
  },
  [endpointTypes.adressenVerblijfsobject]: {
    normalization: adressenVerblijfsobject,
    mapDetail: result => ({
      title: 'Adres (verblijfsobject)',
      subTitle: result._display,
      items: [
        {
          label: 'Gebruiksdoel',
          value: result.gebruiksdoelen,
          multiLine: true,
        },
        {
          label: 'Feitelijk gebruik',
          value: result.gebruik ? result.gebruik.omschrijving : false,
        },
        {
          label: 'Status',
          value: result.status ? result.status.omschrijving : false,
          status: result.statusLevel,
        },
        {
          label: 'Indicatie hoofdadres',
          value: result.isNevenadres ? 'Nee' : 'Ja',
          status: result.isNevenadres ? 'info' : '',
        },
        {
          label: 'Indicatie geconstateerd',
          value: result.indicatie_geconstateerd ? 'Ja' : 'Nee',
          status: result.indicatie_geconstateerd ? 'alert' : '',
        },
        {
          label: 'Aanduiding in onderzoek',
          value: result.aanduiding_in_onderzoek ? 'Ja' : 'Nee',
          status: result.aanduiding_in_onderzoek ? 'alert' : '',
        },
        {
          label: 'Oppervlakte',
          value: result.size,
        },
      ],
      notifications: [
        {
          value: result.statusLevel ? `Status: ${result.status.omschrijving}` : false,
          level: result.statusLevel,
        },
        {
          value: result.isNevenadres ? 'Dit is een nevenadres' : false,
          level: 'info',
        },
        {
          value: result.indicatie_geconstateerd ? 'Indicatie geconstateerd' : false,
          level: 'alert',
        },
        {
          value: result.aanduiding_in_onderzoek ? 'In onderzoek' : false,
          level: 'alert',
        },
      ],
    }),
  },
  [endpointTypes.adressenOpenbareRuimte]: {
    mapDetail: result => ({
      title: result.type,
      subTitle: result._display,
      items: [{ label: 'Naam 24-posities (NEN)', value: result.naam_24_posities }],
    }),
  },
  [endpointTypes.adressenPand]: {
    normalization: adressenPand,
    mapDetail: result => ({
      title: ' Pand',
      subTitle: result._display,
      items: [
        {
          label: 'Oorspronkelijk bouwjaar',
          value: result.year,
        },
        {
          label: 'Naam',
          value: result.pandnaam,
        },
        {
          label: 'Status',
          value: result.status ? result.status.omschrijving : false,
          status: result.statusLevel,
        },
      ],
      notifications: [
        {
          value: result.statusLevel ? result.status.omschrijving : false,
          level: result.statusLevel ? result.statusLevel : '',
        },
      ],
    }),
  },
  [endpointTypes.adressenStandplaats]: {
    mapDetail: result => ({
      title: 'Adres (standplaats)',
      subTitle: result._display,
      items: [
        {
          label: 'Indicatie geconstateerd',
          value: result.indicatie_geconstateerd ? 'Ja' : 'Nee',
          status: result.indicatie_geconstateerd ? 'alert' : '',
        },
        {
          label: 'Aanduiding in onderzoek',
          value: result.aanduiding_in_onderzoek ? 'Ja' : 'Nee',
          status: result.aanduiding_in_onderzoek ? 'alert' : '',
        },
      ],
      notifications: [
        {
          value: result.indicatie_geconstateerd ? 'Indicatie geconstateerd' : false,
          level: 'alert',
        },
        {
          value: result.aanduiding_in_onderzoek ? 'In onderzoek' : false,
          level: 'alert',
        },
      ],
    }),
  },
  [endpointTypes.bedrijfsinvesteringszone]: {
    mapDetail: result => ({
      title: 'bedrijfsinvesteringszone',
      subTitle: result._display,
      items: [
        { label: 'Type', value: result.biz_type },
        { label: 'Heffingsgrondslag', value: result.heffingsgrondslag },
        { label: 'Jaarlijkse heffing', value: result.heffing_display },
        { label: 'Aantal heffingsplichtigen', value: result.bijdrageplichtigen },
      ],
    }),
  },
  [endpointTypes.bekendmakingen]: {
    normalization: bekendmakingen,
    mapDetail: result => ({
      title: 'Bekendmaking',
      subTitle: result._display,
      items: [
        { label: 'Datum', value: result.date },
        { label: 'Categorie', value: result.categorie },
        { label: 'Onderwerp', value: result.onderwerp },
        { label: 'Beschrijving', value: result.beschrijving, multiLine: true },
        { label: 'Meer informatie', value: result.url, link: result.url },
      ],
    }),
  },
  [endpointTypes.explosievenGevrijwaardGebied]: {
    normalization: explosieven,
    mapDetail: result => ({
      title: 'Gevrijwaard gebied',
      subTitle: result._display,
      items: [
        { label: 'Datum rapport', value: result.date },
        { label: 'Soort handeling', value: result.type },
        { label: 'Bron', value: result.bron },
        { label: 'Opmerkingen', value: result.opmerkingen, multiLine: true },
      ],
    }),
  },
  [endpointTypes.explosievenInslag]: {
    normalization: explosieven,
    mapDetail: result => ({
      title: 'Inslag',
      subTitle: result._display,
      items: [
        { label: 'Datum van inslag', value: result.date },
        { label: 'Soort handeling', value: result.type },
        { label: 'Bron', value: result.bron, multiLine: true },
        { label: 'Opmerkingen', value: result.opmerkingen },
      ],
    }),
  },
  [endpointTypes.explosievenUitgevoerdOnderzoek]: {
    normalization: explosieven,
    mapDetail: result => ({
      title: 'Reeds uitgevoerd CE onderzoek',
      subTitle: result._display,
      items: [
        { label: 'Datum rapport', value: result.date },
        { label: 'Soort rapportage', value: result.type },
        { label: 'Onderzoeksgebied', value: result.onderzoeksgebied },
        { label: 'Verdacht gebied', value: result.verdacht_gebied },
      ],
    }),
  },
  [endpointTypes.explosievenVerdachtGebied]: {
    mapDetail: result => ({
      title: 'Verdacht gebied',
      subTitle: result._display,
      items: [
        { label: 'Hoofdgroep', value: result.type },
        { label: 'Subsoort', value: result.subtype },
        { label: 'Opmerkingen', value: result.opmerkingen, multiLine: true },
      ],
    }),
  },
  [endpointTypes.evenementen]: {
    normalization: evenementen,
    mapDetail: result => ({
      title: 'Evenement',
      subTitle: result.titel,
      items: [
        { label: 'Startdatum', value: result.startDate },
        { label: 'Einddatum', value: result.endDate },
        { label: 'Omschrijving', value: result.omschrijving },
        { label: 'Meer informatie', value: result.url, link: result.url },
      ],
    }),
  },
  [endpointTypes.gebiedenBouwblok]: {
    mapDetail: result => ({
      title: 'Bouwblok',
      subTitle: result._display,
      items: [],
    }),
  },
  [endpointTypes.gebiedenBuurt]: {
    mapDetail: result => ({
      title: 'Buurt',
      subTitle: result._display,
      items: [{ label: 'Code', value: result.volledige_code }],
    }),
  },
  [endpointTypes.gebiedenGebiedsgerichtWerken]: {
    mapDetail: result => ({
      title: 'Gebiedsgerichtwerken-gebied',
      subTitle: result._display,
      items: [{ label: 'Code', value: result.code }],
    }),
  },
  [endpointTypes.gebiedenGrootstedelijk]: {
    mapDetail: result => ({
      title: 'Grootstedelijk gebied',
      subTitle: result._display,
      items: [],
    }),
  },
  [endpointTypes.gebiedenStadsdeel]: {
    normalization: gebiedenStadsdeel,
    mapDetail: result => ({
      title: 'Stadsdeel',
      subTitle: result._display,
      items: [
        { label: 'Code', value: result.code },
        {
          label: 'Grondexploitaties',
          value: result.totaal_baten && [
            { label: 'Totale begroting baten', value: result.totaal_baten_display },
            { label: 'Totale begroting kosten', value: result.totaal_lasten_display },
            { label: 'Verschil', value: result.totaal_resultaat_display },
          ],
        },
      ],
      notifications: [
        {
          value: !result.totaal_baten
            ? 'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om grondexploitaties te bekijken.'
            : false,
        },
      ],
    }),
  },
  [endpointTypes.gebiedenUnesco]: {
    mapDetail: result => ({
      title: 'UNESCO',
      subTitle: result._display,
      items: [],
    }),
  },
  [endpointTypes.gebiedenWijk]: {
    mapDetail: result => ({
      title: 'Wijk',
      subTitle: result._display,
      items: [{ label: 'Code', value: result.code }],
    }),
  },
  [endpointTypes.grondexploitatie]: {
    normalization: grondexploitatie,
    authScope: 'GREX/R',
    mapDetail: result =>
      result
        ? {
            title: 'Grondexploitatie',
            subTitle: result._display,
            items: [
              { label: 'Nummer', value: result.plannr },
              { label: 'Startdatum', value: result.startDate },
              { label: 'Fase', value: result.fase },
              { label: 'Totale begroting baten', value: result.totaal_baten_display },
              { label: 'Totale begroting kosten', value: result.totaal_kosten_display },
              { label: 'Verschil', value: result.totaal_resultaat_display },
            ],
            notifications: [
              {
                value: !result.plannr
                  ? 'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om grondexploitaties te bekijken.'
                  : false,
              },
            ],
          }
        : {
            title: 'Grondexploitatie',
            items: [],
            notifications: [
              {
                value:
                  'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om grondexploitaties te bekijken.',
              },
            ],
          },
  },
  [endpointTypes.kadastraalObject]: {
    normalization: kadastraalObject,
    mapDetail: result => ({
      title: 'Kadastraal object',
      subTitle: result._display,
      items: [
        {
          label: 'Kadastrale gemeente',
          value: result.cadastralName,
        },
        {
          label: 'Gemeente',
          value: result.name,
        },
        { label: 'Grootte', value: result.size },
      ],
    }),
  },
  [endpointTypes.meetbout]: {
    normalization: meetbout,
    mapDetail: result => ({
      title: 'Meetbout',
      subTitle: result.meetboutidentificatie,
      items: [
        { label: 'Adres', value: result.adres },
        { label: 'Zaksnelheid (mm/j)', value: result.speed },
      ],
    }),
  },
  [endpointTypes.monument]: {
    normalization: monument,
    mapDetail: result => ({
      title: 'Monument',
      subTitle: result._display,
      items: [
        { label: 'Nummer', value: result.monumentnummer },
        { label: 'Type', value: result.monumenttype },
        { label: 'Status', value: result.monumentstatus },
      ],
    }),
  },
  [endpointTypes.monumentComplex]: {
    normalization: monument,
    mapDetail: result => ({
      title: 'Monument',
      subTitle: result._display,
      items: [
        { label: 'Nummer', value: result.monumentnummer },
        { label: 'Type', value: result.monumenttype },
        { label: 'Status', value: result.monumentstatus },
      ],
    }),
  },
  [endpointTypes.napPeilmerk]: {
    normalization: napPeilmerk,
    mapDetail: result => ({
      title: 'NAP Peilmerk',
      subTitle: result.peilmerkidentificatie,
      items: [
        { label: 'Hoogte NAP', value: result.height },
        { label: 'Omschrijving', value: result.omschrijving, multiLine: true },
        { label: 'Windrichting', value: result.windrichting },
        { label: 'Muurvlakcoördinaten (cm)', value: result.wallCoordinates },
      ],
    }),
  },
  [endpointTypes.oplaadpunten]: {
    normalization: oplaadpunten,
    mapDetail: result => ({
      title: 'Oplaadpunt',
      subTitle: result._display,
      items: [
        { label: 'Adres', value: result.address },
        { label: 'Aantal', value: result.quantity },
        { label: 'Soort', value: result.type },
        { label: 'Capaciteit', value: result.charging_capability },
        { label: 'Connectortype', value: result.connector_type },
        { label: 'Status', value: result.currentStatus },
      ],
    }),
  },
  [endpointTypes.parkeervak]: {
    mapDetail: result => ({
      title: 'Parkeervak',
      subTitle: result.id,
      items: [
        { label: 'Straat', value: result.straatnaam },
        { label: 'Type', value: result.e_type_desc },
        { label: 'Bord', value: result.bord },
      ],
    }),
  },
  [endpointTypes.parkeerzones]: {
    normalization: parkeerzones,
    mapDetail: result => ({
      title: 'Parkeervergunninggebied',
      subTitle: result._display,
      items: [{ label: 'Omschrijving', value: result.gebied_omschrijving, multiLine: true }],
    }),
  },
  [endpointTypes.parkeerzonesUitz]: {
    normalization: parkeerzones,
    mapDetail: result => ({
      title: 'Uitzondering parkeervergunninggebied',
      subTitle: result._display,
      items: [{ label: 'Omschrijving', value: result.omschrijving, multiLine: true }],
    }),
  },
  [endpointTypes.vastgoed]: {
    normalization: vastgoed,
    mapDetail: result => ({
      title: 'Gemeentelijk eigendom',
      subTitle: result._display,
      items: [
        { label: 'Bouwjaar', value: result.construction_year },
        { label: 'Monumentstatus', value: result.monumental_status },
        { label: 'Status', value: result.status },
      ],
    }),
  },
  [endpointTypes.vestiging]: {
    authScope: 'HR/R',
    normalization: vestiging,
    mapDetail: result =>
      result
        ? {
            title: 'Vestiging',
            subTitle: result._display,
            items: [
              {
                label: 'KvK-nummer',
                value: result.kvkNumber,
              },
              {
                label: 'Vestigingsnummer',
                value: result.vestigingsnummer,
              },
              {
                label: 'Bezoekadres',
                value: result.bezoekadres.volledig_adres,
                multiLine: true,
              },
              {
                label: 'SBI-code en -omschrijving',
                value: result.activities,
                multiLine: true,
              },
              {
                label: 'Type',
                value: result.type,
              },
              {
                label: 'Soort bijzondere rechtstoestand',
                value:
                  result.bijzondereRechtstoestand && result.bijzondereRechtstoestand.label
                    ? result.bijzondereRechtstoestand.label
                    : false,
                status: 'alert',
              },
            ],
            notifications: [
              {
                value:
                  result.bijzondereRechtstoestand && result.bijzondereRechtstoestand.label
                    ? result.bijzondereRechtstoestand.label
                    : false,
                level: 'alert',
              },
              {
                value: !result._display
                  ? 'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken.'
                  : false,
                level: 'info',
              },
            ],
          }
        : {
            title: 'Vestiging',
            items: [],
            notifications: [
              {
                value:
                  'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken.',
                level: 'info',
              },
            ],
          },
  },
  [endpointTypes.winkelgebied]: {
    normalization: winkelgebied,
    mapDetail: result => ({
      title: 'Winkelgebied',
      subTitle: result._display,
      notifications: [
        {
          value:
            'De grenzen van dit winkelgebied zijn indicatief. Er kunnen geen rechten aan worden ontleend.',
        },
      ],
      items: [
        {
          label: 'Categorie',
          value: result.categorie_naam ? `${result.categorie_naam} (${result.categorie})` : false, // check where to normalize
        },
      ],
    }),
  },
  [endpointTypes.wkpbBeperking]: {
    mapDetail: result => ({
      title: 'Gemeentelijke beperking',
      subTitle: result._display,
      items: [],
    }),
  },
  [endpointTypes.wkpbUitreksel]: {
    mapDetail: result => ({
      title: 'WKPB-uittreksel',
      subTitle: result._display,
      items: [],
    }),
  },
  [endpointTypes.kadastraalSubject]: {
    authScope: 'BRK/RS',
    mapDetail: result =>
      result
        ? {
            title: 'Kadastraal subject',
            subTitle: result._display,
            items: [],
          }
        : {
            title: 'Kadastraal subject',
            items: [],
            notifications: [
              {
                value:
                  'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om kadastrale subjecten te bekijken. Om ook zakelijke rechten van natuurlijke personen te bekijken, moet je als medewerker bovendien speciale bevoegdheden hebben.',
                level: 'info',
              },
            ],
          },
  },
  [endpointTypes.maatschappelijkeActiviteiten]: {
    authScope: 'HR/R',
    mapDetail: result =>
      result
        ? {
            title: 'Maatschappelijke activiteit',
            subTitle: result._display,
            items: [],
          }
        : {
            title: 'Maatschappelijke activiteit',
            items: [],
            notifications: [
              {
                value:
                  'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken.',
                level: 'info',
              },
            ],
          },
  },
}

export default servicesByEndpointType
