import categoryLabels from '../../map/services/map-search/category-labels'

const GLOSSARY = {
  DEFINITIONS: {
    A_PERCEEL: {
      singular: 'A-perceel',
      plural: 'A-percelen',
      description:
        'Een appartementsrecht (art. 5:106 Burgerlijk Wetboek) is een onroerende zaak. ' +
        'Onder appartementsrecht wordt verstaan een aandeel in de goederen die in de splitsing zijn ' +
        'betrokken, dat de bevoegdheid omvat tot het uitsluitend gebruik van bepaalde gedeelten ' +
        'van het gebouw die blijkens hun inrichting bestemd zijn of worden om als afzonderlijk ' +
        'geheel te worden gebruikt. Het aandeel kan mede omvatten de bevoegdheid tot het uitsluitend ' +
        'gebruik van bepaalde gedeelten van de bij het gebouw behorende grond.',
      url:
        'https://www.amsterdam.nl/stelselpedia/brk-index/catalog-brk-levering/objectklasse-objec/',
      meta: [],
    },
    AANTEKENING: {
      singular: 'Aantekening',
      plural: 'Aantekeningen',
      description:
        'Een Aantekening Kadastraal Object vormt de relatie tussen een Stukdeel en een ' +
        'Kadastraal Object en geeft aanvullende informatie over een bestaand feit, genoemd in een stuk, ' +
        'dat betrekking heeft op een object en dat gevolgen kan hebben voor de uitoefening van ' +
        'rechten op het object.',
      url:
        'https://www.amsterdam.nl/stelselpedia/brk-index/catalog-brk-levering/objectklasse-aant/',
      meta: [],
    },
    ADRES: {
      ...categoryLabels.address,
      description: null,
      url: null,
      meta: [],
    },
    API: {
      singular: 'Dataset',
      plural: 'Datasets',
      description: null,
      url: null,
      meta: [],
    },
    BEPERKING: {
      ...categoryLabels.gemeentelijkeBeperking,
      description: 'Lijst van beperkingen op een gebruiksrecht.',
      url: 'https://www.amsterdam.nl/stelselpedia/wkpb-index/catalogus/beperking/#objectkenmerken',
      meta: ['datum_in_werking', 'datum_einde'],
    },
    BETROKKEN_BIJ: {
      singular: 'Betrokken bij',
      plural: 'Betrokken bij',
      description: 'Kadastraal object is betrokken bij een appartementsrechtsplitsing',
      url: 'https://www.amsterdam.nl/stelselpedia/brk-index/catalog-brk-levering/zakelijk-recht/',
      meta: [],
    },
    BIZ: {
      ...categoryLabels.bedrijfsinvesteringszone,
      description:
        'Een bedrijfsinvesteringszone (BIZ) is een afgebakend gebied zoals ' +
        'een winkelstraat of een bedrijventerrein waarbinnen ondernemers en/of de ' +
        'eigenaren samen investeren in de kwaliteit van hun bedrijfsomgeving. ' +
        'Een BIZ kan worden opgezet door ondernemers, ondernemers en eigenaren ' +
        'samen of alleen door eigenaren.',
    },
    BOUWBLOK: {
      ...categoryLabels.bouwblok,
      description:
        'Een bouwblok is het kleinst mogelijk afgrensbare gebied, in zijn geheel ' +
        'tot een buurt behorend, dat geheel of grotendeels door bestaande of aan te leggen wegen ' +
        'en/of waterlopen is of zal zijn ingesloten en waarop tenminste één gebouw staat.',
      url: 'https://www.amsterdam.nl/stelselpedia/gebieden-index/catalogus/bouwblok/',
      meta: ['begin_geldigheid', 'bouwblokidentificatie'],
    },
    BRONDOCUMENT: {
      singular: 'Brondocument',
      plural: 'Brondocumenten',
      description: 'Het document dat aan de beperking ten grondslag ligt.',
      url:
        'https://www.amsterdam.nl/stelselpedia/wkpb-index/catalogus/brondocument/#objectkenmerken',
      meta: [],
    },
    BUURT: {
      singular: 'Buurt',
      plural: 'Buurten',
      description:
        'Een aaneengesloten gedeelte van een buurt, waarvan de grenzen zo veel mogelijk ' +
        'gebaseerd zijn op topografische elementen.',
      url: 'https://www.amsterdam.nl/stelselpedia/gebieden-index/catalogus/buurt/',
      meta: ['begin_geldigheid', 'brondocument_datum', 'brondocument_naam', 'buurtidentificatie'],
    },
    // plural because service call
    COMPLEXEN: {
      singular: 'Complex',
      plural: 'Complexen',
      description:
        'Een Complex is een verzameling monumenten waarvan de onderlinge samenhang een ' +
        'zekere cultuurhistorische waarde bezit.',
      url:
        'https://www.amsterdam.nl/stelselpedia/monumenten-index/catalogus-monumenten/' +
        'objectklasse-complex/',
      meta: ['identificerende_sleutel_complex'],
    },
    BEKENDMAKINGEN: {
      ...categoryLabels.bekendmakingen,
      description:
        'Bekendmakingen en kennisgevingen van Gemeente Amsterdam zijn bijvoorbeeld aanvragen voor vergunningen en ontheffingen en besluiten hierover, algemene mededelingen van de gemeente of inspraakmogelijkheden.',
      url: null,
      meta: [],
    },
    BUURTCOMBINATIE: {
      singular: 'Wijk',
      plural: 'Wijken',
      description:
        'Een aaneengesloten gedeelte van het grondgebied van een gemeente, waarvan ' +
        'de grenzen zo veel mogelijk zijn gebaseerd op sociaal-geografische kenmerken.',
      url: 'https://www.amsterdam.nl/stelselpedia/gebieden-index/catalogus/buurtcombinatie/',
      meta: [
        'begin_geldigheid',
        'brondocument_datum',
        'brondocument_naam',
        'buurtcombinatie_identificatie',
      ],
    },
    DATASETS: {
      singular: 'Dataset',
      plural: 'Datasets',
      description: null,
      url: null,
      meta: [],
    },
    EVENEMENTEN: {
      ...categoryLabels.evenementen,
      description:
        'Activiteiten en evenementen op het gebied van sport, recreatie, ' +
        'kunst en cultuur in Amsterdam. Veel activiteiten worden door externe organisaties ' +
        'aangeleverd. De Gemeente Amsterdam is niet verantwoordelijk voor de inhoud ' +
        'van deze evenementen.',
      url: null,
      meta: [],
    },
    RECLAMEBELASTING: {
      ...categoryLabels.reclamebelasting,
      description: '',
      url: null,
      meta: [],
    },
    FIETSPAALTJE: {
      ...categoryLabels.fietspaaltje,
      description: '',
      url: null,
      meta: [],
    },
    FUNCTIEVERVULLING: {
      singular: 'Functievervulling',
      plural: 'Functievervullingen',
      description:
        'Een FunctieVervulling geeft de relatie weer van de Persoon als functionaris ' +
        'en de Persoon als eigenaar van de Onderneming of MaatschappelijkeActiviteit.',
      url: 'https://www.amsterdam.nl/stelselpedia/hr-index/catalogus/functie-vervulling/',
      meta: [],
    },
    G_PERCEEL: {
      singular: 'G-perceel',
      plural: 'G-percelen',
      description:
        'Een perceel is een onroerende zaak, kadastraal geïdentificeerd en met ' +
        'kadastrale grenzen begrensd deel van het Nederlands grondgebied.',
      url:
        'https://www.amsterdam.nl/stelselpedia/brk-index/catalog-brk-levering/objectklasse-objec/',
      meta: [],
    },
    GEBIEDSGERICHTWERKEN: {
      singular: 'Gebiedsgerichtwerken-gebied',
      plural: 'Gebiedsgerichtwerken-gebieden',
      description:
        'Gebiedsgericht werken is een manier van werken om samenwerken in de stad te ' +
        'verbeteren. De samenwerking betreft gemeente, bewoners, ondernemers, (lokale) partners en ' +
        'maatschappelijke organisaties.',
      url: 'https://www.amsterdam.nl/stelselpedia/gebieden-index/catalogus/gebiedsgericht/',
      meta: [],
    },
    GEVRIJWAARDGEBIED: {
      singular: 'Gevrijwaard gebied',
      plural: 'Gevrijwaarde gebieden',
      description:
        'Binnen een gevrijwaarde gebied is detectie onderzoek uitgevoerd ' +
        'in de ondergrond. Daarbij is geen niet-gesprongen explosief aangetroffen.',
      url: null,
      meta: [],
    },
    GRONDEXPLOITATIE: {
      ...categoryLabels.grondexploitatie,
      description: '',
      url: null,
      meta: [],
    },
    GROOTSTEDELIJKGEBIED: {
      singular: 'Grootstedelijk gebied',
      plural: 'Grootstedelijke gebieden',
      description:
        'Grootstedelijke gebieden zijn gebieden binnen de gemeente Amsterdam, waar de ' +
        'gemeenteraad, het college van burgemeester en wethouders of de burgemeester bevoegd is.',
      url: 'https://www.amsterdam.nl/stelselpedia/gebieden-index/catalogus/grootstedelijk/',
      meta: [],
    },
    INSCHRIJVING: {
      singular: 'Inschrijving',
      plural: 'Inschrijvingen',
      description:
        "Een inschrijving is een duurzame 'maatschappelijke activiteit' van een " +
        'Onderneming of Rechtspersoon in het Handelsregister van de Kamer van Koophandel.',
      url: 'https://www.amsterdam.nl/stelselpedia/hr-index/catalogus/maatschappelijke/',
      meta: [],
      authLevel: 'EMPLOYEE',
    },
    INSLAGEN: {
      singular: 'Inslag',
      plural: 'Inslagen',
      description: 'Op deze locatie is tijdens de Tweede Wereldoorlog een vliegtuigbom ingeslagen.',
      url: null,
      meta: [],
    },
    LIGPLAATS: {
      singular: 'Ligplaats',
      plural: 'Ligplaatsen',
      description:
        'Een door het bevoegde gemeentelijke orgaan als zodanig aangewezen plaats ' +
        'in het water al dan niet aangevuld met een op de oever aanwezig terrein of een gedeelte ' +
        'daarvan, die bestemd is voor het permanent afmeren van een voor woon-, bedrijfsmatige ' +
        'of recreatieve doeleinden geschikt vaartuig.',
      url: 'https://www.amsterdam.nl/stelselpedia/bag-index/catalogus-bag/objectklasse-1/',
      meta: ['begin_geldigheid', 'document_mutatie', 'document_nummer', 'ligplaatsidentificatie'],
    },
    MEETBOUT: {
      ...categoryLabels.meetbout,
      description:
        'Om zakkingen van panden te kunnen volgen zijn op grote schaal meetbouten geplaatst ' +
        'in Amsterdam. De meetbouten zijn op ongeveer een halve meter van het maaiveld geplaatst in d' +
        'e gevel.',
      url: 'https://www.amsterdam.nl/stelselpedia/meetbouten-index/catalogus-amsterdams/meetbout/',
      meta: [],
    },
    MAATSCHAPPELIJKEACTIVITEIT: {
      ...categoryLabels.mac,
      description:
        'De Maatschappelijke Activiteit is het totaal van alle activiteiten uitgeoefend ' +
        'door een Natuurlijk Persoon of een Niet-natuurlijk Persoon. Een Maatschappelijke Activiteit ' +
        'kan ook als Onderneming voorkomen.',
      url: 'https://www.amsterdam.nl/stelselpedia/hr-index/catalogus/maatschappelijke/',
      meta: [],
    },
    METING: {
      singular: 'Meting',
      plural: 'Metingen',
      description:
        'De eerste meting, de zogenaamde nulmeting, is het uitgangspunt voor het beoordelen ' +
        'van eventuele deformatie (zakking). In principe zijn sindsdien drie herhalingsmetingen uitge' +
        'voerd. Het verschil tussen de nulmeting en de herhalingsmeting is een maat voor het zettings' +
        'gedrag.',
      url: 'https://www.amsterdam.nl/stelselpedia/meetbouten-index/catalogus-amsterdams/meting/',
      meta: [],
    },
    // plural because service call
    MONUMENTEN: {
      ...categoryLabels.monument,
      description:
        'Een monument is een onroerende zaak (fysiek bouwwerk of historische structuur) die ' +
        'beschermd is door middel van een status op grond van de Erfgoedverordening Amsterdam (voor ' +
        'gemeentelijke monumenten) of de Monumentenwet 1988 (voor rijksmonumenten), vanwege het algemeen ' +
        'belang wegens zijn schoonheid, betekenis voor de wetenschap of cultuurhistorische waarde.',
      url:
        'https://www.amsterdam.nl/stelselpedia/monumenten-index/catalogus-monumenten/objectklasse/',
      meta: ['monument_aanwijzingsdatum', 'identificerende_sleutel_monument'],
    },
    BOUWDOSSIER: {
      singular: 'Bouwdossier',
      plural: 'Bouwdossiers',
      description:
        'Een bouwdossier bevat de behandeling van de aanvraag tot een bouwvergunning ' +
        '(waaronder ook splitsings-, reclame- en sloopvergunningen), de vergunningverlening ervan ' +
        ' met de bijbehorende bouwtekeningen en het toezicht en de handhaving daarop.',
      url: null,
      meta: [],
    },
    NUMMERAANDUIDING: {
      ...categoryLabels.address,
      description:
        'Een nummeraanduiding, in de volksmond ook wel adres genoemd, is een door ' +
        'het bevoegde gemeentelijke orgaan als zodanig toegekende aanduiding van een ' +
        'verblijfsobject, standplaats of ligplaats',
      url: 'https://www.amsterdam.nl/stelselpedia/bag-index/catalogus-bag/objectklasse-2/',
      meta: [
        'begin_geldigheid',
        'document_mutatie',
        'document_nummer',
        'nummeraanduidingidentificatie',
      ],
    },
    OBJECT: {
      ...categoryLabels.kadastraalObject,
      description:
        'Een Kadastraal Object is een Onroerende zaak of een Teboekgestelde ' +
        'zaak waarvoor bij overdracht of vestiging van rechten inschrijving in de openbare registers van ' +
        'het Kadaster is vereist.',
      url:
        'https://www.amsterdam.nl/stelselpedia/brk-index/catalog-brk-levering/objectklasse-objec/',
      meta: ['id'],
    },
    OBJECT_WKPB: {
      singular: 'WKPB-uittreksel',
      plural: null,
      description: null,
      url: null,
      meta: [],
    },
    ONTSTAAN_UIT: {
      singular: 'Ontstaan uit',
      plural: 'Ontstaan uit',
      description: 'Kadastraal object is ontstaan uit een appartementsrechtsplitsing',
      url: 'https://www.amsterdam.nl/stelselpedia/brk-index/catalog-brk-levering/zakelijk-recht/',
      meta: [],
    },
    OPENBARERUIMTE: {
      singular: 'Openbare ruimte',
      plural: 'Openbare ruimtes',
      description:
        'Een openbare ruimte is een door het bevoegde gemeentelijke orgaan als ' +
        'zodanig aangewezen en van een naam voorziene buitenruimte die binnen één woonplaats is gelegen. ' +
        'Als openbare ruimte worden onder meer aangemerkt weg, water, terrein, spoorbaan en ' +
        'landschappelijk gebied.',
      url: 'https://www.amsterdam.nl/stelselpedia/bag-index/catalogus-bag/objectklasse-3/',
      meta: [
        'begin_geldigheid',
        'document_mutatie',
        'document_nummer',
        'openbare_ruimte_identificatie',
      ],
    },
    OPLAADPUNTEN: {
      ...categoryLabels.oplaadpunten,
      description: null,
      url: null,
      meta: [],
    },
    PAND: {
      ...categoryLabels.pand,
      description:
        'Een pand is de kleinste bij de totstandkoming functioneel en ' +
        'bouwkundig-constructief zelfstandige eenheid die direct en duurzaam met de aarde is ' +
        'verbonden en betreedbaar en afsluitbaar is.',
      url: 'https://www.amsterdam.nl/stelselpedia/bag-index/catalogus-bag/objectklasse-pand/',
      meta: ['begin_geldigheid', 'document_mutatie', 'document_nummer', 'pandidentificatie'],
    },
    PARKEERZONES: {
      ...categoryLabels.parkeerzones,
      description: '',
    },
    PARKEERZONES_UITZ: {
      ...categoryLabels.parkeerzonesUitz,
      description: '',
    },
    PEILMERK: {
      ...categoryLabels.napPeilmerk,
      description:
        'Het Normaal Amsterdams Peil (afgekort tot NAP) is de referentiehoogte ' +
        'waaraan hoogtemetingen in Nederland worden gerelateerd. Het NAP-net bestaat uit ongeveer ' +
        '50.000 zichtbare peilmerken en 250 ondergrondse peilmerken in Nederland, waarvan ongeveer ' +
        '1000 in Amsterdam.',
      url: 'https://www.amsterdam.nl/stelselpedia/geodesie-index/catalogus/',
      meta: ['begin_geldigheid', 'document_mutatie', 'document_nummer', 'landelijk_id'],
    },
    PARKEERVAKKEN: {
      ...categoryLabels.parkeervak,
      description:
        'Een parkeerplaats of parkeervak is een ruimte die is bestemd voor het parkeren van één voertuig.',
      url: null,
      meta: [],
    },
    ROLLAAG: {
      singular: 'Rollaag',
      plural: 'Rollagen',
      description:
        'Om de zakking van een heel bouwblok te bepalen worden rollagen gemeten. Een ' +
        'rollaag is een herkenbare laag in de bebouwing. Dit kan een doorlopende voeg zijn of ' +
        'een ander herkenbaar bouwkundig element.',
      url: 'https://www.amsterdam.nl/stelselpedia/meetbouten-index/catalogus-amsterdams/rollaag/',
      meta: [],
    },
    STADSDEEL: {
      singular: 'Stadsdeel',
      plural: 'Stadsdelen',
      description:
        'Door de Amsterdamse gemeenteraad vastgestelde begrenzing van een stadsdeel, ' +
        'ressorterend onder een stadsdeelbestuur.',
      url: 'https://www.amsterdam.nl/stelselpedia/gebieden-index/catalogus/stadsdeel/',
      meta: [
        'begin_geldigheid',
        'brondocument_datum',
        'brondocument_naam',
        'stadsdeelidentificatie',
      ],
    },
    STANDPLAATS: {
      singular: 'Standplaats',
      plural: 'Standplaatsen',
      description:
        'Een standplaats is een door het bevoegde gemeentelijke orgaan als zodanig ' +
        'aangewezen terrein of gedeelte daarvan dat bestemd is voor het permanent plaatsen van een ' +
        'niet direct en niet duurzaam met de aarde verbonden en voor woon -, bedrijfsmatige, ' +
        'of recreatieve doeleinden geschikte ruimte.',
      url: 'https://www.amsterdam.nl/stelselpedia/bag-index/catalogus-bag/objectklasse-4/',
      meta: ['begin_geldigheid', 'document_mutatie', 'document_nummer', 'standplaatsidentificatie'],
    },
    SUBJECT: {
      ...categoryLabels.kadastraalSubject,
      description:
        'Een Kadastraal subject is een persoon die in de kadastrale registratie voorkomt. ' +
        'Het kan hier gaan om een natuurlijk of een niet-natuurlijk persoon.',
      url:
        'https://www.amsterdam.nl/stelselpedia/brk-index/catalog-brk-levering/kadastraal-subject/',
      meta: ['id'],
    },
    UITGEVOERDONDERZOEK: {
      singular: 'Reeds uitgevoerd CE onderzoek',
      plural: 'Reeds uitgevoerde CE onderzoeken',
      description:
        'CE staat voor conventionele explosieven. Binnen dit gebied is al een ' +
        'keer onderzoek gedaan naar mogelijk achtergebleven explosieven uit de Tweede Wereldoorlog. ' +
        'Het resultaat van de onderzoeken leidt tot de conclusie wel of niet verdacht. Indien er ' +
        'sprake is van een conclusie ‘verdacht’ dan wordt dit als verdacht gebied op de kaart ' +
        'opgenomen.' +
        '<ul class="c-panel__list"><li>Een Vooronderzoek betreft een historisch onderzoek op ' +
        'basis van onder andere luchtfoto’s</li>' +
        '<li>Een Projectgebonden risicoanalyse kijkt gericht naar het veilig kunnen ' +
        'uitvoeren van voorgenomen werkzaamheden binnen een verdacht gebied. De resultaten zeggen ' +
        'dus niet per definitie dat ook andere werkzaamheden (dieper, meer trillingen veroorzakend) ' +
        'binnen het onderzoeksgebied veilig zijn uit te voeren zonder aanvullend onderzoek. ' +
        'Daar is mogelijk een andere projectgebonden risicoanalyse voor nodig.</li>' +
        '<li>Bij detectieonderzoek wordt de grond met radartechnieken onderzocht op verstoringen. ' +
        'Indien geen verstoringen worden aangetroffen tot de einddiepte waarop CE aanwezig zouden ' +
        'kunnen zijn, leidt dit tot de conclusie ‘gevrijwaard gebied’.</li></ul>',
      url: null,
      meta: [],
    },
    UNESCO: {
      singular: 'UNESCO',
      plural: 'UNESCO',
      description:
        'De Amsterdamse grachtengordel staat op de UNESCO Werelderfgoedlijst, ' +
        'wat betekent dat er internationale erkenning is van het bijzondere karakter van dit deel ' +
        'van de historische binnenstad. Het aanwijzen van cultureel erfgoed is bedoeld om het beter ' +
        'te kunnen bewaren voor toekomstige generaties.',
      url: 'https://www.amsterdam.nl/stelselpedia/gebieden-index/catalogus/unesco-werelderfgoed/',
      meta: [],
    },
    VASTGOED: {
      ...categoryLabels.vastgoed,
      description: '',
    },
    VERBLIJFSOBJECT: {
      singular: 'Verblijfsobject',
      plural: 'Verblijfsobjecten',
      description:
        'Een verblijfsobject is de kleinste binnen één of meer panden gelegen ' +
        'en voor woon -, bedrijfsmatige, of recreatieve doeleinden geschikte eenheid van gebruik ' +
        'die ontsloten wordt via een eigen afsluitbare toegang vanaf de openbare weg, een erf of een ' +
        'gedeelde verkeersruimte, onderwerp kan zijn van goederenrechtelijke rechtshandelingen ' +
        'en in functioneel opzicht zelfstandig is.',
      url: 'https://www.amsterdam.nl/stelselpedia/bag-index/catalogus-bag/objectklasse-0/',
      meta: [
        'begin_geldigheid',
        'document_mutatie',
        'document_nummer',
        'verblijfsobjectidentificatie',
      ],
    },
    VERDACHTGEBIED: {
      singular: 'Verdacht gebied',
      plural: ' Verdachte gebieden',
      description:
        'Het gebied valt binnen een contour van een gebeurtenis in de ' +
        'Tweede Wereldoorlog, bijvoorbeeld een bombardement. Het is niet uit te ' +
        'sluiten dat niet-gesprongen- explosieven nog in de (water-)bodem aanwezig ' +
        'zijn. Bij grondroerende werkzaamheden (zoals heien) is mogelijk ' +
        'aanvullend onderzoek nodig om veilig werken te kunnen waarborgen.',
      url: null,
      meta: [],
    },
    VESTIGING: {
      ...categoryLabels.vestiging,
      description:
        'Een Vestiging is gebouw of een complex van gebouwen waar duurzame uitoefening ' +
        'van activiteiten van een Onderneming of Rechtspersoon plaatsvindt.',
      url: 'https://www.amsterdam.nl/stelselpedia/hr-index/catalogus/vestiging/',
      meta: [],
      authLevel: 'EMPLOYEE',
    },
    WINKGEB: {
      ...categoryLabels.winkelgebied,
      description: '',
    },
    WOONPLAATS: {
      singular: 'Woonplaats',
      plural: 'Woonplaatsen',
      description:
        'Een woonplaats is een door het bevoegde gemeentelijke orgaan als zodanig ' +
        'aangewezen en van een naam voorzien gedeelte van het grondgebied van de gemeente. ' +
        'Vanaf 10 januari 2014 bestaat alleen nog de woonplaats Amsterdam met ' +
        'Woonplaatsidentificatie 3594.',
      url: 'https://www.amsterdam.nl/stelselpedia/bag-index/catalogus-bag/objectklasse/',
      meta: ['begin_geldigheid', 'document_mutatie', 'document_nummer', 'woonplaatsidentificatie'],
    },
    ZAKELIJK_RECHT: {
      singular: 'Zakelijk recht',
      plural: 'Zakelijke rechten',
      description:
        'Een Zakelijk Recht is een door een complex van rechtsregels verleende ' +
        'en beschermende bevoegdheid van een persoon. Het meest omvattende recht dat een ' +
        'persoon op een zaak kan hebben is eigendom.',
      url: 'https://www.amsterdam.nl/stelselpedia/brk-index/catalog-brk-levering/objectklasse-4/',
    },
  },
  META: {
    begin_geldigheid: {
      label: 'Datum begin geldigheid',
      type: 'date',
    },
    brondocument_datum: {
      label: 'Documentdatum mutatie',
      type: 'date',
    },
    brondocument_naam: {
      label: 'Documentnummer mutatie',
    },
    bouwblokidentificatie: {
      label: 'Bouwblokidentificatie',
    },
    buurtcombinatie_identificatie: {
      label: 'Wijk-identificatie',
    },
    buurtidentificatie: {
      label: 'Buurtidentificatie',
    },
    datum_in_werking: {
      label: 'Datum begin geldigheid',
      type: 'date',
    },
    datum_einde: {
      label: 'Datum einde geldigheid',
      type: 'date',
    },
    document_mutatie: {
      label: 'Documentdatum mutatie',
      type: 'date',
    },
    document_nummer: {
      label: 'Documentnummer mutatie',
    },
    id: {
      label: 'Identificatiecode',
    },
    identificerende_sleutel_complex: {
      label: 'Identificerende sleutel',
    },
    identificerende_sleutel_monument: {
      label: 'Identificerende sleutel',
    },
    ligplaatsidentificatie: {
      label: 'Ligplaatsidentificatie',
    },
    monument_aanwijzingsdatum: {
      label: 'Aanwijzingsdatum',
    },
    nummeraanduidingidentificatie: {
      label: 'Nummeraanduidingidentificatie',
    },
    openbare_ruimte_code: {
      label: 'Openbare ruimte code',
    },
    openbare_ruimte_identificatie: {
      label: 'Openbare ruimte identificatie',
    },
    pandidentificatie: {
      label: 'Pandidentificatie',
    },
    stadsdeelidentificatie: {
      label: 'Stadsdeelidentificatie',
    },
    standplaatsidentificatie: {
      label: 'Standplaatsidentificatie',
    },
    verblijfsobjectidentificatie: {
      label: 'Verblijfsobjectidentificatie',
    },
    woonplaatsidentificatie: {
      label: 'Woonplaatsidentificatie',
    },
  },
}

export default GLOSSARY
