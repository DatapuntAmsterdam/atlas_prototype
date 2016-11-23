(function () {
    'use strict';

    angular
        .module('dpDetail')
        .constant('STELSELPEDIA', {
            DEFINITIONS: {
                A_PERCEEL: {
                    label_singular: 'A-perceel',
                    label_plural: 'A-percelen',
                    description: 'Een appartementsrecht (art. 5:106 Burgerlijk Wetboek) is een onroerende zaak. ' +
                        'Onder appartementsrecht wordt verstaan een aandeel in de goederen die in de splitsing zijn ' +
                        'betrokken, dat de bevoegdheid omvat tot het uitsluitend gebruik van bepaalde gedeelten ' +
                        'van het gebouw die blijkens hun inrichting bestemd zijn of worden om als afzonderlijk ' +
                        'geheel te worden gebruikt. Het aandeel kan mede omvatten de bevoegdheid tot het uitsluitend ' +
                        'gebruik van bepaalde gedeelten van de bij het gebouw behorende grond.',
                    url: 'https://www.amsterdam.nl/stelselpedia/brk-index/catalog-brk-levering/objectklasse-objec/',
                    meta: []
                },
                AANTEKENING: {
                    label_singular: 'Aantekening',
                    label_plural: 'Aantekeningen',
                    description: 'Een Aantekening Kadastraal Object vormt de relatie tussen een Stukdeel en een ' +
                    'Kadastraal Object en geeft aanvullende informatie over een bestaand feit, genoemd in een stuk, ' +
                    'dat betrekking heeft op een object en dat gevolgen kan hebben voor de uitoefening van ' +
                    'rechten op het object.',
                    url: 'https://www.amsterdam.nl/stelselpedia/brk-index/catalog-brk-levering/objectklasse-aant/',
                    meta: []
                },
                BEPERKING: {
                    label_singular: 'Gemeentelijke beperking',
                    label_plural: 'Gemeentelijke beperkingen',
                    description: 'Lijst van beperkingen op een gebruiksrecht.',
                    url: 'https://www.amsterdam.nl/stelselpedia/wkpb-index/catalogus/beperking/#objectkenmerken',
                    meta: ['datum_in_werking', 'datum_einde']
                },
                BETROKKEN_BIJ: {
                    label_singular: 'Betrokken bij',
                    label_plural: 'Betrokken bij',
                    description: 'Kadastraal object is betrokken bij een appartementsrechtsplitsing',
                    url: 'https://www.amsterdam.nl/stelselpedia/brk-index/catalog-brk-levering/zakelijk-recht/',
                    meta: []
                },
                BOUWBLOK: {
                    label_singular: 'Bouwblok',
                    label_plural: 'Bouwblokken',
                    description: 'Een bouwblok is het kleinst mogelijk afgrensbare gebied, in zijn geheel ' +
                    'tot een buurt behorend, dat geheel of grotendeels door bestaande of aan te leggen wegen ' +
                    'en/of waterlopen is of zal zijn ingesloten en waarop tenminste één gebouw staat.',
                    url: 'https://www.amsterdam.nl/stelselpedia/gebieden-index/catalogus/bouwblok/',
                    meta: ['begin_geldigheid', 'bouwblokidentificatie']
                },
                BRONDOCUMENT: {
                    label_singular: 'Brondocument',
                    label_plural: 'Brondocumenten',
                    description: 'Het document dat aan de beperking ten grondslag ligt.',
                    url: 'https://www.amsterdam.nl/stelselpedia/wkpb-index/catalogus/brondocument/#objectkenmerken',
                    meta: []
                },
                BUURT: {
                    label_singular: 'Buurt',
                    label_plural: 'Buurten',
                    description: 'Een aaneengesloten gedeelte van een buurt, waarvan de grenzen zo veel mogelijk ' +
                    'gebaseerd zijn op topografische elementen.',
                    url: 'https://www.amsterdam.nl/stelselpedia/gebieden-index/catalogus/buurt/',
                    meta: ['begin_geldigheid', 'brondocument_datum', 'brondocument_naam', 'buurtidentificatie']
                },
                BUURTCOMBINATIE: {
                    label_singular: 'Buurtcombinatie',
                    label_plural: 'Buurtcombinaties',
                    description: 'Een aaneengesloten gedeelte van het grondgebied van een gemeente, waarvan ' +
                    'de grenzen zo veel mogelijk zijn gebaseerd op sociaal-geografische kenmerken.',
                    url: 'https://www.amsterdam.nl/stelselpedia/gebieden-index/catalogus/buurtcombinatie/',
                    meta: [
                        'begin_geldigheid',
                        'brondocument_datum',
                        'brondocument_naam',
                        'buurtcombinatie_identificatie'
                    ]
                },
                FUNCTIEVERVULLING: {
                    label_singular: 'Functievervulling',
                    label_plural: 'Functievervullingen',
                    description: 'Een FunctieVervulling geeft de relatie weer van de Persoon als functionaris ' +
                        'en de Persoon als eigenaar van de Onderneming of MaatschappelijkeActiviteit.',
                    url: 'https://www.amsterdam.nl/stelselpedia/hr-index/catalogus/functie-vervulling/',
                    meta: []
                },
                G_PERCEEL: {
                    label_singular: 'G-perceel',
                    label_plural: 'G-percelen',
                    description: 'Een perceel is een onroerende zaak, kadastraal geïdentificeerd en met ' +
                    'kadastrale grenzen begrensd deel van het Nederlands grondgebied.',
                    url: 'https://www.amsterdam.nl/stelselpedia/brk-index/catalog-brk-levering/objectklasse-objec/',
                    meta: []
                },
                GEBIEDSGERICHTWERKEN: {
                    label_singular: 'Gebiedsgericht-werken gebied',
                    label_plural: 'Gebiedsgericht-werken gebieden',
                    description: 'Gebiedsgericht werken is een manier van werken om samenwerken in de stad te ' +
                    'verbeteren. De samenwerking betreft gemeente, bewoners, ondernemers, (lokale) partners en ' +
                    'maatschappelijke organisaties.',
                    url: 'https://www.amsterdam.nl/stelselpedia/gebieden-index/catalogus/gebiedsgericht/',
                    meta: []
                },
                GROOTSTEDELIJKGEBIED: {
                    label_singular: 'Grootstedelijk gebied',
                    label_plural: 'Grootstedelijke gebieden',
                    description: 'Grootstedelijke gebieden zijn gebieden binnen de gemeente Amsterdam, waar de ' +
                    'gemeenteraad, het college van burgemeester en wethouders of de burgemeester bevoegd is.',
                    url: 'https://www.amsterdam.nl/stelselpedia/gebieden-index/catalogus/grootstedelijk/',
                    meta: []
                },
                LIGPLAATS: {
                    label_singular: 'Ligplaats',
                    label_plural: 'Ligplaatsen',
                    description: 'Een door het bevoegde gemeentelijke orgaan als zodanig aangewezen plaats ' +
                    'in het water al dan niet aangevuld met een op de oever aanwezig terrein of een gedeelte ' +
                    'daarvan, die bestemd is voor het permanent afmeren van een voor woon-, bedrijfsmatige ' +
                    'of recreatieve doeleinden geschikt vaartuig.',
                    url: 'https://www.amsterdam.nl/stelselpedia/bag-index/catalogus-bag/objectklasse-1/',
                    meta: [
                        'begin_geldigheid',
                        'document_mutatie',
                        'document_nummer',
                        'ligplaatsidentificatie',
                        'sleutelverzendend'
                    ]
                },
                MEETBOUT: {
                    label_singular: 'Meetbout',
                    label_plural: 'Meetbouten',
                    description: 'Om zakkingen van panden te kunnen volgen zijn op grote schaal meetbouten geplaatst ' +
                        'in Amsterdam. De meetbouten zijn op ongeveer een halve meter van het maaiveld geplaatst in d' +
                        'e gevel.',
                    url: 'https://www.amsterdam.nl/stelselpedia/meetbouten-index/catalogus-amsterdams/meetbout/',
                    meta: []
                },
                MAATSCHAPPELIJKEACTIVITEIT: {
                    label_singular: 'Maatschappelijke activiteit',
                    label_plural: 'Maatschappelijke activiteiten',
                    description: 'De Maatschappelijke Activiteit is het totaal van alle activiteiten uitgeoefend ' +
                        'door een Natuurlijk Persoon of een Niet-natuurlijk Persoon. Een Maatschappelijke Activiteit ' +
                        'kan ook als Onderneming voorkomen.',
                    url: 'https://www.amsterdam.nl/stelselpedia/hr-index/catalogus/maatschappelijke/',
                    meta: []
                },
                METING: {
                    label_singular: 'Meting',
                    label_plural: 'Metingen',
                    description: 'De eerste meting, de zogenaamde nulmeting, is het uitgangspunt voor het beoordelen ' +
                        'van eventuele deformatie (zakking). In principe zijn sindsdien drie herhalingsmetingen uitge' +
                        'voerd. Het verschil tussen de nulmeting en de herhalingsmeting is een maat voor het zettings' +
                        'gedrag.',
                    url: 'https://www.amsterdam.nl/stelselpedia/meetbouten-index/catalogus-amsterdams/meting/',
                    meta: []
                },
                NUMMERAANDUIDING: {
                    label_singular: 'Adres',
                    label_plural: 'Adressen',
                    description: 'Een nummeraanduiding, in de volksmond ook wel adres genoemd, is een door ' +
                        'het bevoegde gemeentelijke orgaan als zodanig toegekende aanduiding van een ' +
                        'verblijfsobject, standplaats of ligplaats',
                    url: 'https://www.amsterdam.nl/stelselpedia/bag-index/catalogus-bag/objectklasse-2/',
                    meta: [
                        'begin_geldigheid',
                        'document_mutatie',
                        'document_nummer',
                        'nummeraanduidingidentificatie',
                        'sleutelverzendend'
                    ]
                },
                OBJECT: {
                    label_singular: 'Kadastraal object',
                    label_plural: 'Kadastrale objecten',
                    description: 'Een Kadastraal Object is een Onroerende zaak of een Teboekgestelde ' +
                    'zaak waarvoor bij overdracht of vestiging van rechten inschrijving in de openbare registers van ' +
                    'het Kadaster is vereist.',
                    url: 'https://www.amsterdam.nl/stelselpedia/brk-index/catalog-brk-levering/objectklasse-objec/',
                    meta: ['id']
                },
                OBJECT_WKPB: {
                    label_singular: 'WKPB-uittreksel',
                    label_plural: null,
                    description: null,
                    url: null,
                    meta: []
                },
                ONTSTAAN_UIT: {
                    label_singular: 'Ontstaan uit',
                    label_plural: 'Ontstaan uit',
                    description: 'Kadastraal object is ontstaan uit een appartementsrechtsplitsing',
                    url: 'https://www.amsterdam.nl/stelselpedia/brk-index/catalog-brk-levering/zakelijk-recht/',
                    meta: []
                },
                OPENBARERUIMTE: {
                    label_singular: 'Openbare ruimte',
                    label_plural: 'Openbare ruimtes',
                    description: 'Een openbare ruimte is een door het bevoegde gemeentelijke orgaan als ' +
                    'zodanig aangewezen en van een naam voorziene buitenruimte die binnen één woonplaats is gelegen. ' +
                    'Als openbare ruimte worden onder meer aangemerkt weg, water, terrein, spoorbaan en ' +
                    'landschappelijk gebied.',
                    url: 'https://www.amsterdam.nl/stelselpedia/bag-index/catalogus-bag/objectklasse-3/',
                    meta: [
                        'begin_geldigheid',
                        'document_mutatie',
                        'document_nummer',
                        'openbare_ruimte_identificatie',
                        'sleutelverzendend',
                        'openbare_ruimte_code'
                    ]
                },
                PAND: {
                    label_singular: 'Pand',
                    label_plural: 'Panden',
                    description: 'Een pand is de kleinste bij de totstandkoming functioneel en ' +
                    'bouwkundig-constructief zelfstandige eenheid die direct en duurzaam met de aarde is ' +
                    'verbonden en betreedbaar en afsluitbaar is.',
                    url: 'https://www.amsterdam.nl/stelselpedia/bag-index/catalogus-bag/objectklasse-pand/',
                    meta: [
                        'begin_geldigheid',
                        'document_mutatie',
                        'document_nummer',
                        'pandidentificatie',
                        'sleutelverzendend'
                    ]
                },
                PEILMERK: {
                    label_singular: 'NAP peilmerk',
                    label_plural: 'NAP peilmerken',
                    description: 'Het Normaal Amsterdams Peil (afgekort tot NAP) is de referentiehoogte ' +
                    'waaraan hoogtemetingen in Nederland worden gerelateerd. Het NAP-net bestaat uit ongeveer ' +
                    '50.000 zichtbare peilmerken en 250 ondergrondse peilmerken in Nederland, waarvan ongeveer ' +
                    '1000 in Amsterdam.',
                    url: 'https://www.amsterdam.nl/stelselpedia/geodesie-index/catalogus/',
                    meta: [
                        'begin_geldigheid',
                        'document_mutatie',
                        'document_nummer',
                        'landelijk_id',
                        'sleutelverzendend'
                    ]
                },
                ROLLAAG: {
                    label_singular: 'Rollaag',
                    label_plural: 'Rollagen',
                    description: 'Om de zakking van een heel bouwblok te bepalen worden rollagen gemeten. Een ' +
                    'rollaag is een herkenbare laag in de bebouwing. Dit kan een doorlopende voeg zijn of ' +
                    'een ander herkenbaar bouwkundig element.',
                    url: 'https://www.amsterdam.nl/stelselpedia/meetbouten-index/catalogus-amsterdams/rollaag/',
                    meta: []
                },
                STADSDEEL: {
                    label_singular: 'Stadsdeel',
                    label_plural: 'Stadsdelen',
                    description: 'Door de Amsterdamse gemeenteraad vastgestelde begrenzing van een stadsdeel, ' +
                    'ressorterend onder een stadsdeelbestuur.',
                    url: 'https://www.amsterdam.nl/stelselpedia/gebieden-index/catalogus/stadsdeel/',
                    meta: ['begin_geldigheid', 'brondocument_datum', 'brondocument_naam', 'stadsdeelidentificatie']
                },
                STANDPLAATS: {
                    label_singular: 'Standplaats',
                    label_plural: 'Standplaatsen',
                    description: 'Een standplaats is een door het bevoegde gemeentelijke orgaan als zodanig ' +
                    'aangewezen terrein of gedeelte daarvan dat bestemd is voor het permanent plaatsen van een ' +
                    'niet direct en niet duurzaam met de aarde verbonden en voor woon -, bedrijfsmatige, ' +
                    'of recreatieve doeleinden geschikte ruimte.',
                    url: 'https://www.amsterdam.nl/stelselpedia/bag-index/catalogus-bag/objectklasse-4/',
                    meta: [
                        'begin_geldigheid',
                        'document_mutatie',
                        'document_nummer',
                        'standplaatsidentificatie',
                        'sleutelverzendend'
                    ]
                },
                SUBJECT: {
                    label_singular: 'Kadastraal subject',
                    label_plural: 'Kadastrale subjecten',
                    description: 'Een Kadastraal subject is een persoon die in de kadastrale registratie voorkomt. ' +
                    'Het kan hier gaan om een natuurlijk of een niet-natuurlijk persoon.',
                    url: 'https://www.amsterdam.nl/stelselpedia/brk-index/catalog-brk-levering/kadastraal-subject/',
                    meta: ['id']
                },
                UNESCO: {
                    label_singular: 'UNESCO',
                    label_plural: 'UNESCO',
                    description: 'De Amsterdamse grachtengordel staat op de UNESCO Werelderfgoedlijst, ' +
                    'wat betekent dat er internationale erkenning is van het bijzondere karakter van dit deel ' +
                    'van de historische binnenstad. Het aanwijzen van cultureel erfgoed is bedoeld om het beter ' +
                    'te kunnen bewaren voor toekomstige generaties.',
                    url: 'https://www.amsterdam.nl/stelselpedia/gebieden-index/catalogus/unesco-werelderfgoed/',
                    meta: []
                },
                VERBLIJFSOBJECT: {
                    label_singular: 'Verblijfsobject',
                    label_plural: 'Verblijfsobjecten',
                    description: 'Een verblijfsobject is de kleinste binnen één of meer panden gelegen ' +
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
                        'sleutelverzendend'
                    ]
                },
                VESTIGING: {
                    label_singular: 'Vestiging',
                    label_plural: 'Vestigingen',
                    description: 'Een Vestiging is gebouw of een complex van gebouwen waar duurzame uitoefening ' +
                        'van activiteiten van een Onderneming of Rechtspersoon plaatsvindt.',
                    url: 'https://www.amsterdam.nl/stelselpedia/hr-index/catalogus/vestiging/',
                    meta: []
                },
                WOONPLAATS: {
                    label_singular: 'Woonplaats',
                    label_plural: 'Woonplaatsen',
                    description: 'Een woonplaats is een door het bevoegde gemeentelijke orgaan als zodanig ' +
                        'aangewezen en van een naam voorzien gedeelte van het grondgebied van de gemeente. ' +
                        'Vanaf 10 januari 2014 bestaat alleen nog de woonplaats Amsterdam met ' +
                        'Woonplaatsidentificatie 3594.',
                    url: 'https://www.amsterdam.nl/stelselpedia/bag-index/catalogus-bag/objectklasse/',
                    meta: [
                        'begin_geldigheid',
                        'document_mutatie',
                        'document_nummer',
                        'woonplaatsidentificatie',
                        'sleutelverzendend'
                    ]
                },
                ZAKELIJK_RECHT: {
                    label_singular: 'Zakelijk recht',
                    label_plural: 'Zakelijke rechten',
                    description: 'Een Zakelijk Recht is een door een complex van rechtsregels verleende ' +
                        'en beschermende bevoegdheid van een persoon. Het meest omvattende recht dat een ' +
                        'persoon op een zaak kan hebben is eigendom.',
                    url: 'https://www.amsterdam.nl/stelselpedia/brk-index/catalog-brk-levering/objectklasse-4/'
                }
            },
            META: {
                begin_geldigheid: {
                    label: 'Datum begin geldigheid',
                    type: 'date'
                },
                brondocument_datum: {
                    label: 'Documentdatum mutatie',
                    type: 'date'
                },
                brondocument_naam: {
                    label: 'Documentnummer mutatie'
                },
                bouwblokidentificatie: {
                    label: 'Bouwblokidentificatie'
                },
                buurtcombinatie_identificatie: {
                    label: 'Buurtcombinatie-identificatie'
                },
                buurtidentificatie: {
                    label: 'Buurtidentificatie'
                },
                datum_in_werking: {
                    label: 'Datum begin geldigheid',
                    type: 'date'
                },
                datum_einde: {
                    label: 'Datum einde geldigheid',
                    type: 'date'
                },
                document_mutatie: {
                    label: 'Documentdatum mutatie',
                    type: 'date'
                },
                document_nummer: {
                    label: 'Documentnummer mutatie'
                },
                id: {
                    label: 'Identificatiecode'
                },
                ligplaatsidentificatie: {
                    label: 'Ligplaatsidentificatie'
                },
                nummeraanduidingidentificatie: {
                    label: 'Nummeraanduidingidentificatie'
                },
                openbare_ruimte_code: {
                    label: 'Openbare ruimte code'
                },
                openbare_ruimte_identificatie: {
                    label: 'Openbare ruimte identificatie'
                },
                pandidentificatie: {
                    label: 'Pandidentificatie'
                },
                sleutelverzendend: {
                    label: 'Sleutelverzendend'
                },
                stadsdeelidentificatie: {
                    label: 'Stadsdeelidentificatie'
                },
                standplaatsidentificatie: {
                    label: 'Standplaatsidentificatie'
                },
                verblijfsobjectidentificatie: {
                    label: 'Verblijfsobjectidentificatie'
                },
                woonplaatsidentificatie: {
                    label: 'Woonplaatsidentificatie'
                }
            }
        });
})();
