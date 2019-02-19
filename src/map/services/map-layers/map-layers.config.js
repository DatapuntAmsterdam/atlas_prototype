import mapLayerTypes from '../map-layer-types.config';

export default [
  {
    id: 'biz',
    url: 'maps/biz',
    layers: ['biz_polygons'],
    detailUrl: 'geosearch/biz/', // Geosearch URL
    detailItem: 'biz', // Not needed for this API endpoint, but needed to trigger nearest detail on click...
    detailIsShape: true
  },
  {
    id: 'hvo',
    authScope: 'HR/R',
    url: 'maps/handelsregister',
    layers: ['handel_vervoer_opslag', 'handel_vervoer_opslag_label'],
    detailUrl: 'handelsregister/geosearch/',
    detailItem: 'handel_vervoer_opslag'
  },
  {
    id: 'pir',
    authScope: 'HR/R',
    url: 'maps/handelsregister',
    layers: ['productie_installatie_reparatie', 'productie_installatie_reparatie_label'],
    detailUrl: 'handelsregister/geosearch/',
    detailItem: 'productie_installatie_reparatie'
  },
  {
    id: 'bouw',
    authScope: 'HR/R',
    url: 'maps/handelsregister',
    layers: ['bouw', 'bouw_label'],
    detailUrl: 'handelsregister/geosearch/',
    detailItem: 'bouw'
  },
  {
    id: 'lb',
    authScope: 'HR/R',
    url: 'maps/handelsregister',
    layers: ['landbouw', 'landbouw_label'],
    detailUrl: 'handelsregister/geosearch/',
    detailItem: 'landbouw'
  },
  {
    id: 'hrc',
    authScope: 'HR/R',
    url: 'maps/handelsregister',
    layers: ['horeca', 'horeca_label'],
    detailUrl: 'handelsregister/geosearch/',
    detailItem: 'horeca'
  },
  {
    id: 'itc',
    authScope: 'HR/R',
    url: 'maps/handelsregister',
    layers: ['telecommunicatie', 'telecommunicatie_label'],
    detailUrl: 'handelsregister/geosearch/',
    detailItem: 'informatie_telecommunicatie'
  },
  {
    id: 'fdvrog',
    authScope: 'HR/R',
    url: 'maps/handelsregister',
    layers: ['financiele_dienstverlening_verhuur', 'financiele_dienstverlening_verhuur_label'],
    detailUrl: 'handelsregister/geosearch/',
    detailItem: 'financiele_dienstverlening_verhuur'
  },
  {
    id: 'zd',
    authScope: 'HR/R',
    url: 'maps/handelsregister',
    layers: ['zakelijke_dienstverlening', 'zakelijke_dienstverlening_label'],
    detailUrl: 'handelsregister/geosearch/',
    detailItem: 'zakelijke_dienstverlening'
  },
  {
    id: 'ooz',
    authScope: 'HR/R',
    url: 'maps/handelsregister',
    layers: ['overheid_onderwijs_zorg', 'overheid_onderwijs_zorg_label'],
    detailUrl: 'handelsregister/geosearch/',
    detailItem: 'overheid_onderwijs_zorg'
  },
  {
    id: 'csr',
    authScope: 'HR/R',
    url: 'maps/handelsregister',
    layers: ['cultuur_sport_recreatie', 'cultuur_sport_recreatie_label'],
    detailUrl: 'handelsregister/geosearch/',
    detailItem: 'cultuur_sport_recreatie'
  },
  {
    id: 'csr',
    authScope: 'HR/R',
    url: 'maps/handelsregister',
    layers: ['cultuur_sport_recreatie', 'cultuur_sport_recreatie_label'],
    detailUrl: 'handelsregister/geosearch/',
    detailItem: 'cultuur_sport_recreatie'
  },
  {
    id: 'pd',
    authScope: 'HR/R',
    url: 'maps/handelsregister',
    layers: ['persoonlijke_dienstverlening', 'persoonlijke_dienstverlening_label'],
    detailUrl: 'handelsregister/geosearch/',
    detailItem: 'persoonlijke_dienstverlening'
  },
  {
    id: 'ovrg',
    authScope: 'HR/R',
    url: 'maps/handelsregister',
    layers: ['overige', 'overige_label'],
    detailUrl: 'handelsregister/geosearch/',
    detailItem: 'overige'
  },
  {
    id: 'kadaster',
    url: 'maps/brk?service=wms',
    layers: ['kadaster']
  },
  {
    id: 'bgem',
    url: 'maps/brk?service=wms',
    layers: ['burgerlijke_gemeente', 'burgerlijke_gemeente_label'],
    noDetail: true
  },
  {
    id: 'kgem',
    url: 'maps/brk?service=wms',
    layers: ['kadastrale_gemeente', 'kadastrale_gemeente_label'],
    noDetail: true
  },
  {
    id: 'ksec',
    url: 'maps/brk?service=wms',
    layers: ['kadastrale_sectie', 'kadastrale_sectie_label'],
    noDetail: true
  },
  {
    id: 'kot',
    url: 'maps/brk?service=wms',
    layers: ['kadastraal_object', 'kadastraal_object_label'],
    detailUrl: 'geosearch/search/',
    detailItem: 'kadastraal_object',
    detailIsShape: true
  },
  {
    id: 'gbgs',
    url: 'maps/wkpb',
    layers: ['beperking-GS']
  },
  {
    id: 'gbep',
    url: 'maps/wkpb',
    layers: ['beperking-EP']
  },
  {
    id: 'gbwu',
    url: 'maps/wkpb',
    layers: ['beperking-WU']
  },
  {
    id: 'gbkw',
    url: 'maps/wkpb',
    layers: ['beperking-KW']
  },
  {
    id: 'gboh',
    url: 'maps/wkpb',
    layers: ['beperking-OH']
  },
  {
    id: 'gbhv',
    url: 'maps/wkpb',
    layers: ['beperking-HV']
  },
  {
    id: 'gbgg',
    url: 'maps/wkpb',
    layers: ['beperking-GG']
  },
  {
    id: 'gbos',
    url: 'maps/wkpb',
    layers: ['beperking-OS']
  },
  {
    id: 'gbvv',
    url: 'maps/wkpb',
    layers: ['beperking-VV']
  },
  // geografie: gebieden
  {
    id: 'gsg',
    url: 'maps/gebieden?service=wms',
    layers: ['grootstedelijkgebied', 'grootstedelijkgebied_label']
  },
  {
    id: 'ggwpg',
    url: 'maps/gebieden?service=wms',
    layers: ['gebiedsgerichtwerkenpraktijkgebieden', 'gebiedsgerichtwerkenpraktijkgebieden_label']
  },
  {
    id: 'ggwg',
    url: 'maps/gebieden?service=wms',
    layers: ['gebiedsgerichtwerken', 'gebiedsgerichtwerken_label']
  },
  {
    id: 'unesco',
    url: 'maps/gebieden?service=wms',
    layers: ['unesco', 'unesco_label']
  },
  {
    id: 'sd',
    url: 'maps/gebieden?service=wms',
    layers: ['stadsdeel', 'stadsdeel_label']
  },
  {
    id: 'bc',
    url: 'maps/gebieden?service=wms',
    layers: ['buurtcombinatie', 'buurtcombinatie_label']
  },
  {
    id: 'buurt',
    url: 'maps/gebieden?service=wms',
    layers: ['buurt', 'buurt_label']
  },
  {
    id: 'bbn',
    url: 'maps/gebieden?service=wms',
    layers: ['bouwblok', 'bouwblok_label'],
    detailUrl: 'geosearch/search/',
    detailItem: 'bouwblok',
    detailIsShape: true
  },
  // geografie: hoogte
  {
    id: 'dsm',
    url: 'https://geodata.nationaalgeoregister.nl/ahn3/wms?',
    layers: ['ahn3_05m_dsm'],
    external: true,
    noDetail: true
  },
  {
    id: 'dtm',
    url: 'https://geodata.nationaalgeoregister.nl/ahn3/wms?',
    layers: ['ahn3_05m_dtm'],
    external: true,
    noDetail: true
  },
  {
    id: 'nap',
    url: 'maps/nap',
    layers: ['peilmerk_hoogte', 'peilmerk_label'],
    detailUrl: 'geosearch/search/',
    detailItem: 'peilmerk'
  },
  {
    id: 'mbs',
    url: 'maps/meetbouten?service=wms',
    layers: ['meetbouten_status', 'meetbouten_labels'],
    detailUrl: 'geosearch/search/',
    detailItem: 'meetbout'
  },
  {
    id: 'mbz',
    url: 'maps/meetbouten?service=wms',
    layers: ['meetbouten_zaksnelheid', 'meetbouten_labels'],
    detailUrl: 'geosearch/search/',
    detailItem: 'meetbout'
  },
  {
    id: 'mbr',
    url: 'maps/meetbouten',
    layers: ['referentiepunten'],
    noDetail: true
  },
  // historisch
  {
    id: 'pw1909',
    type: mapLayerTypes.TMS,
    layers: ['publieke-werken'],
    url: 'https://{s}.data.amsterdam.nl/publieke-werken-1909-rd/{z}/{x}/{y}.png',
    noDetail: true,
    external: true,
    bounds: [[52.3361, 4.84049], [52.4185, 4.96617]]
  },
  {
    id: 'pw1943',
    type: mapLayerTypes.TMS,
    layers: ['publieke-werken'],
    url: 'https://{s}.data.amsterdam.nl/publieke-werken-1943-rd/{z}/{x}/{y}.png',
    noDetail: true,
    external: true,
    bounds: [[52.3292, 4.8382], [52.4173, 4.9646]]
  },
  {
    id: 'pw1985',
    type: mapLayerTypes.TMS,
    layers: ['publieke-werken'],
    url: 'https://{s}.data.amsterdam.nl/publieke-werken-1985-rd/{z}/{x}/{y}.png',
    noDetail: true,
    external: true,
    bounds: [[52.2756, 4.74026], [52.4374, 5.04781]]
  },
  // milieu bodem
  {
    id: 'mbgm',
    url: 'maps/bodem',
    layers: ['grondmonsters'],
    noDetail: true
  },
  {
    id: 'mbgwm',
    url: 'maps/bodem',
    layers: ['grondwatermonsters'],
    noDetail: true
  },
  {
    id: 'mbaig',
    url: 'maps/bodem',
    layers: ['asbest'],
    noDetail: true
  },
  {
    id: 'exin',
    url: 'maps/bommenkaart',
    layers: ['inslagen'],
    detailUrl: 'geosearch/search/',
    detailItem: 'bominslag'
  },
  {
    id: 'exvg',
    url: 'maps/bommenkaart',
    layers: ['verdachte_gebieden']
  },
  {
    id: 'exgg',
    url: 'maps/bommenkaart',
    layers: ['gevrijwaarde_gebieden']
  },
  {
    id: 'exuo',
    url: 'maps/bommenkaart',
    layers: ['uitgevoerde_CE_onderzoeken']
  },
  {
    id: 'bros',
    url: 'https://geodata.nationaalgeoregister.nl/brocpt/wms?',
    layers: ['cpt'],
    external: true,
    noDetail: true
  },
  // milieu: veiligheid
  {
    id: 'mvlpgv',
    url: 'maps/externeveiligheid',
    layers: [
      'lpgvulpuntinvloedsgebied',
      'lpgvulpuntplaatsgebondenrisico106',
      'lpgvulpuntplaatsgebondenrisico105',
      'lpgvulpuntlocaties'
    ],
    noDetail: true
  },
  {
    id: 'mvlpga',
    url: 'maps/externeveiligheid',
    layers: ['milieu_veiligheid_lpg_afleverzuil'],
    noDetail: true
  },
  {
    id: 'mvlpgt',
    url: 'maps/externeveiligheid',
    layers: ['lpgtankinvloedsgebied', 'lpgtankplaatsgebondenrisico', 'lpgtankligging'],
    noDetail: true
  },
  {
    id: 'mvlpgs',
    url: 'maps/externeveiligheid',
    layers: ['lpgstationcontouren', 'lpgstationslocaties'],
    noDetail: true
  },
  {
    id: 'mvbr',
    url: 'maps/externeveiligheid',
    layers: ['overigerisicobedrijfsbronnen', 'overigerisicobedrijfplaatsgebondenrisico106'],
    noDetail: true
  },
  {
    id: 'mvi',
    authScope: 'HR/R',
    url: 'maps/externeveiligheid',
    layers: ['overigerisicobedrijfinvloedsgebied'],
    noDetail: true
  },
  {
    id: 'mvbd',
    url: 'maps/externeveiligheid',
    layers: ['milieu_veiligheid_bedrijf'],
    noDetail: true
  },
  {
    id: 'mvabl',
    url: 'maps/externeveiligheid',
    layers: ['milieu_veiligheid_aardgasbuisleidingen'],
    noDetail: true
  },
  {
    id: 'mvsw',
    url: 'maps/externeveiligheid',
    layers: ['risicozonesspoorweg'],
    noDetail: true
  },
  {
    id: 'mvvw',
    url: 'maps/externeveiligheid',
    layers: ['risicozonesvaarweg'],
    noDetail: true
  },
  {
    id: 'mvw',
    url: 'maps/externeveiligheid',
    layers: ['risicozonesweg'],
    noDetail: true
  },
  {
    id: 'mvvo',
    url: 'maps/externeveiligheid',
    layers: ['milieu_veiligheid_vuurwerk'],
    noDetail: true
  },
  {
    id: 'mvmo',
    url: 'maps/externeveiligheid',
    layers: ['milieu_veiligheid_munitie'],
    noDetail: true
  },
  {
    id: 'mvgms',
    url: 'maps/externeveiligheid',
    layers: ['milieu_veiligheid_gasdrukregel_meetstation'],
    noDetail: true
  },
  {
    id: 'mvsls',
    url: 'maps/externeveiligheid',
    layers: ['milieu_veiligheid_sluis'],
    noDetail: true
  },
  {
    id: 'mvwp',
    url: 'maps/externeveiligheid',
    layers: ['milieu_veiligheid_wachtplaats'],
    noDetail: true
  },
  {
    id: 'mvbs',
    url: 'maps/externeveiligheid',
    layers: ['milieu_veiligheid_bunkerschepen'],
    noDetail: true
  },
  // milieu zones
  {
    id: 'mgpind',
    url: 'maps/planologischegeluidszones',
    layers: [
      'geluidzoneindustrieterrein',
      'gezoneerdindustrieterrein'
    ],
    noDetail: true
  },
  {
    id: 'mgsw',
    url: 'maps/planologischegeluidszones',
    layers: ['spoorwegen'],
    noDetail: true
  },
  {
    id: 'mgpm',
    url: 'maps/planologischegeluidszones',
    layers: ['metro'],
    noDetail: true
  },
  {
    id: 'mgpsh',
    url: 'maps/planologischezonesschiphol',
    layers: ['geluidszoneschiphol'],
    noDetail: true
  },
  {
    id: 'mgth',
    url: 'maps/planologischezonesschiphol',
    layers: ['maatgevendetoetshoogteschiphol'],
    noDetail: true
  },
  {
    id: 'mthr',
    url: 'maps/planologischezonesschiphol',
    layers: ['toetshoogteradarschiphol'],
    noDetail: true
  },
  {
    id: 'mgvvgsh',
    url: 'maps/planologischezonesschiphol',
    layers: ['vogelvrijwaringsgebiedschiphol'],
    noDetail: true
  },
  // Openbare orde en veiligheid
  {
    id: 'oovoalg',
    url: 'maps/overlastgebieden',
    layers: ['algemeen_overlastgebied', 'algemeen_overlastgebied_label']
  },
  {
    id: 'oovoalco',
    url: 'maps/overlastgebieden',
    layers: ['alcoholverbodsgebied', 'alcoholverbodsgebied_label']
  },
  {
    id: 'oovodlrs',
    url: 'maps/overlastgebieden',
    layers: ['dealeroverlastgebied', 'dealeroverlastgebied_label']
  },
  {
    id: 'oovouitg',
    url: 'maps/overlastgebieden',
    layers: ['uitgaansoverlastgebied', 'uitgaansoverlastgebied_label']
  },
  {
    id: 'oovctg',
    url: 'maps/overlastgebieden',
    layers: ['cameratoezichtgebied', 'cameratoezichtgebied_label']
  },
  {
    id: 'oovtig',
    url: 'maps/overlastgebieden',
    layers: ['taxi-standplaatsgebied', 'taxi-standplaatsgebied_label']
  },
  // to revive end of 2019
  // {
  //   id: 'oovvz',
  //   url: 'maps/overlastgebieden',
  //   layers: ['vuurwerkvrijezone', 'vuurwerkvrijezone_label']
  // },
  // Toerisme en cultuur
  {
    id: 'tcmnmt',
    url: 'maps/monumenten',
    layers: ['monumenten'],
    detailUrl: 'geosearch/search/',
    detailItem: 'monument'
  },
  // Verkeer
  {
    id: 'trm',
    url: 'maps/trm',
    layers: ['tramlijnen'],
    noDetail: true
  },
  {
    id: 'mtr',
    url: 'maps/trm',
    layers: ['metrolijnen'],
    noDetail: true
  },
  {
    id: 'mzb',
    url: 'maps/milieuzones?id=63363',
    layers: ['milieuzones'],
    noDetail: true
  },
  {
    id: 'mzbs',
    url: 'maps/milieuzones?id=63324',
    layers: ['milieuzones'],
    noDetail: true
  },
  {
    id: 'mzt',
    url: 'maps/milieuzones?id=63360',
    layers: ['milieuzones'],
    noDetail: true
  },
  {
    id: 'mztc',
    url: 'maps/milieuzones?id=63361',
    layers: ['milieuzones'],
    noDetail: true
  },
  {
    id: 'mztc2020',
    url: 'maps/milieuzones?id=63316',
    layers: ['milieuzones'],
    noDetail: true
  },
  {
    id: 'mzva',
    url: 'maps/milieuzones?id=63362',
    layers: ['milieuzones'],
    noDetail: true
  },
  {
    id: 'pv',
    url: 'maps/parkeervakken',
    layers: ['alle_parkeervakken', 'parkeervakken_label'],
    detailUrl: 'parkeervakken/geosearch/',
    detailItem: 'parkeervak',
    detailIsShape: true
  },
  {
    id: 'pvb',
    url: 'maps/parkeervakken',
    layers: ['parkeervakken_bord'],
    detailUrl: 'parkeervakken/geosearch/',
    detailItem: 'parkeervak',
    detailIsShape: true
  },
  // Parkeervakken
  {
    id: 'pvrf',
    url: 'maps/parkeervakken?categorie=fiscaal',
    layers: ['parkeervakken_reservering'],
    detailUrl: 'parkeervakken/geosearch/',
    detailItem: 'parkeervak',
    detailIsShape: true
  },
  {
    id: 'pvrpv',
    url: 'maps/parkeervakken?categorie=parkeerverbod',
    layers: ['parkeervakken_reservering'],
    detailUrl: 'parkeervakken/geosearch/',
    detailItem: 'parkeervak',
    detailIsShape: true
  },
  {
    id: 'pvrts',
    url: 'maps/parkeervakken?categorie=taxistandplaats',
    layers: ['parkeervakken_reservering'],
    detailUrl: 'parkeervakken/geosearch/',
    detailItem: 'parkeervak',
    detailIsShape: true
  },
  {
    id: 'pvrgs',
    url: 'maps/parkeervakken?categorie=gehandicapten_plaats',
    layers: ['parkeervakken_reservering'],
    detailUrl: 'parkeervakken/geosearch/',
    detailItem: 'parkeervak',
    detailIsShape: true
  },
  {
    id: 'pvrga',
    url: 'maps/parkeervakken?categorie=gehandicapten_algemeen',
    layers: ['parkeervakken_reservering'],
    detailUrl: 'parkeervakken/geosearch/',
    detailItem: 'parkeervak',
    detailIsShape: true
  },
  {
    id: 'pvrgk',
    url: 'maps/parkeervakken?categorie=gehandicapten_kenteken',
    layers: ['parkeervakken_reservering'],
    detailUrl: 'parkeervakken/geosearch/',
    detailItem: 'parkeervak',
    detailIsShape: true
  },
  {
    id: 'pvrll',
    url: 'maps/parkeervakken?categorie=laden_lossen',
    layers: ['parkeervakken_reservering'],
    detailUrl: 'parkeervakken/geosearch/',
    detailItem: 'parkeervak',
    detailIsShape: true
  },
  {
    id: 'pvrsv',
    url: 'maps/parkeervakken?categorie=specifiek_voertuig',
    layers: ['parkeervakken_reservering'],
    detailUrl: 'parkeervakken/geosearch/',
    detailItem: 'parkeervak',
    detailIsShape: true
  },
  {
    id: 'pvrvh',
    url: 'maps/parkeervakken?categorie=vergunning_houders',
    layers: ['parkeervakken_reservering'],
    detailUrl: 'parkeervakken/geosearch/',
    detailItem: 'parkeervak',
    detailIsShape: true
  },
  {
    id: 'pvrbz',
    url: 'maps/parkeervakken?categorie=blauwe_zone',
    layers: ['parkeervakken_reservering'],
    detailUrl: 'parkeervakken/geosearch/',
    detailItem: 'parkeervak',
    detailIsShape: true
  },
  {
    id: 'pvrpr',
    url: 'maps/parkeervakken?categorie=park_ride',
    layers: ['parkeervakken_reservering'],
    detailUrl: 'parkeervakken/geosearch/',
    detailItem: 'parkeervak',
    detailIsShape: true
  },
  {
    id: 'pr',
    url: 'maps/reistijdenauto',
    layers: ['reistijdenauto'],
    noDetail: true
  },
  // Oplaadpunten
  {
    id: 'nlpb',
    url: 'maps/oplaadpunten',
    layers: ['normaal_beschikbaar'],
    detailUrl: 'geosearch/search/',
    detailItem: 'oplaadpunten'
  },
  {
    id: 'nlpnb',
    url: 'maps/oplaadpunten',
    layers: ['normaal_niet_beschikbaar'],
    detailUrl: 'geosearch/search/',
    detailItem: 'oplaadpunten'
  },
  {
    id: 'slpb',
    url: 'maps/oplaadpunten',
    layers: ['snel_beschikbaar'],
    detailUrl: 'geosearch/search/',
    detailItem: 'oplaadpunten'
  },
  {
    id: 'slpnb',
    url: 'maps/oplaadpunten',
    layers: ['snel_niet_beschikbaar'],
    detailUrl: 'geosearch/search/',
    detailItem: 'oplaadpunten'
  },
  // Hoofdroutes
  {
    id: 'bgt',
    url: 'maps/hoofdroutes?service=wms',
    layers: ['busbaan_geen_taxi'],
    noDetail: true
  },
  {
    id: 'tar',
    url: 'maps/hoofdroutes?service=wms',
    layers: ['taxiroutes'],
    noDetail: true
  },
  {
    id: 'vrr',
    url: 'maps/hoofdroutes?service=wms',
    layers: ['vrachtroutes'],
    noDetail: true
  },
  // Panoramabeelden
  {
    id: 'pano',
    url: 'maps/panorama',
    layers: ['panorama_new'],
    params: {
      mission_type: 'bi'
    }
  },
  {
    id: 'pano2016bi',
    url: 'maps/panorama',
    layers: ['panorama_new'],
    params: {
      mission_year: 2016,
      mission_type: 'bi'
    }
  },
  {
    id: 'pano2017bi',
    url: 'maps/panorama',
    layers: ['panorama_new'],
    params: {
      mission_year: 2017,
      mission_type: 'bi'
    }
  },
  {
    id: 'pano2017woz',
    url: 'maps/panorama',
    layers: ['panorama_new'],
    params: {
      mission_year: 2017,
      mission_type: 'woz'
    }
  },
  {
    id: 'pano2018bi',
    url: 'maps/panorama',
    layers: ['panorama_new'],
    params: {
      mission_year: 2018,
      mission_type: 'bi'
    }
  },
  {
    id: 'pano2018woz',
    url: 'maps/panorama',
    layers: ['panorama_new'],
    params: {
      mission_year: 2018,
      mission_type: 'woz'
    }
  },
  {
    id: 'pano2019bi',
    url: 'maps/panorama',
    layers: ['panorama_new'],
    params: {
      mission_year: 2019,
      mission_type: 'bi'
    }
  },
  {
    id: 'pano2019woz',
    url: 'maps/panorama',
    layers: ['panorama_new'],
    params: {
      mission_year: 2019,
      mission_type: 'woz'
    }
  },
  // Eigenaren
  {
    id: 'egga',
    url: 'maps/eigendommen?categorie=1',
    layers: ['eigendommen'],
    detailUrl: 'geosearch/search/',
    detailItem: 'kadastraal_object',
    detailIsShape: true
  },
  {
    id: 'egog',
    url: 'maps/eigendommen?categorie=2',
    layers: ['eigendommen'],
    detailUrl: 'geosearch/search/',
    detailItem: 'kadastraal_object',
    detailIsShape: true
  },
  {
    id: 'egst',
    url: 'maps/eigendommen?categorie=3',
    layers: ['eigendommen'],
    detailUrl: 'geosearch/search/',
    detailItem: 'kadastraal_object',
    detailIsShape: true
  },
  {
    id: 'egpr',
    url: 'maps/eigendommen?categorie=4',
    layers: ['eigendommen'],
    detailUrl: 'geosearch/search/',
    detailItem: 'kadastraal_object',
    detailIsShape: true
  },
  {
    id: 'egwa',
    url: 'maps/eigendommen?categorie=5',
    layers: ['eigendommen'],
    detailUrl: 'geosearch/search/',
    detailItem: 'kadastraal_object',
    detailIsShape: true
  },
  {
    id: 'egwo',
    url: 'maps/eigendommen?categorie=6',
    layers: ['eigendommen'],
    detailUrl: 'geosearch/search/',
    detailItem: 'kadastraal_object',
    detailIsShape: true
  },
  {
    id: 'egve',
    url: 'maps/eigendommen?categorie=7',
    layers: ['eigendommen'],
    detailUrl: 'geosearch/search/',
    detailItem: 'kadastraal_object',
    detailIsShape: true
  },
  {
    id: 'egsp',
    url: 'maps/eigendommen?categorie=8',
    layers: ['eigendommen'],
    detailUrl: 'geosearch/search/',
    detailItem: 'kadastraal_object',
    detailIsShape: true
  },
  {
    id: 'egnnp',
    url: 'maps/eigendommen?categorie=9',
    layers: ['eigendommen'],
    detailUrl: 'geosearch/search/',
    detailItem: 'kadastraal_object',
    detailIsShape: true
  },
  {
    id: 'egnp',
    url: 'maps/eigendommen?categorie=10',
    layers: ['eigendommen'],
    detailUrl: 'geosearch/search/',
    detailItem: 'kadastraal_object',
    detailIsShape: true
  },
  // Erfpachtuitgevers
  {
    id: 'efga',
    url: 'maps/erfpacht?categorie=1',
    layers: ['erfpacht'],
    detailUrl: 'geosearch/search/',
    detailItem: 'kadastraal_object',
    detailIsShape: true
  },
  {
    id: 'efov',
    url: 'maps/erfpacht?categorie=2',
    layers: ['erfpacht'],
    detailUrl: 'geosearch/search/',
    detailItem: 'kadastraal_object',
    detailIsShape: true
  },
  // Stedelijke ontwikkeling
  {
    id: 'grexProjecten',
    authScope: 'GREX/R',
    url: 'maps/grondexploitatie?service=wms',
    layers: ['grondexploitatie_polygons'],
    detailUrl: 'geosearch/search/', // Geosearch URL
    detailItem: 'grondexploitatie', // Geosearch name
    detailIsShape: true
  },
  {
    id: 'grexStadsdelen',
    authScope: 'GREX/R',
    url: 'maps/grondexploitatie?service=wms',
    layers: ['stadsdeel_polygons'],
    detailUrl: 'geosearch/search/', // Geosearch URL
    detailItem: 'stadsdeel', // Geosearch name
    detailIsShape: true
  }
];
