(function(){
    'use strict';

    angular
        .module('dpShared')
        .constant('OVERLAYS', {
            SOURCES: {
                kadaster: {
                    label_short: 'Kadastrale perceelgrenzen',
                    label_long: 'Kadastrale perceelgrenzen',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/lki.map&service=wms',
                    layers: ['kadaster'],
                    minZoom: 8,
                    maxZoom: 16
                },
                gemeentelijke_beperkingen: {
                    label_short: 'Gemeentelijke beperkingen',
                    label_long: 'Gemeentelijke beperkingen',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/wkpb.map&service=wms',
                    layers: ['wkpb'],
                    minZoom: 12,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/wkpb.map&version=1.3.0&service=WMS&request=GetLegend' +
                        'Graphic&sld_version=1.1.0&layer=wkpb&format=image/png&STYLE=default'
                },
                stadsdeel: {
                    label_short: 'Stadsdelen',
                    label_long: 'Stadsdelen',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/gebieden.map&service=wms',
                    layers: ['stadsdeel', 'stadsdeel_label'],
                    minZoom: 8,
                    maxZoom: 16
                },
                buurtcombinatie: {
                    label_short: 'Buurtcombinaties',
                    label_long: 'Buurtcombinaties',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/gebieden.map&service=wms',
                    layers: ['buurtcombinatie', 'buurtcombinatie_label'],
                    minZoom: 8,
                    maxZoom: 16
                },
                buurt: {
                    label_short: 'Buurten',
                    label_long: 'Buurten',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/gebieden.map&service=wms',
                    layers: ['buurt', 'buurt_label'],
                    minZoom: 10,
                    maxZoom: 16
                },
                gebiedsgericht_werken: {
                    label_short: 'Gebiedsgerichtwerken gebieden',
                    label_long: 'Gebiedsgerichtwerken gebieden',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/gebieden.map&service=wms',
                    layers: ['gebiedsgerichtwerken', 'gebiedsgerichtwerken_label'],
                    minZoom: 8,
                    maxZoom: 16
                },
                grootstedelijkgebied: {
                    label_short: 'Grootstedelijke gebieden',
                    label_long: 'Grootstedelijke gebieden',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/gebieden.map&service=wms',
                    layers: ['grootstedelijkgebied', 'grootstedelijkgebied_label'],
                    minZoom: 8,
                    maxZoom: 16
                },
                bouwblokken: {
                    label_short: 'Bouwblokken',
                    label_long: 'Bouwblokken',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/gebieden.map&service=wms',
                    layers: ['bouwblok', 'bouwblok_label'],
                    minZoom: 11,
                    maxZoom: 16
                },
                unesco: {
                    label_short: 'Unesco werelderfgoed',
                    label_long: 'Unesco werelderfgoed',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/gebieden.map&service=wms',
                    layers: ['unesco', 'unesco_label'],
                    minZoom: 9,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/gebieden.map&version=1.3.0&service=WMS&request=GetLe' +
                        'ge=ndGraphic&sld_version=1.1.0&layer=unesco&format=image/png&STYLE=default'
                },
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
                nap: {
                    label_short: 'Normaal Amsterdams Peil (NAP)',
                    label_long: 'Normaal Amsterdams Peil (NAP)',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/nap.map&service=wms',
                    layers: ['peilmerk_hoogte', 'peilmerk_label'],
                    minZoom: 10,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/nap.map&version=1.3.0&service=WMS&request=GetLegendG' +
                        'raphic&sld_version=1.1.0&layer=NAP&format=image/png&STYLE=default'
                },
                meetbouten_status: {
                    label_short: 'Meetbouten - Status',
                    label_long: 'Meetbouten - Status',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/meetbouten.map&service=wms',
                    layers: ['meetbouten_status', 'meetbouten_labels'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/meetbouten.map&version=1.3.0&service=WMS&request=Get' +
                        'LegendGraphic&sld_version=1.1.0&layer=meetbouten_status&format=image/png&STYLE=default'
                },
                meetbouten_zaksnelheid: {
                    label_short: 'Meetbouten - Zaksnelheid',
                    label_long: 'Meetbouten - Zaksnelheid',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/meetbouten.map&service=wms',
                    layers: ['meetbouten_zaksnelheid', 'meetbouten_labels'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/meetbouten.map&version=1.3.0&service=WMS&request=Get' +
                        'LegendGraphic&sld_version=1.1.0&layer=meetbouten_zaksnelheid&format=image/png&STYLE=default'
                },
                meetbouten_referentiepunten: {
                    label_short: 'Meetbouten - Referentiepunten',
                    label_long: 'Meetbouten - Referentiepunten',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/meetbouten.map&service=wms',
                    layers: ['referentiepunten'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/meetbouten.map&version=1.3.0&service=WMS&request=Get' +
                        'LegendGraphic&sld_version=1.1.0&layer=referentiepunten&format=image/png&STYLE=default'
                },
                panorama_rijlijnen_2012: {
                    label_short: 'Straatbeeld rijlijnen 2012',
                    label_long: 'Straatbeeld rijlijnen 2012',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/panorama.map&service=wms',
                    layers: ['panorama'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/panorama.map&version=1.3.0&service=WMS&request=GetLe' +
                        'gendGraphic&sld_version=1.1.0&layer=panorama_punt&format=image/png&STYLE=default'
                },
                milieu_bodem_grondmonsters: {
                    label_short: 'Grondmonster',
                    label_long: 'Grondmonster',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/bodem.map&service=wms',
                    layers: ['grondmonsters'],
                    minZoom: 10,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/bodem.map&version=1.3.0&service=WMS&request=GetLegen' +
                        'dGraphic&sld_version=1.1.0&layer=grondmonsters&format=image/png&STYLE=default'
                },
                milieu_bodem_grondwatermonsters: {
                    label_short: 'Grondwatermonster',
                    label_long: 'Grondwatermonster',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/bodem.map&service=wms',
                    layers: ['grondwatermonsters'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/bodem.map&version=1.3.0&service=WMS&request=GetLegen' +
                        'dGraphic&sld_version=1.1.0&layer=grondwatermonsters&format=image/png&STYLE=default'
                },
                milieu_bodem_asbest_in_grond: {
                    label_short: 'Asbest in grond',
                    label_long: 'Asbest in grond',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/bodem.map&service=wms',
                    layers: ['asbest'],
                    minZoom: 10,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/bodem.map&version=1.3.0&service=WMS&request=GetLegen' +
                        'dGraphic&sld_version=1.1.0&layer=asbest&format=image/png&STYLE=default'
                },
                milieu_veiligheid_lpg_vulpunt: {
                    label_short: 'LPG-vulpunt - Risicozones',
                    label_long: 'LPG-vulpunt - Risicozones',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&service=wms',
                    layers: [
                        'lpgvulpuntinvloedsgebied',
                        'lpgvulpuntplaatsgebondenrisico106',
                        'lpgvulpuntplaatsgebondenrisico105',
                        'lpgvulpuntlocaties'
                    ],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_lpg_vulpunt&format=image/png&' +
                        'STYLE=default'
                },
                milieu_veiligheid_lpg_afleverzuil: {
                    label_short: 'LPG-afleverzuil - Risicozones',
                    label_long: 'LPG-afleverzuil - Risicozones',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&service=wms',
                    layers: ['milieu_veiligheid_lpg_afleverzuil'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_lpg_afleverzuil&format=image/' +
                        'png&STYLE=default'
                },
                milieu_veiligheid_lpg_tank: {
                    label_short: 'LPG-tank - Risicozones',
                    label_long: 'LPG-tank - Risicozones',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&service=wms',
                    layers: ['lpgtankinvloedsgebied', 'lpgtankplaatsgebondenrisico', 'lpgtankligging'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_lpg_tank&format=image/png&STY' +
                        'LE=default'
                },
                milieu_veiligheid_lpg_station: {
                    label_short: 'LPG-station - Risicozones',
                    label_long: 'LPG-station - Risicozones',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&service=wms',
                    layers: ['lpgstationcontouren', 'lpgstationslocaties'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_lpg_station&format=image/png&' +
                        'STYLE=default'
                },
                milieu_veiligheid_bron: {
                    label_short: 'Bron - Risicozones',
                    label_long: 'Bron - Risicozones',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&service=wms',
                    layers: ['overigerisicobedrijven'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=overigerisicobedrijven&format=image/png&STYLE=d' +
                        'efault'
                },
                milieu_veiligheid_bedrijf: {
                    label_short: 'Bedrijf - Risicozones',
                    label_long: 'Bedrijf - Risicozones',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&service=wms',
                    layers: ['milieu_veiligheid_bedrijf'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_bedrijf&format=image/png&STYL' +
                        'E=default'
                },
                milieu_veiligheid_aardgasbuisleidingen: {
                    label_short: 'Aardgasbuisleid. - Risicozones',
                    label_long: 'Aardgasbuisleidingen - Risicozones',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&service=wms',
                    layers: ['milieu_veiligheid_aardgasbuisleidingen'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_aardgasbuisleidingen&format=i' +
                        'mage/png&STYLE=default'
                },
                milieu_veiligheid_spoorwegen: {
                    label_short: 'Spoorwegen - Risicozones',
                    label_long: 'Spoorwegen - Risicozones',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&service=wms',
                    layers: ['risicozonesspoorweg'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=risicozonesspoorweg&format=image/png&STYLE=defa' +
                        'ult'
                },
                milieu_veiligheid_vaarwegen: {
                    label_short: 'Vaarwegen - Risicozones',
                    label_long: 'Vaarwegen - Risicozones',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&service=wms',
                    layers: ['risicozonesvaarweg'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=risicozonesvaarweg&format=image/png&STYLE=default'
                },
                milieu_veiligheid_wegen: {
                    label_short: 'Wegen - Risicozones',
                    label_long: 'Wegen - Risicozones',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&service=wms',
                    layers: ['risicozonesweg'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=risicozonesweg&format=image/png&STYLE=default'
                },
                milieu_veiligheid_vuurwerkopslag: {
                    label_short: 'Vuurwerkopslag - Veilig.afst.',
                    label_long: 'Vuurwerkopslag - Veiligheidsafstanden',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&service=wms',
                    layers: ['milieu_veiligheid_vuurwerk'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_vuurwerk&format=image/png&STY' +
                        'LE=default'
                },
                milieu_veiligheid_munitieopslag: {
                    label_short: 'Munitieopslag - Veilig.afst.',
                    label_long: 'Munitieopslag - Veiligheidsafstanden',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&service=wms',
                    layers: ['milieu_veiligheid_munitie'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_munitie&format=image/png&STYL' +
                        'E=default'
                },
                milieu_veiligheid_gasdrukregel_en_meetstations: {
                    label_short: 'Gasdruk...stations - Veilig.afst.',
                    label_long: 'Gasdrukregel- en meetstation - Veiligheidsafstanden',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&service=wms',
                    layers: ['milieu_veiligheid_gasdrukregel_meetstation'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_gasdrukregel_meetstation&form' +
                        'at=image/png&STYLE=default'
                },
                milieu_veiligheid_sluis: {
                    label_short: 'Sluis - Veilig.afst.',
                    label_long: 'Sluis - Veiligheidsafstanden',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&service=wms',
                    layers: ['milieu_veiligheid_sluis'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_sluis&format=image/png&STYLE=' +
                        'default'
                },
                milieu_veiligheid_wachtplaatsen: {
                    label_short: 'Wachtplaatsen - Veilig.afst.',
                    label_long: 'Wachtplaatsen - Veiligheidsafstanden',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&service=wms',
                    layers: ['milieu_veiligheid_wachtplaats'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_wachtplaats&format=image/png&' +
                        'STYLE=default'
                },
                milieu_veiligheid_bunkerschepen: {
                    label_short: 'Bunkerschepen - Veilig.afst.',
                    label_long: 'Bunkerschepen - Veiligheidsafstanden',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&service=wms',
                    layers: ['milieu_veiligheid_bunkerschepen'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/externeveiligheid.map&version=1.3.0&service=WMS&requ' +
                        'est=GetLegendGraphic&sld_version=1.1.0&layer=milieu_veiligheid_bunkerschepen&format=image/pn' +
                        'g&STYLE=default'
                },
                milieu_veiligheid_vogelvrijwaringsgebied_schiphol: {
                    label_short: 'Schiphol - Vogelvrijwaring',
                    label_long: 'Schiphol - Vogelvrijwaring',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/planologischezonesschiphol.map&service=wms',
                    layers: ['vogelvrijwaringsgebiedschiphol'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/planologischezonesschiphol.map&version=1.3.0&service' +
                        '=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=vogelvrijwaringsgebiedschiphol&format=' +
                        'image/png&STYLE=default'
                },
                milieu_geluid_planologisch_schiphol: {
                    label_short: 'Schiphol',
                    label_long: 'Schiphol',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/planologischezonesschiphol.map&service=wms',
                    layers: ['geluidszoneschiphol'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/planologischezonesschiphol.map&version=1.3.0&service' +
                        '=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=geluidszoneschiphol&format=image/png&S' +
                        'TYLE=default'
                },
                milieu_hoogtebeperkende_vlakken: {
                    label_short: 'Schiphol - Hoogtebeperking',
                    label_long: 'Schiphol - Hoogtebeperking',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/planologischezonesschiphol.map&service=wms',
                    layers: ['hoogtebeperkingschiphol'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/planologischezonesschiphol.map&version=1.3.0&service' +
                        '=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=hoogtebeperkingschiphol&format=image/p' +
                        'ng&STYLE=default'
                },
                milieu_geluid_planologisch_spoorwegen: {
                    label_short: 'Spoorwegen - Geluidszones',
                    label_long: 'Spoorwegen - Geluidszones',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/planologischegeluidszones.map&service=wms',
                    layers: ['spoorwegen'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/planologischegeluidszones.map&version=1.3.0&service=' +
                        'WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=spoorwegen&format=image/png&STYLE=default'
                },
                milieu_geluid_planologisch_metro: {
                    label_short: 'Metro - Geluidszones',
                    label_long: 'Metro - Geluidszones',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/planologischegeluidszones.map&service=wms',
                    layers: ['metro'],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/planologischegeluidszones.map&version=1.3.0&service=' +
                        'WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=metro&format=image/png&STYLE=default'
                },
                milieu_geluid_planologisch_industrie: {
                    label_short: 'Industrie - Geluidszones',
                    label_long: 'Industrie - Geluidszones',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/planologischegeluidszones.map&service=wms',
                    layers: [
                        'gezoneerdindustrieterrein',
                        'geluidzoneindustrieterrein',
                        'indicatievecontour55dbindustrieterrein'
                    ],
                    minZoom: 8,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/planologischegeluidszones.map&version=1.3.0&service=' +
                        'WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=milieu_geluid_planologisch_industrie&fo' +
                        'rmat=image/png&STYLE=default'
                },
                parkeervakken: {
                    label_short: 'Parkeervakken',
                    label_long: 'Parkeervakken',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/parkeervakken.map&service=wms',
                    layers: ['alle_parkeervakken', 'parkeervakken_label'],
                    minZoom: 10,
                    maxZoom: 16
                },
                parkeervakken_bord: {
                    label_short: 'Parkeervakken - Borden',
                    label_long: 'Parkeervakken - Borden',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/parkeervakken.map&service=wms',
                    layers: ['alle_parkeervakken', 'parkeervakken_bord'],
                    minZoom: 10,
                    maxZoom: 16
                },
                parkeervakken_reservering: {
                    label_short: 'Parkeervakken - Gereserveerd',
                    label_long: 'Parkeervakken - Gereserveerd',
                    url: 'cgi-bin/mapserv?map=/srv/mapserver/parkeervakken.map&service=wms',
                    layers: ['parkeervakken_reservering', 'parkeervakken_reservering_label'],
                    minZoom: 11,
                    maxZoom: 16,
                    legend: '/cgi-bin/mapserv?map=/srv/mapserver/parkeervakken.map&version=1.3.0&service=WMS&request=' +
                        'GetLegendGraphic&sld_version=1.1.0&layer=parkeervakken_reservering&format=image/png&STYLE=de' +
                        'fault'
                }
            },
            HIERARCHY: [
                {
                    heading: 'Geografie: gebieden',
                    overlays: [
                        'grootstedelijkgebied',
                        'unesco',
                        'stadsdeel',
                        'gebiedsgericht_werken',
                        'buurtcombinatie',
                        'buurt',
                        'bouwblokken'
                    ]
                }, {
                    heading: 'Geografie: hoogte',
                    overlays: [
                        'dsm',
                        'dtm',
                        'nap',
                        'meetbouten_status',
                        'meetbouten_zaksnelheid',
                        'meetbouten_referentiepunten'
                    ]
                }, {
                    heading: 'Onroerende zaken',
                    overlays: [
                        'kadaster',
                        'gemeentelijke_beperkingen'
                    ]
                }, {
                    heading: 'Milieu: bodem',
                    overlays: [
                        'milieu_bodem_grondmonsters',
                        'milieu_bodem_grondwatermonsters',
                        'milieu_bodem_asbest_in_grond'
                    ]
                }, {
                    heading: 'Milieu: veiligheid',
                    overlays: [
                        'milieu_veiligheid_lpg_vulpunt',
                        'milieu_veiligheid_lpg_afleverzuil',
                        'milieu_veiligheid_lpg_tank',
                        'milieu_veiligheid_lpg_station',
                        'milieu_veiligheid_bron',
                        'milieu_veiligheid_bedrijf',
                        'milieu_veiligheid_aardgasbuisleidingen',
                        'milieu_veiligheid_spoorwegen',
                        'milieu_veiligheid_vaarwegen',
                        'milieu_veiligheid_wegen',
                        'milieu_veiligheid_vuurwerkopslag',
                        'milieu_veiligheid_munitieopslag',
                        'milieu_veiligheid_gasdrukregel_en_meetstations',
                        'milieu_veiligheid_sluis',
                        'milieu_veiligheid_wachtplaatsen',
                        'milieu_veiligheid_bunkerschepen'
                    ]
                }, {
                    heading: 'Milieu: zones',
                    overlays: [
                        'milieu_geluid_planologisch_industrie',
                        'milieu_geluid_planologisch_spoorwegen',
                        'milieu_geluid_planologisch_metro',
                        'milieu_geluid_planologisch_schiphol',
                        'milieu_hoogtebeperkende_vlakken',
                        'milieu_veiligheid_vogelvrijwaringsgebied_schiphol'
                    ]
                }, {
                    heading: 'Verkeer',
                    overlays: [
                        'parkeervakken',
                        'parkeervakken_bord',
                        'parkeervakken_reservering'
                    ]
                }
            ]
        });
})();

