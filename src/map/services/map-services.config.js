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
  constructionFiles: 'stadsarchief/bouwdossier/',
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
  reclamebelasting: 'vsd/reclamebelasting/',
  vastgoed: 'vsd/vastgoed',
  vestiging: 'handelsregister/vestiging/',
  winkelgebied: 'vsd/winkgeb',
  wkpbBeperking: 'wkpb/beperking',
  wkpbUitreksel: 'brk/object-wkpb',
  woonplaats: 'bag/v1.1/woonplaats',
}

const servicesByEndpointType = {
  [endpointTypes.adressenLigplaats]: {
    mapDetail: (result) => ({
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
    mapDetail: (result) => ({
      title: 'Adres (verblijfsobject)',
      subTitle: result._display,
      items: [
        {
          label: 'Gebruiksdoel',
          value: result.verblijfsobject ? result.verblijfsobject.gebruiksdoelen : false,
          multiLine: true,
        },
        {
          label: 'Soort object (feitelijk gebruik)',
          value: result.verblijfsobject ? result.verblijfsobject.gebruik : false,
        },
        {
          label: 'Status',
          value: result.verblijfsobject ? result.verblijfsobject.status : false,
          status: result.verblijfsobject && result.verblijfsobject.statusLevel,
        },
        {
          label: 'Type adres',
          value: result.type_adres,
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
              ? `Status: ${result.verblijfsobject.status}`
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
    mapDetail: (result) => ({
      title: 'Adres (verblijfsobject)',
      subTitle: result._display,
      items: [
        {
          label: 'Gebruiksdoel',
          value: result.gebruiksdoelen,
          multiLine: true,
        },
        {
          label: 'Soort object (feitelijk gebruik)',
          value: result.gebruik || '',
        },
        {
          label: 'Status',
          value: result.status ? result.status : false,
          status: result.statusLevel,
        },
        {
          label: 'Type adres',
          value: result.typeAdres,
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
          value: result.statusLevel ? `Status: ${result.status}` : false,
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
    mapDetail: (result) => ({
      title: result.type,
      subTitle: result._display,
      items: [{ label: 'Naam 24-posities (NEN)', value: result.naam_24_posities }],
    }),
  },
  [endpointTypes.adressenPand]: {
    normalization: adressenPand,
    mapDetail: (result) => ({
      title: categoryLabels.pand.singular,
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
    mapDetail: (result) => ({
      title: categoryLabels.bedrijfsinvesteringszone.singular,
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
    mapDetail: (result) => ({
      title: categoryLabels.bekendmakingen.singular,
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
        { label: 'Datum rapport', value: result.date },
        { label: 'Soort handeling', value: result.type },
        { label: 'Bron', value: result.bron },
        { label: 'Opmerkingen', value: result.opmerkingen, multiLine: true },
      ],
    }),
  },
  [endpointTypes.explosievenInslag]: {
    normalization: explosieven,
    mapDetail: (result) => ({
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
    mapDetail: (result) => ({
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
    mapDetail: (result) => ({
      title: 'Verdacht gebied',
      subTitle: result._display,
      items: [
        { label: 'Hoofdgroep', value: result.type },
        { label: 'Subsoort', value: result.subtype },
        { label: 'Opmerkingen', value: result.opmerkingen, multiLine: true },
      ],
    }),
  },
  [endpointTypes.fietspaaltjes]: {
    mapDetail: (result) => {
      function formatList(items) {
        if (items instanceof Array) {
          return items.join(', ')
        }

        return items
      }

      return {
        title: categoryLabels.fietspaaltje.singular,
        subTitle: result.id,
        items: [
          { label: 'Type', value: formatList(result.type) },
          { label: 'Aantal', value: result.count },
          { label: 'Noodzaak', value: formatList(result.noodzaak) },
          { label: 'Uiterlijk', value: formatList(result.uiterlijk) },
          { label: 'Omschrijving', value: formatList(result.soortPaaltje) },
          { label: 'Ruimte', value: formatList(result.ruimte) },
          { label: 'Markering', value: formatList(result.markering) },
          { label: 'Soort weg', value: formatList(result.soortWeg) },
          { label: 'Status', value: formatList(result.paaltjesWeg) },
          { label: 'Zichtbaarheid', value: formatList(result.zichtInDonker) },
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
        { label: 'Startdatum', value: result.startDate },
        { label: 'Einddatum', value: result.endDate },
        { label: 'Omschrijving', value: result.omschrijving },
        { label: 'Meer informatie', value: result.url, link: result.url },
      ],
    }),
  },
  [endpointTypes.reclamebelasting]: {
    normalization: reclamebelasting,
    mapDetail: (result) => ({
      title: categoryLabels.reclamebelasting.singular,
      subTitle: result._display,
      items: [
        { label: 'Tarief per', value: result.localeDate },
        { label: 'Website', value: result.website, link: result.website },
        { label: 'Tarieven', value: result.tarieven, link: result.tarieven },
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
      items: [{ label: 'Code', value: result.volledige_code }],
    }),
  },
  [endpointTypes.gebiedenGebiedsgerichtWerken]: {
    mapDetail: (result) => ({
      title: 'Gebiedsgerichtwerken-gebied',
      subTitle: result._display,
      items: [{ label: 'Code', value: result.code }],
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
      items: [{ label: 'Code', value: result.code }],
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
      items: [{ label: 'Code', value: result.code }],
    }),
  },
  [endpointTypes.grondexploitaties]: {
    normalization: grexProject,
    mapDetail: (result) => ({
      title: categoryLabels.grondexploitatie.singular,
      subTitle: result.plannaam,
      items: [
        { label: 'Nummer', value: result.id },
        { label: 'Status', value: result.planstatusFormatted },
        { label: 'Startdatum', value: result.startdatum },
        { label: 'Oppervlakte', value: result.oppervlakteFormatted },
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
    mapDetail: (result) => ({
      title: categoryLabels.meetbout.singular,
      subTitle: result.meetboutidentificatie,
      items: [
        { label: 'Adres', value: result.adres },
        { label: 'Zaksnelheid (mm/j)', value: result.speed },
      ],
    }),
  },
  [endpointTypes.monument]: {
    normalization: monument,
    mapDetail: (result) => ({
      title: categoryLabels.monument.singular,
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
    mapDetail: (result) => ({
      title: categoryLabels.monument.singular,
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
    mapDetail: (result) => ({
      title: categoryLabels.napPeilmerk.singular,
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
    mapDetail: (result) => ({
      title: categoryLabels.oplaadpunten.singular,
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
    mapDetail: (result) => ({
      title: categoryLabels.parkeervak.singular,
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
    mapDetail: (result) => ({
      title: categoryLabels.parkeerzones.singular,
      subTitle: result._display,
      items: [{ label: 'Omschrijving', value: result.gebied_omschrijving, multiLine: true }],
    }),
  },
  [endpointTypes.parkeerzonesUitz]: {
    normalization: parkeerzones,
    mapDetail: (result) => ({
      title: categoryLabels.parkeerzonesUitz.singular,
      subTitle: result._display,
      items: [{ label: 'Omschrijving', value: result.omschrijving, multiLine: true }],
    }),
  },
  [endpointTypes.vastgoed]: {
    normalization: vastgoed,
    mapDetail: (result) => ({
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
    mapDetail: (result) =>
      result
        ? {
            title: categoryLabels.vestiging.singular,
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
            title: categoryLabels.vestiging.singular,
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
    mapDetail: (result) => ({
      title: categoryLabels.winkelgebied.singular,
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
                level: 'info',
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
                level: 'info',
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
}

export default servicesByEndpointType
