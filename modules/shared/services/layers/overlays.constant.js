(function () {
    'use strict';

    angular
        .module('dpShared')
        .constant('OVERLAYS', {
            SOURCES: {
                // overige niet gebruikt op dit moment
                bestemmingsplannen: {
                    label_short: 'Bestemmingsplannen',
                    label_long: 'Bestemmingsplannen',
                    url: 'http://afnemers.ruimtelijkeplannen.nl/afnemers/services',
                    layers: ['BP:HuidigeBestemming'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: 'http://www.ruimtelijkeplannen.nl/web-theme2.0/images/mapviewer/legend.png',
                    external: true
                },
                panorama_rijlijnen_2012: {
                    url: 'maps/panorama',
                    label_short: 'Straatbeeld rijlijnen 2012',
                    label_long: 'Straatbeeld rijlijnen 2012',
                    layers: ['panorama'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/maps/panorama?version=1.3.0&service=WMS&request=GetLe' +
                        'gendGraphic&sld_version=1.1.0&layer=panorama_punt&format=image/png&STYLE=default'
                },

                // economie
                hvo: {
                    url: 'maps/handelsregister',
                    label_short: 'Handel, vervoer, opslag',
                    label_long: 'Handel, vervoer, opslag',
                    layers: ['handel_vervoer_opslag', 'handel_vervoer_opslag_label'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/maps/handelsregister?version=1.3.0&service=WMS&request=GetLe' +
                        'gendGraphic&sld_version=1.1.0&layer=handel_vervoer_opslag&format=image/png&STYLE=default'
                },
                pir: {
                    url: 'maps/handelsregister',
                    label_short: 'Productie, install., repar.',
                    label_long: 'Productie installatie reparatie',
                    layers: ['productie_installatie_reparatie', 'productie_installatie_reparatie_label'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/maps/handelsregister?version=1.3.0&service=WMS&request=GetLe' +
                        'gendGraphic&sld_version=1.1.0&' +
                        'layer=productie_installatie_reparatie&format=image/png&STYLE=default'
                },
                bouw: {
                    url: 'maps/handelsregister',
                    label_short: 'Bouw',
                    label_long: 'Bouw',
                    layers: ['bouw', 'bouw_label'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/maps/handelsregister?version=1.3.0&service=WMS&request=GetLe' +
                        'gendGraphic&sld_version=1.1.0&layer=bouw&format=image/png&STYLE=default'
                },
                lb: {
                    url: 'maps/handelsregister',
                    label_short: 'Landbouw',
                    label_long: 'Landbouw',
                    layers: ['landbouw', 'landbouw_label'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/maps/handelsregister?version=1.3.0&service=WMS&request=GetLe' +
                        'gendGraphic&sld_version=1.1.0&layer=landbouw&format=image/png&STYLE=default'
                },
                hrc: {
                    url: 'maps/handelsregister',
                    label_short: 'Horeca',
                    label_long: 'Horeca',
                    layers: ['horeca', 'horeca_label'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/maps/handelsregister?version=1.3.0&service=WMS&request=GetLe' +
                        'gendGraphic&sld_version=1.1.0&layer=horeca&format=image/png&STYLE=default'
                },
                itc: {
                    url: 'maps/handelsregister',
                    label_short: 'Inform., telecom.',
                    label_long: 'Informatie telecommunicatie',
                    layers: ['telecommunicatie', 'telecommunicatie_label'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/maps/handelsregister?version=1.3.0&service=WMS&request=GetLe' +
                        'gendGraphic&sld_version=1.1.0&layer=telecommunicatie&format=image/png&STYLE=default'
                },
                fdvrog: {
                    url: 'maps/handelsregister',
                    label_short: 'Financ. dienstverl., verhuur',
                    label_long: 'financiële_dienstverlening_verhuur_van_roerend_en_onroerend_goed',
                    layers: ['financiele_dienstverlening_verhuur', 'financiele_dienstverlening_verhuur_label'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/maps/handelsregister?version=1.3.0&service=WMS&request=GetLe' +
                        'gendGraphic&sld_version=1.1.0&' +
                        'layer=financiele_dienstverlening_verhuur' +
                        '&format=image/png&STYLE=default'
                },
                zd: {
                    url: 'maps/handelsregister',
                    label_short: 'Zakelijke dienstverl.',
                    label_long: 'Zakelijke dienstverlening',
                    layers: ['zakelijke_dienstverlening', 'zakelijke_dienstverlening_label'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/maps/handelsregister?version=1.3.0&service=WMS&request=GetLe' +
                        'gendGraphic&sld_version=1.1.0&layer=zakelijke_dienstverlening&format=image/png&STYLE=default'
                },
                ooz: {
                    url: 'maps/handelsregister',
                    label_short: 'Overheid, onderwijs, zorg',
                    label_long: 'Overheid, onderwijs, zorg',
                    layers: ['overheid_onderwijs_zorg', 'overheid_onderwijs_zorg_label'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/maps/handelsregister?version=1.3.0&service=WMS&request=GetLe' +
                        'gendGraphic&sld_version=1.1.0&layer=overheid_onderwijs_zorg&format=image/png&STYLE=default'
                },
                csr: {
                    url: 'maps/handelsregister',
                    label_short: 'Cultuur, sport, recreatie',
                    label_long: 'Cultuur, sport, recreatie',
                    layers: ['cultuur_sport_recreatie', 'cultuur_sport_recreatie_label'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/maps/handelsregister?version=1.3.0&service=WMS&request=GetLe' +
                        'gendGraphic&sld_version=1.1.0&layer=cultuur_sport_recreatie&format=image/png&STYLE=default'
                },
                pd: {
                    url: 'maps/handelsregister',
                    label_short: 'Persoonl. dienstverl.',
                    label_long: 'Persoonlijke dienstverlening',
                    layers: ['persoonlijke_dienstverlening', 'persoonlijke_dienstverlening_label'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/maps/handelsregister?version=1.3.0&service=WMS&request=GetLe' +
                        'gendGraphic&sld_version=1.1.0&' +
                        'layer=persoonlijke_dienstverlening&format=image/png&STYLE=default'
                },
                ovrg: {
                    url: 'maps/handelsregister',
                    label_short: 'Overige',
                    label_long: 'Overige niet hierboven genoemd',
                    layers: ['overige', 'overige_label'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/maps/handelsregister?version=1.3.0&service=WMS&request=GetLe' +
                        'gendGraphic&sld_version=1.1.0&layer=overige&format=image/png&STYLE=default'
                },

                // onroerende zaken
                kadaster: {
                    url: 'maps/lki?service=wms',
                    label_short: 'Kadastrale perceelgrenzen',
                    label_long: 'Kadastrale perceelgrenzen',
                    layers: ['kadaster'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/lki?version=1.3.0&service=WMS&request=GetLegend' +
                        'Graphic&sld_version=1.1.0&layer=kadaster&format=image/png&STYLE=default'
                },
                bgem: {
                    url: 'maps/lki?service=wms',
                    label_short: 'Burgerlijke gemeenten',
                    label_long: 'Burgerlijke gemeenten',
                    layers: ['burgerlijke_gemeente', 'burgerlijke_gemeente_label'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/lki?version=1.3.0&service=WMS&request=GetLegend' +
                        'Graphic&sld_version=1.1.0&layer=burgerlijke_gemeente&format=image/png&STYLE=default'
                },
                kgem: {
                    url: 'maps/lki?service=wms',
                    label_short: 'Kadastrale gemeenten',
                    label_long: 'Kadastrale gemeenten',
                    layers: ['kadastrale_gemeente', 'kadastrale_gemeente_label'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/lki?version=1.3.0&service=WMS&request=GetLegend' +
                        'Graphic&sld_version=1.1.0&layer=kadastrale_gemeente&format=image/png&STYLE=default'
                },
                ksec: {
                    url: 'maps/lki?service=wms',
                    label_short: 'Kadastrale secties',
                    label_long: 'Kadastrale secties',
                    layers: ['kadastrale_sectie', 'kadastrale_sectie_label'],
                    minZoom: 10,
                    maxZoom: 16,
                    legend: '/maps/lki?version=1.3.0&service=WMS&request=GetLegend' +
                        'Graphic&sld_version=1.1.0&layer=kadastrale_sectie&format=image/png&STYLE=default'
                },
                kot: {
                    url: 'maps/lki?service=wms',
                    label_short: 'Kadastrale objecten',
                    label_long: 'Kadastrale objecten',
                    layers: ['kadastraal_object', 'kadastraal_object_label'],
                    minZoom: 12,
                    maxZoom: 16,
                    legend: '/maps/lki?version=1.3.0&service=WMS&request=GetLegend' +
                        'Graphic&sld_version=1.1.0&layer=kadastraal_object&format=image/png&STYLE=default'
                },
                gbep: {
                    url: 'maps/wkpb',
                    label_short: 'Gemeentelijke beperkingen',
                    label_long: 'Gemeentelijke beperkingen',
                    layers: ['wkpb'],
                    minZoom: 12,
                    maxZoom: 16,
                    legend: '/maps/wkpb?version=1.3.0&service=WMS&request=GetLegend' +
                        'Graphic&sld_version=1.1.0&layer=wkpb&format=image/png&STYLE=default'
                },

                // geografie: gebieden
                gsg: {
                    url: 'maps/gebieden?service=wms',
                    label_short: 'Grootstedelijke gebieden',
                    label_long: 'Grootstedelijke gebieden',
                    layers: ['grootstedelijkgebied', 'grootstedelijkgebied_label'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/gebieden?version=1.3.0&service=WMS&request=GetLegend' +
                        'Graphic&sld_version=1.1.0&layer=grootstedelijkgebied&format=image/png&STYLE=default'
                },
                unesco: {
                    url: 'maps/gebieden?service=wms',
                    label_short: 'Unesco werelderfgoed',
                    label_long: 'Unesco werelderfgoed',
                    layers: ['unesco', 'unesco_label'],
                    minZoom: 9,
                    maxZoom: 16,
                    legend: '/maps/gebieden?version=1.3.0&service=WMS&request=GetLe' +
                        'gendGraphic&sld_version=1.1.0&layer=unesco&format=image/png&STYLE=default'
                },
                sd: {
                    url: 'maps/gebieden?service=wms',
                    label_short: 'Stadsdelen',
                    label_long: 'Stadsdelen',
                    layers: ['stadsdeel', 'stadsdeel_label'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/gebieden?version=1.3.0&service=WMS&request=GetLegend' +
                        'Graphic&sld_version=1.1.0&layer=stadsdeel&format=image/png&STYLE=default'
                },
                ggw: {
                    url: 'maps/gebieden?service=wms',
                    label_short: 'Gebiedsgerichtwerken gebieden',
                    label_long: 'Gebiedsgerichtwerken gebieden',
                    layers: ['gebiedsgerichtwerken', 'gebiedsgerichtwerken_label'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/gebieden?version=1.3.0&service=WMS&request=GetLegend' +
                        'Graphic&sld_version=1.1.0&layer=gebiedsgerichtwerken&format=image/png&STYLE=default'
                },
                bc: {
                    url: 'maps/gebieden?service=wms',
                    label_short: 'Buurtcombinaties',
                    label_long: 'Buurtcombinaties',
                    layers: ['buurtcombinatie', 'buurtcombinatie_label'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/gebieden?version=1.3.0&service=WMS&request=GetLegend' +
                        'Graphic&sld_version=1.1.0&layer=buurtcombinatie&format=image/png&STYLE=default'
                },
                buurt: {
                    url: 'maps/gebieden?service=wms',
                    label_short: 'Buurten',
                    label_long: 'Buurten',
                    layers: ['buurt', 'buurt_label'],
                    minZoom: 10,
                    maxZoom: 16,
                    legend: '/maps/gebieden?version=1.3.0&service=WMS&request=GetLegend' +
                        'Graphic&sld_version=1.1.0&layer=buurt&format=image/png&STYLE=default'
                },
                bbn: {
                    url: 'maps/gebieden?service=wms',
                    label_short: 'Bouwblokken',
                    label_long: 'Bouwblokken',
                    layers: ['bouwblok', 'bouwblok_label'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/maps/gebieden?version=1.3.0&service=WMS&request=GetLegend' +
                        'Graphic&sld_version=1.1.0&layer=bouwblok&format=image/png&STYLE=default'
                },

                // geografie: hoogte
                dsm: {
                    label_short: 'Terreinmodel (DSM AHN)',
                    label_long: 'Terreinmodel (DSM AHN)',
                    url: 'https://geodata.nationaalgeoregister.nl/ahn3/wms?',
                    layers: ['ahn3_05m_dsm'],
                    minZoom: 10,
                    maxZoom: 16,
                    legend: 'https://geodata.nationaalgeoregister.nl/ahn3/ows?service=WMS&request=GetLegendGraphic&fo' +
                        'rmat=image%2Fpng&width=20&height=20&layer=ahn3_05m_dsm&style=ahn3_05m',
                    external: true
                },
                dtm: {
                    label_short: 'Oppervlaktemodel (DTM AHN)',
                    label_long: 'Oppervlaktemodel (DTM AHN)',
                    url: 'https://geodata.nationaalgeoregister.nl/ahn3/wms?',
                    layers: ['ahn3_05m_dtm'],
                    minZoom: 10,
                    maxZoom: 16,
                    legend: 'https://geodata.nationaalgeoregister.nl/ahn3/ows?service=WMS&request=GetLegendGraphic&fo' +
                        'rmat=image%2Fpng&width=20&height=20&layer=ahn3_05m_dtm&style=ahn3_05m',
                    external: true
                },
                nap: {
                    url: 'maps/nap',
                    label_short: 'Normaal Amsterdams Peil (NAP)',
                    label_long: 'Normaal Amsterdams Peil (NAP)',
                    layers: ['peilmerk_hoogte', 'peilmerk_label'],
                    minZoom: 10,
                    maxZoom: 16,
                    legend: '/maps/nap?version=1.3.0&service=WMS&request=GetLegendG' +
                        'raphic&sld_version=1.1.0&layer=NAP&format=image/png&STYLE=default'
                },
                mbs: {
                    url: 'maps/meetbouten?service=wms',
                    label_short: 'Meetbouten - Status',
                    label_long: 'Meetbouten - Status',
                    layers: ['meetbouten_status', 'meetbouten_labels'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/maps/meetbouten?version=1.3.0&service=WMS&request=Get' +
                        'LegendGraphic&sld_version=1.1.0&layer=meetbouten_status&format=image/png&STYLE=default'
                },
                mbz: {
                    url: 'maps/meetbouten?service=wms',
                    label_short: 'Meetbouten - Zaksnelheid',
                    label_long: 'Meetbouten - Zaksnelheid',
                    layers: ['meetbouten_zaksnelheid', 'meetbouten_labels'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/maps/meetbouten?version=1.3.0&service=WMS&request=Get' +
                        'LegendGraphic&sld_version=1.1.0&layer=meetbouten_zaksnelheid&format=image/png&STYLE=default'
                },
                mbr: {
                    url: 'maps/meetbouten',
                    label_short: 'Meetbouten - Referentiepunten',
                    label_long: 'Meetbouten - Referentiepunten',
                    layers: ['referentiepunten'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/maps/meetbouten?version=1.3.0&service=WMS&request=Get' +
                        'LegendGraphic&sld_version=1.1.0&layer=referentiepunten&format=image/png&STYLE=default'
                },

                // milieu bodem
                mbgm: {
                    url: 'maps/bodem',
                    label_short: 'Grondmonster',
                    label_long: 'Grondmonster',
                    layers: ['grondmonsters'],
                    minZoom: 10,
                    maxZoom: 16,
                    legend: '/maps/bodem?version=1.3.0&service=WMS&request=GetLegen' +
                        'dGraphic&sld_version=1.1.0&layer=grondmonsters&format=image/png&STYLE=default'
                },
                mbgwm: {
                    url: 'maps/bodem',
                    label_short: 'Grondwatermonster',
                    label_long: 'Grondwatermonster',
                    layers: ['grondwatermonsters'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/bodem?version=1.3.0&service=WMS&request=GetLegen' +
                        'dGraphic&sld_version=1.1.0&layer=grondwatermonsters&format=image/png&STYLE=default'
                },
                mbaig: {
                    url: 'maps/bodem',
                    label_short: 'Asbest in grond',
                    label_long: 'Asbest in grond',
                    layers: ['asbest'],
                    minZoom: 10,
                    maxZoom: 16,
                    legend: '/maps/bodem?version=1.3.0&service=WMS&request=GetLegen' +
                        'dGraphic&sld_version=1.1.0&layer=asbest&format=image/png&STYLE=default'
                },
                exin: {
                    url: 'maps/bommenkaart',
                    label_short: 'Explosieven - Inslagen',
                    label_long: 'Explosieven - Inslagen',
                    layers: ['inslagen'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: 'maps/bommenkaart?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&la' +
                    'yer=inslagen&format=image/png&STYLE=default'
                },
                exvg: {
                    url: 'maps/bommenkaart',
                    label_short: 'Explosieven - Verdachte gebieden',
                    label_long: 'Explosieven - Verdachte gebieden',
                    layers: ['verdachte_gebieden'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: 'maps/bommenkaart?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&la' +
                    'yer=verdachte_gebieden&format=image/png&STYLE=default'
                },
                exgg: {
                    url: 'maps/bommenkaart',
                    label_short: 'Explosieven - Gevrijwaarde gebieden',
                    label_long: 'Explosieven - Gevrijwaarde gebieden',
                    layers: ['gevrijwaarde_gebieden'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: 'maps/bommenkaart?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&la' +
                        'yer=gevrijwaarde_gebieden&format=image/png&STYLE=default'
                },
                exuo: {
                    url: 'maps/bommenkaart',
                    label_short: 'Explosieven - Uitgevoerde onderzoeken',
                    label_long: 'Explosieven - Uitgevoerde onderzoeken',
                    layers: ['uitgevoerde_CE_onderzoeken'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: 'maps/bommenkaart?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&la' +
                    'yer=uitgevoerde_CE_onderzoeken&format=image/png&STYLE=default'
                },

                // milieu: veiligheid
                mvlpgv: {
                    url: 'maps/externeveiligheid',
                    label_short: 'LPG-vulpunt - Risicozones',
                    label_long: 'LPG-vulpunt - Risicozones',
                    layers: [
                        'lpgvulpuntinvloedsgebied',
                        'lpgvulpuntplaatsgebondenrisico106',
                        'lpgvulpuntplaatsgebondenrisico105',
                        'lpgvulpuntlocaties'
                    ],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/externeveiligheid?version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_lpg_vulpunt&format=image/png&' +
                        'STYLE=default'
                },
                mvlpga: {
                    url: 'maps/externeveiligheid',
                    label_short: 'LPG-afleverzuil - Risicozones',
                    label_long: 'LPG-afleverzuil - Risicozones',
                    layers: ['milieu_veiligheid_lpg_afleverzuil'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/externeveiligheid?version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_lpg_afleverzuil&format=image/' +
                        'png&STYLE=default'
                },
                mvlpgt: {
                    url: 'maps/externeveiligheid',
                    label_short: 'LPG-tank - Risicozones',
                    label_long: 'LPG-tank - Risicozones',
                    layers: ['lpgtankinvloedsgebied', 'lpgtankplaatsgebondenrisico', 'lpgtankligging'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/externeveiligheid?version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_lpg_tank&format=image/png&STY' +
                        'LE=default'
                },
                mvlpgs: {
                    url: 'maps/externeveiligheid',
                    label_short: 'LPG-station - Risicozones',
                    label_long: 'LPG-station - Risicozones',
                    layers: ['lpgstationcontouren', 'lpgstationslocaties'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/externeveiligheid?version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_lpg_station&format=image/png&' +
                        'STYLE=default'
                },
                mvbr: {
                    url: 'maps/externeveiligheid',
                    label_short: 'Bedrijf - bronnen en risicozones',
                    label_long: 'Bedrijf - bronnen en risicozones',
                    layers: ['overigerisicobedrijven'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/externeveiligheid?version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=overigerisicobedrijven&format=image/png&STYLE=d' +
                        'efault'
                },
                mvbd: {
                    url: 'maps/externeveiligheid',
                    label_short: 'Bedrijf - Terreingrens',
                    label_long: 'Bedrijf - Terreingrens',
                    layers: ['milieu_veiligheid_bedrijf'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/externeveiligheid?version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_bedrijf&format=image/png&STYL' +
                        'E=default'
                },
                mvabl: {
                    url: 'maps/externeveiligheid',
                    label_short: 'Aardgasbuisleid. - Risicozones',
                    label_long: 'Aardgasbuisleidingen - Risicozones',
                    layers: ['milieu_veiligheid_aardgasbuisleidingen'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/externeveiligheid?version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_aardgasbuisleidingen&format=i' +
                        'mage/png&STYLE=default'
                },
                mvsw: {
                    url: 'maps/externeveiligheid',
                    label_short: 'Spoorwegen - Risicozones',
                    label_long: 'Spoorwegen - Risicozones',
                    layers: ['risicozonesspoorweg'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/externeveiligheid?version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=risicozonesspoorweg&format=image/png&STYLE=defa' +
                        'ult'
                },
                mvvw: {
                    url: 'maps/externeveiligheid',
                    label_short: 'Vaarwegen - Risicozones',
                    label_long: 'Vaarwegen - Risicozones',
                    layers: ['risicozonesvaarweg'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/externeveiligheid?version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=risicozonesvaarweg&format=image/png&STYLE=default'
                },
                mvw: {
                    url: 'maps/externeveiligheid',
                    label_short: 'Wegen - Risicozones',
                    label_long: 'Wegen - Risicozones',
                    layers: ['risicozonesweg'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/externeveiligheid?version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=risicozonesweg&format=image/png&STYLE=default'
                },
                mvvo: {
                    url: 'maps/externeveiligheid',
                    label_short: 'Vuurwerkopslag - Veilig.afst.',
                    label_long: 'Vuurwerkopslag - Veiligheidsafstanden',
                    layers: ['milieu_veiligheid_vuurwerk'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/externeveiligheid?version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_vuurwerk&format=image/png&STY' +
                        'LE=default'
                },
                mvmo: {
                    url: 'maps/externeveiligheid',
                    label_short: 'Munitieopslag - Veilig.afst.',
                    label_long: 'Munitieopslag - Veiligheidsafstanden',
                    layers: ['milieu_veiligheid_munitie'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/externeveiligheid?version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_munitie&format=image/png&STYL' +
                        'E=default'
                },
                mvgms: {
                    url: 'maps/externeveiligheid',
                    label_short: 'Gasdruk...stations - Veilig.afst.',
                    label_long: 'Gasdrukregel- en meetstation - Veiligheidsafstanden',
                    layers: ['milieu_veiligheid_gasdrukregel_meetstation'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/externeveiligheid?version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_gasdrukregel_meetstation&form' +
                        'at=image/png&STYLE=default'
                },
                mvsls: {
                    url: 'maps/externeveiligheid',
                    label_short: 'Sluis - Veilig.afst.',
                    label_long: 'Sluis - Veiligheidsafstanden',
                    layers: ['milieu_veiligheid_sluis'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/externeveiligheid?version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_sluis&format=image/png&STYLE=' +
                        'default'
                },
                mvwp: {
                    url: 'maps/externeveiligheid',
                    label_short: 'Wachtplaatsen - Veilig.afst.',
                    label_long: 'Wachtplaatsen - Veiligheidsafstanden',
                    layers: ['milieu_veiligheid_wachtplaats'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/externeveiligheid?version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_wachtplaats&format=image/png&' +
                        'STYLE=default'
                },
                mvbs: {
                    url: 'maps/externeveiligheid',
                    label_short: 'Bunkerschepen - Veilig.afst.',
                    label_long: 'Bunkerschepen - Veiligheidsafstanden',
                    layers: ['milieu_veiligheid_bunkerschepen'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/externeveiligheid?version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_bunkerschepen&format=image/pn' +
                        'g&STYLE=default'
                },

                // milieu zones
                mgpind: {
                    url: 'maps/planologischegeluidszones',
                    label_short: 'Industrie - Geluidszones',
                    label_long: 'Industrie - Geluidszones',
                    layers: [
                        'gezoneerdindustrieterrein',
                        'geluidzoneindustrieterrein',
                        'indicatievecontour55dbindustrieterrein'
                    ],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/planologischegeluidszones?version=1.3.0&service=' +
                        'WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=milieu_geluid_planologisch_industrie&fo' +
                        'rmat=image/png&STYLE=default'
                },
                mgsw: {
                    url: 'maps/planologischegeluidszones',
                    label_short: 'Spoorwegen - Geluidszones',
                    label_long: 'Spoorwegen - Geluidszones',
                    layers: ['spoorwegen'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/planologischegeluidszones?version=1.3.0&service=' +
                        'WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=spoorwegen&format=image/png&STYLE=default'
                },
                mgpm: {
                    url: 'maps/planologischegeluidszones',
                    label_short: 'Metro - Geluidszones',
                    label_long: 'Metro - Geluidszones',
                    layers: ['metro'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/planologischegeluidszones?version=1.3.0&service=' +
                        'WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=metro&format=image/png&STYLE=default'
                },
                mgpsh: {
                    url: 'maps/planologischezonesschiphol',
                    label_short: 'Schiphol - Ruimtelijke beperkingen',
                    label_long: 'Schiphol - Ruimtelijke beperkingen',
                    layers: ['geluidszoneschiphol'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/planologischezonesschiphol?version=1.3.0&service' +
                        '=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=geluidszoneschiphol&format=image/png&S' +
                        'TYLE=default'
                },
                mghv: {
                    url: 'maps/planologischezonesschiphol',
                    label_short: 'Schiphol - Hoogtebeperking',
                    label_long: 'Schiphol - Hoogtebeperking',
                    layers: ['hoogtebeperkingschiphol'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/planologischezonesschiphol?version=1.3.0&service' +
                        '=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=hoogtebeperkingschiphol&format=image/p' +
                        'ng&STYLE=default'
                },
                mgvvgsh: {
                    url: 'maps/planologischezonesschiphol',
                    label_short: 'Schiphol - Vogelvrijwaring',
                    label_long: 'Schiphol - Vogelvrijwaring',
                    layers: ['vogelvrijwaringsgebiedschiphol'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/maps/planologischezonesschiphol?version=1.3.0&service' +
                        '=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=vogelvrijwaringsgebiedschiphol&format=' +
                        'image/png&STYLE=default'
                },

                // Verkeer
                pv: {
                    url: 'maps/parkeervakken',
                    label_short: 'Parkeervakken',
                    label_long: 'Parkeervakken',
                    layers: ['alle_parkeervakken', 'parkeervakken_label'],
                    minZoom: 10,
                    maxZoom: 16,
                    legend: '/maps/parkeervakken?version=1.3.0&service=WMS&request=' +
                        'GetLegendGraphic&sld_version=1.1.0&layer=alle_parkeervakken&format=image/png&STYLE=de' +
                        'fault'
                },
                pvb: {
                    url: 'maps/parkeervakken',
                    label_short: 'Parkeervakken - Borden',
                    label_long: 'Parkeervakken - Borden',
                    layers: ['alle_parkeervakken', 'parkeervakken_bord'],
                    minZoom: 10,
                    maxZoom: 16,
                    legend: '/maps/parkeervakken?version=1.3.0&service=WMS&request=' +
                        'GetLegendGraphic&sld_version=1.1.0&layer=parkeervakken_bord&format=image/png&STYLE=de' +
                        'fault'
                },
                pvr: {
                    url: 'maps/parkeervakken',
                    label_short: 'Parkeervakken - Gereserveerd',
                    label_long: 'Parkeervakken - Gereserveerd',
                    layers: ['parkeervakken_reservering', 'parkeervakken_reservering_label'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/maps/parkeervakken?version=1.3.0&service=WMS&request=' +
                        'GetLegendGraphic&sld_version=1.1.0&layer=parkeervakken_reservering&format=image/png&STYLE=de' +
                        'fault'
                }
            },
            HIERARCHY: [
                {
                    heading: 'Economie',
                    overlays: [
                        'hvo',
                        'pir',
                        'bouw',
                        'lb',
                        'hrc',
                        'itc',
                        'fdvrog',
                        'zd',
                        'ooz',
                        'csr',
                        'pd',
                        'ovrg'
                    ]
                }, {
                    heading: 'Onroerende zaken',
                    overlays: [
                        'bgem',
                        'kgem',
                        'ksec',
                        'kot',
                        'gbep'
                    ]
                }, {
                    heading: 'Geografie: gebieden',
                    overlays: [
                        'gsg',
                        'unesco',
                        'sd',
                        'ggw',
                        'bc',
                        'buurt',
                        'bbn'
                    ]
                }, {
                    heading: 'Geografie: hoogte',
                    overlays: [
                        'dsm',
                        'dtm',
                        'nap',
                        'mbs',
                        'mbz',
                        'mbr'
                    ]
                }, {
                    heading: 'Milieu: bodem',
                    overlays: [
                        'mbgm',
                        'mbgwm',
                        'mbaig',
                        'exin',
                        'exvg',
                        'exgg',
                        'exuo'
                    ]
                }, {
                    heading: 'Milieu: externe veiligheid',
                    overlays: [
                        'mvlpgv',
                        'mvlpga',
                        'mvlpgt',
                        'mvlpgs',
                        'mvbr',
                        'mvbd',
                        'mvabl',
                        'mvsw',
                        'mvvw',
                        'mvw',
                        'mvvo',
                        'mvmo',
                        'mvgms',
                        'mvsls',
                        'mvwp',
                        'mvbs'
                    ]
                }, {
                    heading: 'Milieu: zones',
                    overlays: [
                        'mgpind',
                        'mgsw',
                        'mgpm',
                        'mgpsh',
                        'mghv',
                        'mgvvgsh'
                    ]
                }, {
                    heading: 'Verkeer',
                    overlays: [
                        'pv',
                        'pvb',
                        'pvr'
                    ]
                }
            ]
        });
})();
