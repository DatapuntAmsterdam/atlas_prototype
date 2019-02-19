export default [
  {
    id: 'pano',
    layers: ['panorama_new'],
    legendItems: [
      {
        selectable: false,
        title: '2018'
      },
      {
        selectable: false,
        title: '2017'
      },
      {
        selectable: false,
        title: '2016'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    notClosable: true,
    title: 'Panoramabeelden',
    url: '/maps/panorama?version=1.3.0&service=WMS'
  },
  {
    id: 'pano2018bi',
    layers: ['panorama_new'],
    legendItems: [
      {
        selectable: false,
        title: '2018'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Panoramabeelden',
    notClosable: true,
    url: '/maps/panorama?version=1.3.0&service=WMS'
  },
  {
    id: 'pano2018woz',
    layers: ['panorama_new'],
    legendItems: [
      {
        imageRule: '2018',
        selectable: false,
        title: '2018 WOZ'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    notClosable: true,
    title: 'Panoramabeelden',
    url: '/maps/panorama?version=1.3.0&service=WMS'
  },
  {
    id: 'pano2017bi',
    layers: ['panorama_new'],
    legendItems: [
      {
        selectable: false,
        title: '2017'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    notClosable: true,
    title: 'Panoramabeelden',
    url: '/maps/panorama?version=1.3.0&service=WMS'
  },
  {
    id: 'pano2017woz',
    layers: ['panorama_new'],
    legendItems: [
      {
        imageRule: '2017',
        selectable: false,
        title: '2017 WOZ'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Panoramabeelden',
    notClosable: true,
    url: '/maps/panorama?version=1.3.0&service=WMS'
  },
  {
    id: 'pano2016bi',
    layers: ['panorama_new'],
    legendItems: [
      {
        selectable: false,
        title: '2016'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    notClosable: true,
    title: 'Panoramabeelden',
    url: '/maps/panorama?version=1.3.0&service=WMS'
  },
  {
    category: 'Geografie: onroerende zaken',
    legendItems: [
      {
        id: 'bgem',
        notClickable: true,
        layer: 'burgerlijke_gemeente',
        selectable: true,
        title: 'Burgerlijke gemeente'
      },
      {
        id: 'kgem',
        notClickable: true,
        layer: 'kadastrale_gemeente',
        selectable: true,
        title: 'Kadastrale gemeente'
      },
      {
        id: 'ksec',
        notClickable: true,
        layer: 'kadastrale_sectie',
        selectable: true,
        title: 'Kadastrale sectie'
      },
      {
        id: 'kot',
        layer: 'kadastraal_object',
        selectable: true,
        title: 'Kadastraal object'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Kadastrale perceelsgrenzen',
    url: '/maps/brk?version=1.3.0&service=WMS'
  },
  {
    category: 'Geografie: onroerende zaken',
    legendItems: [
      {
        id: 'egga',
        layer: 'eigendommen',
        selectable: true,
        title: 'Gemeente Amsterdam',
        iconUrl: '/assets/images/map-legend/icon-egdm-cat-1.svg'
      },
      {
        id: 'egog',
        layer: 'eigendommen',
        selectable: true,
        title: 'Overige gemeenten',
        iconUrl: '/assets/images/map-legend/icon-egdm-cat-2.svg'
      },
      {
        id: 'egst',
        layer: 'eigendommen',
        selectable: true,
        title: 'Staat',
        iconUrl: '/assets/images/map-legend/icon-egdm-cat-3.svg'
      },
      {
        id: 'egpr',
        layer: 'eigendommen',
        selectable: true,
        title: 'Provincies',
        iconUrl: '/assets/images/map-legend/icon-egdm-cat-4.svg'
      },
      {
        id: 'egwa',
        layer: 'eigendommen',
        selectable: true,
        title: 'Waterschappen',
        iconUrl: '/assets/images/map-legend/icon-egdm-cat-5.svg'
      },
      {
        id: 'egwo',
        layer: 'eigendommen',
        selectable: true,
        title: 'Woningbouwcorporaties',
        iconUrl: '/assets/images/map-legend/icon-egdm-cat-6.svg'
      },
      {
        id: 'egve',
        layer: 'eigendommen',
        selectable: true,
        title: 'Verenigingen van eigenaren',
        iconUrl: '/assets/images/map-legend/icon-egdm-cat-7.svg'
      },
      {
        id: 'egsp',
        layer: 'eigendommen',
        selectable: true,
        title: 'Spoorwegen/ProRail',
        iconUrl: '/assets/images/map-legend/icon-egdm-cat-8.svg'
      },
      {
        id: 'egnnp',
        layer: 'eigendommen',
        selectable: true,
        title: 'Overige niet-natuurlijke personen',
        iconUrl: '/assets/images/map-legend/icon-egdm-cat-9.svg'
      },
      {
        id: 'egnp',
        layer: 'eigendommen',
        selectable: true,
        title: 'Overige natuurlijke personen',
        iconUrl: '/assets/images/map-legend/icon-egdm-cat-10.svg'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Kadastrale eigenaren',
    url: '/maps/eigendommen?version=1.3.0&service=WMS'
  },
  {
    category: 'Geografie: onroerende zaken',
    legendItems: [
      {
        id: 'efga',
        layer: 'erfpacht',
        selectable: true,
        title: 'Gemeente Amsterdam',
        iconUrl: '/assets/images/map-legend/icon-erf-cat-1.svg'
      },
      {
        id: 'efov',
        layer: 'erfpacht',
        selectable: true,
        title: 'Overig',
        iconUrl: '/assets/images/map-legend/icon-erf-cat-2.svg'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Kadastrale erfpachtuitgevers',
    url: '/maps/erfpacht?version=1.3.0&service=WMS'
  },
  {
    category: 'Geografie: onroerende zaken',
    legendItems: [
      {
        id: 'gbvv',
        layer: 'beperking-VV',
        selectable: true,
        title: '(voorlopige) aanwijzing WVG'
      },
      {
        id: 'gbkw',
        layer: 'beperking-KW',
        selectable: true,
        title: 'Wet bodembescherming'
      },
      {
        id: 'gbwu',
        layer: 'beperking-WU',
        selectable: true,
        title: 'Woningwet'
      },
      {
        id: 'gboh',
        layer: 'beperking-OH',
        selectable: true,
        title: 'WABO bestuursdwang / dwangsom'
      },
      {
        id: 'gbos',
        layer: 'beperking-OS',
        selectable: true,
        title: 'Sluiting o.b.v. Opiumwet'
      },
      {
        id: 'gbgs',
        layer: 'beperking-GS',
        selectable: true,
        title: 'Sluiting v. woning/lokaal/erf'
      },
      {
        id: 'gbgg',
        layer: 'beperking-GG',
        selectable: true,
        title: 'Gemeentelijk monument'
      },
      {
        id: 'gbep',
        layer: 'beperking-EP',
        selectable: true,
        title: 'Exploitatieplan'
      },
      {
        id: 'gbhv',
        layer: 'beperking-HV',
        selectable: true,
        title: 'Vordering tot woonruimte'
      }
    ],
    maxZoom: 16,
    minZoom: 13,
    title: 'Gemeentelijke beperkingen (WKPB)',
    url: '/maps/wkpb?version=1.3.0&service=WMS'
  },
  {
    category: 'Geografie: gebieden',
    legendItems: [
      {
        id: 'sd',
        layer: 'stadsdeel',
        selectable: true,
        title: 'Stadsdeel'
      },
      {
        id: 'bc',
        layer: 'buurtcombinatie',
        selectable: true,
        title: 'Wijk'
      },
      {
        id: 'buurt',
        layer: 'buurt',
        selectable: true,
        title: 'Buurt'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Bestuurlijke gebieden',
    url: '/maps/gebieden?version=1.3.0&service=WMS'
  },
  {
    category: 'Geografie: gebieden',
    id: 'bbn',
    layers: ['bouwblok'],
    legendItems: [
      {
        selectable: false,
        title: 'Bouwblok'
      }
    ],
    maxZoom: 16,
    minZoom: 12,
    title: 'Bouwblokken',
    url: '/maps/gebieden?version=1.3.0&service=WMS'
  },
  {
    category: 'Geografie: gebieden',
    legendItems: [
      {
        id: 'ggwg',
        layer: 'gebiedsgerichtwerken',
        selectable: true,
        title: 'Gebiedsgerichtwerken-gebied'
      },
      {
        id: 'ggwpg',
        layer: 'gebiedsgerichtwerkenpraktijkgebieden',
        notClickable: true,
        selectable: true,
        title: 'Gebiedsgerichtwerken-praktijkgebied'
      }
    ],
    maxZoom: 16,
    minZoom: 6,
    title: 'Gebiedsgericht werken',
    url: '/maps/gebieden?version=1.3.0&service=WMS'
  },
  {
    category: 'Geografie: gebieden',
    id: 'gsg',
    layers: ['grootstedelijkgebied'],
    legendItems: [
      {
        selectable: false,
        title: 'Grootstedelijk gebied'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Grootstedelijke gebieden',
    url: '/maps/gebieden?version=1.3.0&service=WMS'
  },
  {
    category: 'Geografie: gebieden',
    id: 'unesco',
    layers: ['unesco'],
    legendItems: [
      {
        selectable: false,
        title: 'Kernzone'
      },
      {
        selectable: false,
        title: 'Bufferzone'
      }
    ],
    maxZoom: 16,
    minZoom: 10,
    title: 'Unesco werelderfgoedzones',
    url: '/maps/gebieden?version=1.3.0&service=WMS'
  },
  {
    category: 'Geografie: hoogte',
    id: 'dsm',
    notClickable: true,
    layers: ['ahn3_05m_dtm'],
    legendItems: [
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-minus-10.svg',
        selectable: false,
        title: '-10 m tot -5 m'
      },
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-minus-5.svg',
        selectable: false,
        title: '-5 m tot -2 m'
      },
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-minus-2.svg',
        selectable: false,
        title: '-2 m tot -1 m'
      },
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-minus-1.svg',
        selectable: false,
        title: '-1 m tot 0 m'
      },
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-plus-0.svg',
        selectable: false,
        title: '0 m tot 1 m'
      },
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-plus-1.svg',
        selectable: false,
        title: '1 m tot 2 m'
      },
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-plus-2.svg',
        selectable: false,
        title: '2 m tot 5 m'
      },
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-plus-5.svg',
        selectable: false,
        title: '5 m tot 10 m'
      },
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-plus-10.svg',
        selectable: false,
        title: '10 m tot 20 m'
      },
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-plus-20.svg',
        selectable: false,
        title: '20 m tot 30 m'
      },
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-plus-30.svg',
        selectable: false,
        title: 'hoger dan 30 m'
      }
    ],
    maxZoom: 16,
    minZoom: 10,
    title: 'Terreinmodel (DTM AHN)'
  },
  {
    category: 'Geografie: hoogte',
    id: 'dtm',
    notClickable: true,
    layers: ['ahn3_05m_dsm'],
    legendItems: [
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-minus-10.svg',
        selectable: false,
        title: '-10 m tot -5 m'
      },
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-minus-5.svg',
        selectable: false,
        title: '-5 m tot -2 m'
      },
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-minus-2.svg',
        selectable: false,
        title: '-2 m tot -1 m'
      },
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-minus-1.svg',
        selectable: false,
        title: '-1 m tot 0 m'
      },
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-plus-0.svg',
        selectable: false,
        title: '0 m tot 1 m'
      },
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-plus-1.svg',
        selectable: false,
        title: '1 m tot 2 m'
      },
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-plus-2.svg',
        selectable: false,
        title: '2 m tot 5 m'
      },
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-plus-5.svg',
        selectable: false,
        title: '5 m tot 10 m'
      },
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-plus-10.svg',
        selectable: false,
        title: '10 m tot 20 m'
      },
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-plus-20.svg',
        selectable: false,
        title: '20 m tot 30 m'
      },
      {
        iconUrl: '/assets/images/map-legend/icon-ahn-plus-30.svg',
        selectable: false,
        title: 'hoger dan 30 m'
      }
    ],
    maxZoom: 16,
    minZoom: 10,
    title: 'Oppervlaktemodel (DSM AHN)'
  },
  {
    category: 'Geografie: hoogte',
    id: 'nap',
    layers: ['peilmerk_hoogte'],
    legendItems: [
      {
        selectable: false,
        title: 'lager dan -1,5 m'
      },
      {
        selectable: false,
        title: '-1,5 m tot -0,5 m'
      },
      {
        selectable: false,
        title: '-0,5 m tot 0 m'
      },
      {
        selectable: false,
        title: '0 m tot 1 m'
      },
      {
        selectable: false,
        title: '1 m tot 1,5 m'
      },
      {
        selectable: false,
        title: '1,5 m tot 2 m'
      },
      {
        selectable: false,
        title: '2 m tot 3,5 m'
      },
      {
        selectable: false,
        title: 'hoger dan 3,5 m'
      }
    ],
    maxZoom: 16,
    minZoom: 10,
    title: 'Normaal Amsterdams Peil (NAP)',
    url: '/maps/nap?version=1.3.0&service=WMS'
  },
  {
    category: 'Geografie: hoogte',
    id: 'mbs',
    layers: ['meetbouten_status'],
    legendItems: [
      {
        selectable: false,
        title: 'Actueel'
      },
      {
        selectable: false,
        title: 'Vervallen'
      }
    ],
    maxZoom: 16,
    minZoom: 12,
    title: 'Meetbouten - Status',
    url: '/maps/meetbouten?version=1.3.0&service=WMS'
  },
  {
    category: 'Geografie: hoogte',
    id: 'mbz',
    layers: ['meetbouten_zaksnelheid'],
    legendItems: [
      {
        selectable: false,
        title: 'minder dan -1 mm/jaar'
      },
      {
        selectable: false,
        title: '-1 tot 0 mm/jaar'
      },
      {
        selectable: false,
        title: '0 tot 1 mm/jaar'
      },
      {
        selectable: false,
        title: '1 tot 1,5 mm/jaar'
      },
      {
        selectable: false,
        title: '1,5 tot 2 mm/jaar'
      },
      {
        selectable: false,
        title: '2 tot 2,5 mm/jaar'
      },
      {
        selectable: false,
        title: '2,5 tot 3 mm/jaar'
      },
      {
        selectable: false,
        title: '3 tot 4 mm/jaar'
      },
      {
        selectable: false,
        title: 'meer dan 4 mm/jaar'
      }
    ],
    maxZoom: 16,
    minZoom: 12,
    title: 'Meetbouten - Zaksnelheid',
    url: '/maps/meetbouten?version=1.3.0&service=WMS'
  },
  {
    category: 'Geografie: hoogte',
    id: 'mbr',
    notClickable: true,
    layers: ['referentiepunt'],
    legendItems: [
      {
        selectable: false,
        title: 'Referentiepunt'
      }
    ],
    maxZoom: 16,
    minZoom: 12,
    title: 'Meetbouten - Referentiepunten',
    url: '/maps/meetbouten?version=1.3.0&service=WMS'
  },
  {
    category: 'Topografie: historisch',
    disabled: true,
    legendItems: [
      {
        id: 'pw1909',
        notClickable: false,
        layer: 'burgerlijke_gemeente',
        selectable: false,
        title: '1909 (Dienst der Publieke Werken)'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: '1909 (Dienst der Publieke Werken)'
  },
  {
    category: 'Topografie: historisch',
    disabled: true,
    legendItems: [
      {
        id: 'pw1943',
        notClickable: false,
        layer: 'burgerlijke_gemeente',
        selectable: false,
        title: '1943 (Dienst der Publieke Werken)'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: '1943 (Dienst der Publieke Werken)'
  },
  {
    category: 'Topografie: historisch',
    disabled: true,
    legendItems: [
      {
        id: 'pw1985',
        notClickable: false,
        layer: 'burgerlijke_gemeente',
        selectable: false,
        title: '1985 (Dienst der Publieke Werken)'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: '1985 (Dienst der Publieke Werken)'
  },
  {
    category: 'Verkeer en infrastructuur',
    legendItems: [
      {
        id: 'mtr',
        notClickable: true,
        layer: 'metrolijnen',
        selectable: true,
        title: 'Metrolijn'
      },
      {
        id: 'trm',
        notClickable: true,
        layer: 'tramlijnen',
        selectable: true,
        title: 'Tramlijn'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Metro en tram - Spoorlijnen',
    url: '/maps/trm?version=1.3.0&service=WMS'
  },
  {
    category: 'Verkeer en infrastructuur',
    id: 'mzb',
    notClickable: true,
    layers: ['milieuzones'],
    legendItems: [
      {
        selectable: false,
        title: 'Milieuzone bestelauto'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Milieuzones - Bestelauto',
    url: '/maps/milieuzones?version=1.3.0&service=WMS'
  },
  {
    category: 'Verkeer en infrastructuur',
    id: 'mzbs',
    notClickable: true,
    layers: ['milieuzones'],
    legendItems: [
      {
        selectable: false,
        title: 'Milieuzone brom- en snorfiets'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Milieuzones - Brom- en snorfiets',
    url: '/maps/milieuzones?version=1.3.0&service=WMS'
  },
  {
    category: 'Verkeer en infrastructuur',
    id: 'mzt',
    notClickable: true,
    layers: ['milieuzones'],
    legendItems: [
      {
        imageRule: 'Taxi',
        selectable: false,
        title: 'Milieuzone taxi'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Milieuzones - Taxi',
    url: '/maps/milieuzones?version=1.3.0&service=WMS'
  },
  {
    category: 'Verkeer en infrastructuur',
    id: 'mztc',
    notClickable: true,
    layers: ['milieuzones'],
    legendItems: [
      {
        imageRule: 'Touringcar',
        selectable: false,
        title: 'Milieuzone touringcar'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Milieuzones - Touringcar',
    url: '/maps/milieuzones?version=1.3.0&service=WMS'
  },
  {
    category: 'Verkeer en infrastructuur',
    id: 'mztc2020',
    notClickable: true,
    layers: ['milieuzones'],
    legendItems: [
      {
        imageRule: 'Touringcar na 2020',
        selectable: false,
        title: 'Milieuzone touringcar (vanaf 1-1-2020)'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Milieuzones - Touringcar (vanaf 1-1-2020)',
    url: '/maps/milieuzones?version=1.3.0&service=WMS'
  },
  {
    category: 'Verkeer en infrastructuur',
    id: 'mzva',
    notClickable: true,
    layers: ['milieuzones'],
    legendItems: [
      {
        imageRule: 'Vrachtauto',
        selectable: false,
        title: 'Milieuzone vrachtauto'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Milieuzones - Vrachtauto',
    url: '/maps/milieuzones?version=1.3.0&service=WMS'
  },
  {
    category: 'Verkeer en infrastructuur',
    legendItems: [
      {
        id: 'nlpb',
        imageRule: 'Normaal beschikbaar',
        layer: 'normaal_beschikbaar',
        selectable: true,
        title: 'Gewoon laadpunt (beschikbaar)'
      },
      {
        id: 'nlpnb',
        imageRule: 'Normaal niet beschikbaar',
        layer: 'normaal_niet_beschikbaar',
        selectable: true,
        title: 'Gewoon laadpunt (niet beschikbaar)'
      },
      {
        id: 'slpb',
        imageRule: 'Snel beschikbaar',
        layer: 'snel_beschikbaar',
        selectable: true,
        title: 'Snellaadpunt (beschikbaar)'
      },
      {
        id: 'slpnb',
        imageRule: 'Snel niet beschikbaar',
        layer: 'snel_niet_beschikbaar',
        selectable: true,
        title: 'Snellaadpunt (niet beschikbaar)'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Oplaadpunten - Status (±15 min. geleden)',
    url: '/maps/oplaadpunten?version=1.3.0&service=WMS'
  },
  {
    category: 'Verkeer en infrastructuur',
    id: 'pv',
    notClickable: true,
    layers: ['alle_parkeervakken'],
    legendItems: [
      {
        selectable: false,
        title: 'FISCAAL'
      },
      {
        selectable: false,
        title: 'Niet FISCAAL'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Parkeervakken - Fiscale indeling',
    url: '/maps/parkeervakken?version=1.3.0&service=WMS'
  },
  {
    category: 'Verkeer en infrastructuur',
    id: 'pvb',
    layers: ['parkeervakken_bord'],
    legendItems: [
      {
        selectable: false,
        title: 'Bord'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Parkeervakken - Speciale bestemmingen',
    url: '/maps/parkeervakken?version=1.3.0&service=WMS'
  },
  {
    category: 'Verkeer en infrastructuur',
    legendItems: [
      {
        id: 'pvrf',
        layer: 'parkeervakken_reservering',
        selectable: true,
        title: 'FISCAAL'
      },
      {
        id: 'pvrpv',
        layer: 'parkeervakken_reservering',
        selectable: true,
        title: 'Parkeerverbod'
      },
      {
        id: 'pvrts',
        layer: 'parkeervakken_reservering',
        selectable: true,
        title: 'Taxistandplaats'
      },
      {
        id: 'pvrga',
        layer: 'parkeervakken_reservering',
        selectable: true,
        title: 'Gehandicaptenplaats algemeen'
      },
      {
        id: 'pvrgk',
        layer: 'parkeervakken_reservering',
        selectable: true,
        title: 'Gehandicaptenplaats kenteken'
      },
      {
        id: 'pvrll',
        layer: 'parkeervakken_reservering',
        selectable: true,
        title: 'Laden lossen'
      },
      {
        id: 'pvrsv',
        layer: 'parkeervakken_reservering',
        selectable: true,
        title: 'Specifieke voertuigcategorie'
      },
      {
        id: 'pvrvh',
        layer: 'parkeervakken_reservering',
        selectable: true,
        title: 'Vergunninghouders'
      },
      {
        id: 'pvrbz',
        layer: 'parkeervakken_reservering',
        selectable: true,
        title: 'Blauwe zone'
      },
      {
        id: 'pvrpr',
        layer: 'parkeervakken_reservering',
        selectable: true,
        title: 'Park & Ride'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Parkeervakken - Gereserveerd',
    url: '/maps/parkeervakken?version=1.3.0&service=WMS'
  },
  {
    category: 'Verkeer en infrastructuur',
    legendItems: [
      {
        id: 'bgt',
        imageRule: 'Busbaan geen taxi',
        notClickable: true,
        layer: 'busbaan_geen_taxi',
        selectable: true,
        title: 'Taxi busbaanontheffing'
      },
      {
        id: 'tar',
        imageRule: 'Taxiroutes',
        notClickable: true,
        layer: 'taxiroutes',
        selectable: true,
        title: 'Taxi hoofdroute'
      },
      {
        id: 'vrr',
        imageRule: 'Vrachtroutes',
        notClickable: true,
        layer: 'vrachtroutes',
        selectable: true,
        title: 'Vrachtauto 7,5t-route'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Routes - Taxi en vrachtauto',
    url: '/maps/hoofdroutes?version=1.3.0&service=WMS'
  },
  {
    category: 'Verkeer en infrastructuur',
    id: 'pr',
    notClickable: true,
    layers: ['reistijdenauto'],
    legendItems: [
      {
        selectable: false,
        title: '0 tot 20 km/h - snelweg'
      },
      {
        selectable: false,
        title: '20 tot 40 km/h - snelweg'
      },
      {
        selectable: false,
        title: '40 tot 60 km/h - snelweg'
      },
      {
        selectable: false,
        title: '60 tot 80 km/h - snelweg'
      },
      {
        selectable: false,
        title: '80 tot 100 km/h - snelweg'
      },
      {
        selectable: false,
        title: '100 tot 120 km/h - snelweg'
      },
      {
        selectable: false,
        title: '120 tot 140 km/h - snelweg'
      },
      {
        selectable: false,
        title: 'meer dan 140 km/h - snelweg'
      },
      {
        selectable: false,
        title: '0 tot 10 km/h - weg'
      },
      {
        selectable: false,
        title: '10 tot 20 km/h - weg'
      },
      {
        selectable: false,
        title: '20 tot 30 km/h - weg'
      },
      {
        selectable: false,
        title: '30 tot 40 km/h - weg'
      },
      {
        selectable: false,
        title: '40 tot 50 km/h - weg'
      },
      {
        selectable: false,
        title: '50 tot 60 km/h - weg'
      },
      {
        selectable: false,
        title: 'meer dan 60 km/h - weg'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Verkeersstromen - Snelheden (±5 min. geleden)',
    url: '/maps/reistijdenauto?version=1.3.0&service=WMS'
  },
  {
    category: 'Openbare orde en veiligheid',
    legendItems: [
      {
        id: 'oovoalg',
        layer: 'algemeen_overlastgebied',
        selectable: true,
        notClickable: true,
        title: 'Algemeen overlastgebied'
      },
      {
        id: 'oovodlrs',
        layer: 'dealeroverlastgebied',
        selectable: true,
        notClickable: true,
        title: 'Dealeroverlastgebied'
      },
      {
        id: 'oovouitg',
        layer: 'uitgaansoverlastgebied',
        selectable: true,
        notClickable: true,
        title: 'Uitgaansoverlastgebied'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Overlastgebieden',
    url: '/maps/overlastgebieden?version=1.3.0&service=WMS'
  },
  {
    category: 'Openbare orde en veiligheid',
    id: 'oovctg',
    layers: ['cameratoezichtgebied'],
    legendItems: [
      {
        selectable: false,
        title: 'Cameratoezichtgebied'
      }
    ],
    notClickable: true,
    maxZoom: 16,
    minZoom: 8,
    title: 'Cameratoezichtgebieden',
    url: '/maps/overlastgebieden?version=1.3.0&service=WMS'
  },
  {
    category: 'Openbare orde en veiligheid',
    id: 'oovoalco',
    layers: ['Alcoholverbodsgebied'],
    legendItems: [
      {
        layer: 'alcoholverbodsgebied',
        selectable: false,
        title: 'Alcoholverbodsgebied'
      }
    ],
    notClickable: true,
    maxZoom: 16,
    minZoom: 8,
    title: 'Alcoholverbodsgebieden',
    url: '/maps/overlastgebieden?version=1.3.0&service=WMS'
  },
  {
    category: 'Openbare orde en veiligheid',
    id: 'oovtig',
    layers: ['taxi-standplaatsgebied'],
    legendItems: [
      {
        selectable: false,
        title: 'Omgeving taxi-standplaats',
        imageRule: 'Taxi-standplaatsgebied'
      }
    ],
    notClickable: true,
    maxZoom: 16,
    minZoom: 8,
    title: 'Omgeving taxi-standplaatsen',
    url: '/maps/overlastgebieden?version=1.3.0&service=WMS'
  },
  // to revive end of 2019
  // {
  //   category: 'Openbare orde en veiligheid',
  //   id: 'oovvz',
  //   layers: ['vuurwerkvrijezone'],
  //   legendItems: [
  //     {
  //       selectable: false,
  //       title: 'Vuurwerkvrije zone',
  //       imageRule: 'vuurwerkvrijezone'
  //     }
  //   ],
  //   maxZoom: 16,
  //   minZoom: 8,
  //   notClickable: true,
  //   title: 'Vuurwerkvrije zones',
  //   url: '/maps/overlastgebieden?version=1.3.0&service=WMS'
  // },
  {
    category: 'Toerisme en cultuur',
    id: 'tcmnmt',
    legendItems: [
      {
        layer: ['monument_coordinaten'],
        selectable: false,
        title: 'Monument (pandgerelateerd)'
      },
      {
        layer: 'monument_coordinaten_nopand',
        selectable: false,
        title: 'Monument (overige)'
      }
    ],
    maxZoom: 16,
    minZoom: 12,
    title: 'Monumenten',
    url: '/maps/monumenten?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: bodem',
    id: 'mbgm',
    notClickable: true,
    layers: ['grondmonsters'],
    legendItems: [
      {
        selectable: false,
        title: 'Niet verontreinigd'
      },
      {
        selectable: false,
        title: 'Licht verontreinigd'
      },
      {
        selectable: false,
        title: 'Matig verontreinigd'
      },
      {
        selectable: false,
        title: 'Sterk verontreinigd'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Grondmonsters',
    url: '/maps/bodem?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: bodem',
    id: 'mbaig',
    notClickable: true,
    layers: ['asbest'],
    legendItems: [
      {
        selectable: false,
        title: '-10 - 0 mg/kg'
      },
      {
        selectable: false,
        title: '0,1 - 10 mg/kg'
      },
      {
        selectable: false,
        title: '10,1 - 100 mg/kg'
      },
      {
        selectable: false,
        title: '> 100,1 mg/kg'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Grondmonsters asbest',
    url: '/maps/bodem?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: bodem',
    id: 'mbgwm',
    notClickable: true,
    layers: ['grondwatermonsters'],
    legendItems: [
      {
        selectable: false,
        title: 'Niet verontreinigd'
      },
      {
        selectable: false,
        title: 'Licht verontreinigd'
      },
      {
        selectable: false,
        title: 'Matig verontreinigd'
      },
      {
        selectable: false,
        title: 'Sterk verontreinigd'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Grondwatermonsters',
    url: '/maps/bodem?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: bodem',
    id: 'exin',
    layers: ['inslagen'],
    legendItems: [
      {
        selectable: false,
        title: 'Blindganger'
      },
      {
        selectable: false,
        title: 'Crashlocatie'
      },
      {
        selectable: false,
        title: 'Gedetoneerde vernielingslading'
      },
      {
        selectable: false,
        title: 'Geruimd explosief'
      },
      {
        selectable: false,
        title: 'Niet gedetoneerde vernielingslading'
      },
      {
        selectable: false,
        title: 'Vermoedelijke bominslag(en)'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Explosieven - Inslagen',
    url: '/maps/bommenkaart?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: bodem',
    id: 'exvg',
    layers: ['verdachte_gebieden'],
    legendItems: [
      {
        selectable: false,
        title: 'Munities en granaten'
      },
      {
        selectable: false,
        title: 'Landmijnen'
      },
      {
        selectable: false,
        title: 'Vernielingsladingen'
      },
      {
        selectable: false,
        title: 'Afwerpmunitie'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Explosieven - Verdachte gebieden',
    url: '/maps/bommenkaart?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: bodem',
    id: 'exgg',
    layers: ['gevrijwaarde_gebieden'],
    legendItems: [
      {
        selectable: false,
        title: 'Gevrijwaarde gebieden'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Explosieven - Gevrijwaarde gebieden',
    url: '/maps/bommenkaart?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: bodem',
    id: 'exuo',
    layers: ['uitgevoerde_CE_onderzoeken'],
    legendItems: [
      {
        selectable: false,
        title: 'Detectieonderzoek'
      },
      {
        selectable: false,
        title: 'Projectgebonden risicoanalyse'
      },
      {
        selectable: false,
        title: 'Vooronderzoek'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Explosieven - Uitgevoerde CE-onderzoeken',
    url: '/maps/bommenkaart?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: bodem',
    id: 'bros',
    layers: ['cpt'],
    legendItems: [
      {
        selectable: false,
        title: 'Geotechnische sondering',
        iconUrl: '/assets/images/map-legend/icon-bro-sondering.png'
      }
    ],
    notClickable: true,
    maxZoom: 16,
    minZoom: 8,
    title: 'Geotechnische sonderingen (CPT BRO)'
  },
  {
    category: 'Milieu: externe veiligheid',
    id: 'mvlpgv',
    notClickable: true,
    layers: ['milieu_veiligheid_lpg_vulpunt'],
    legendItems: [
      {
        layer: 'lpgvulpuntplaatsgebondenrisico105',
        selectable: false,
        title: 'Plaatsgebonden risico 10-5'
      },
      {
        layer: 'lpgvulpuntplaatsgebondenrisico106',
        selectable: false,
        title: 'Plaatsgebonden risico 10-6'
      },
      {
        layer: 'lpgvulpuntinvloedsgebied',
        selectable: false,
        title: 'Invloedsgebied groepsrisico'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'LPG-vulpunten - Risicozones',
    url: '/maps/externeveiligheid?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: externe veiligheid',
    id: 'mvlpga',
    notClickable: true,
    layers: ['milieu_veiligheid_lpg_afleverzuil'],
    legendItems: [
      {
        layer: 'lpgafleverzuillocaties',
        selectable: false,
        title: 'Locatie LPG-afleverzuil'
      },
      {
        layer: 'lpgafleverzuilplaatsgebondenrisico',
        selectable: false,
        title: 'Plaatsgebonden risico (15 m)'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'LPG-afleverzuilen - Risicozones',
    url: '/maps/externeveiligheid?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: externe veiligheid',
    id: 'mvlpgt',
    notClickable: true,
    layers: ['milieu_veiligheid_lpg_tank'],
    legendItems: [
      {
        layer: 'lpgtankligging',
        selectable: false,
        title: 'Ligging LPG-tank'
      },
      {
        layer: 'lpgtankplaatsgebondenrisico',
        selectable: false,
        title: 'Plaatsgebondenrisico (25/120 m)'
      },
      {
        layer: 'lpgtankinvloedsgebied',
        selectable: false,
        title: 'Invloedsgebied groepsrisico'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'LPG-tanks - Risicozones',
    url: '/maps/externeveiligheid?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: externe veiligheid',
    id: 'mvlpgs',
    notClickable: true,
    layers: ['milieu_veiligheid_lpg_station'],
    legendItems: [
      {
        layer: 'lpgstationslocaties',
        selectable: false,
        title: 'Locatie LPG-station'
      },
      {
        layer: 'lpgstationcontouren',
        selectable: false,
        title: 'Contouren LPG-station'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'LPG-stations - Risicozones',
    url: '/maps/externeveiligheid?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: externe veiligheid',
    id: 'mvbr',
    notClickable: true,
    layers: [
      'overigerisicobedrijfplaatsgebondenrisico106',
      'overigerisicobedrijfsbronnen'
    ],
    legendItems: [
      {
        layer: 'overigerisicobedrijfplaatsgebondenrisico106',
        selectable: false,
        title: 'Plaatsgebonden risico 10-6'
      },
      {
        layer: 'overigerisicobedrijfsbronnen',
        selectable: false,
        title: 'Bron'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Bedrijven - Bronnen en risicozones',
    url: '/maps/externeveiligheid?version=1.3.0&service=WMS'
  },
  {
    authScope: 'HR/R',
    category: 'Milieu: externe veiligheid',
    id: 'mvi',
    notClickable: true,
    layers: ['overigerisicobedrijfinvloedsgebied'],
    legendItems: [
      {
        layer: 'overigerisicobedrijfinvloedsgebied',
        selectable: false,
        title: 'Invloedsgebied'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Bedrijven - Invloedsgebieden',
    url: '/maps/externeveiligheid?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: externe veiligheid',
    id: 'mvbd',
    notClickable: true,
    layers: ['milieu_veiligheid_bedrijf'],
    legendItems: [
      {
        layer: 'overigerisicobedrijfslocaties',
        selectable: false,
        title: 'Bedrijf'
      },
      {
        layer: 'overigerisicobedrijfscontouren',
        selectable: false,
        title: 'Terrein'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Bedrijven - Terreingrenzen',
    url: '/maps/externeveiligheid?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: externe veiligheid',
    id: 'mvabl',
    notClickable: true,
    layers: ['milieu_veiligheid_aardgasbuisleidingen'],
    legendItems: [
      {
        layer: 'milieu_veiligheid_aardgasbuisleidingen_legenda',
        selectable: false,
        title: 'Aardgasleiding'
      },
      {
        layer: 'risicozonesaardgaspr106',
        selectable: false,
        title: 'Plaatsgebonden risico 10-6'
      },
      {
        layer: 'risicozonesaardgas100let',
        selectable: false,
        title: '100% Letaliteitsafstand'
      },
      {
        layer: 'risicozonesaardgas1let',
        selectable: false,
        title: '1% Letaliteitsafstand'
      },
      {
        layer: 'risicozonesbelemmeringenstrook',
        selectable: false,
        title: 'Belemmeringenstrook'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Aardgasbuisleidingen - Risicozones',
    url: '/maps/externeveiligheid?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: externe veiligheid',
    id: 'mvsw',
    notClickable: true,
    layers: ['risicozonesspoorweg'],
    legendItems: [
      {
        selectable: false,
        title: 'Invloedsgebied spoorwegen'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Spoorwegen - Risicozones',
    url: '/maps/externeveiligheid?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: externe veiligheid',
    id: 'mvvw',
    notClickable: true,
    layers: ['risicozonesvaarweg'],
    legendItems: [
      {
        selectable: false,
        title: 'Invloedsgebied vaarwegen'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Vaarwegen - Risicozones',
    url: '/maps/externeveiligheid?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: externe veiligheid',
    id: 'mvw',
    notClickable: true,
    layers: ['risicozonesweg'],
    legendItems: [
      {
        selectable: false,
        title: 'Invloedsgebied wegen'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Wegen - Risicozones',
    url: '/maps/externeveiligheid?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: externe veiligheid',
    legendItems: [
      {
        id: 'mvvo',
        notClickable: true,
        layer: 'milieu_veiligheid_vuurwerk',
        selectable: true,
        title: 'Vuurwerkopslag'
      },
      {
        id: 'mvmo',
        notClickable: true,
        layer: 'milieu_veiligheid_munitie',
        selectable: true,
        title: 'Munitieopslag'
      },
      {
        id: 'mvgms',
        notClickable: true,
        layer: 'milieu_veiligheid_gasdrukregel_meetstation',
        selectable: true,
        title: 'Gasdrukregel- en meetstation'
      },
      {
        id: 'mvsls',
        notClickable: true,
        layer: 'milieu_veiligheid_sluis',
        selectable: true,
        title: 'Sluis'
      },
      {
        id: 'mvwp',
        notClickable: true,
        layer: 'milieu_veiligheid_wachtplaats',
        selectable: true,
        title: 'Wachtplaats'
      },
      {
        id: 'mvbs',
        notClickable: true,
        layer: 'milieu_veiligheid_bunkerschepen',
        selectable: true,
        title: 'Bunkerschip'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Veiligheidsafstanden',
    url: '/maps/externeveiligheid?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: zones',
    id: 'mgpind',
    notClickable: true,
    layers: ['geluidzoneindustrieterrein'],
    legendItems: [
      {
        layer: 'gezoneerdindustrieterrein',
        selectable: false,
        title: 'Gezoneerd industrieterrein'
      },
      {
        selectable: false,
        title: 'Geluidzone industrieterrein'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Industrie - Geluidszones',
    url: '/maps/planologischegeluidszones?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: zones',
    id: 'mgsw',
    notClickable: true,
    layers: ['spoorwegen'],
    legendItems: [
      {
        selectable: false,
        title: 'Geluidszone spoorwegen'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Spoorwegen - Geluidszones',
    url: '/maps/planologischegeluidszones?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: zones',
    id: 'mgpm',
    notClickable: true,
    layers: ['metro'],
    legendItems: [
      {
        selectable: false,
        title: 'Geluidszone metro'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Metro - Geluidszones',
    url: '/maps/planologischegeluidszones?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: zones',
    id: 'mgpsh',
    notClickable: true,
    layers: ['geluidszoneschiphol'],
    legendItems: [
      {
        selectable: false,
        title: 'Geluidzone Schiphol (nr. 4 \'beperking gebouwen\')'
      },
      {
        selectable: false,
        title: '20 Ke contour'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Schiphol - Ruimtelijke beperkingen',
    url: '/maps/planologischezonesschiphol?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: zones',
    id: 'mgth',
    notClickable: true,
    layers: ['maatgevendetoetshoogteschiphol'],
    legendItems: [
      {
        selectable: false,
        title: '-10 - 0m NAP'
      },
      {
        selectable: false,
        title: '0 - 20m NAP'
      },
      {
        selectable: false,
        title: '20 - 40m NAP'
      },
      {
        selectable: false,
        title: '40 - 60m NAP'
      },
      {
        selectable: false,
        title: '60 - 80m NAP'
      },
      {
        selectable: false,
        title: '80 - 100m NAP'
      },
      {
        selectable: false,
        title: '100 - 140m NAP'
      },
      {
        selectable: false,
        title: '140m NAP'
      },
      {
        selectable: false,
        title: 'Hoger dan 140m NAP'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Schiphol - Maatgevende toetshoogte',
    url: '/maps/planologischezonesschiphol?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: zones',
    id: 'mthr',
    notClickable: true,
    layers: ['toetshoogteradarschiphol'],
    legendItems: [
      {
        selectable: false,
        title: '-10 - 0m NAP'
      },
      {
        selectable: false,
        title: '0 - 20m NAP'
      },
      {
        selectable: false,
        title: '20 - 40m NAP'
      },
      {
        selectable: false,
        title: '40 - 60m NAP'
      },
      {
        selectable: false,
        title: '60 - 80m NAP'
      },
      {
        selectable: false,
        title: '80 - 100m NAP'
      },
      {
        selectable: false,
        title: '100 - 140m NAP'
      },
      {
        selectable: false,
        title: '140m NAP'
      },
      {
        selectable: false,
        title: 'Hoger dan 140m NAP'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Schiphol - Toetshoogte i.v.m. radar',
    url: '/maps/planologischezonesschiphol?version=1.3.0&service=WMS'
  },
  {
    category: 'Milieu: zones',
    id: 'mgvvgsh',
    notClickable: true,
    layers: ['vogelvrijwaringsgebiedschiphol'],
    legendItems: [
      {
        selectable: false,
        title: 'Vogelvrijwaringsgebied'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Schiphol - Vogelvrijwaringsgebied',
    url: '/maps/planologischezonesschiphol?version=1.3.0&service=WMS'
  },
  {
    category: 'Economie en haven',
    id: 'biz',
    layers: ['biz_polygons'],
    legendItems: [
      {
        selectable: false,
        title: 'Bedrijfsinvesteringszone'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Bedrijfsinvesteringszones',
    url: '/maps/biz?version=1.3.0&service=WMS'
  },
  {
    authScope: 'HR/R',
    category: 'Economie en haven',
    id: 'bouw',
    layers: ['bouw'],
    legendItems: [
      {
        selectable: false,
        title: 'Afwerking van gebouwen'
      },
      {
        selectable: false,
        title: 'Bouwinstallatie'
      },
      {
        selectable: false,
        title: 'Bouw/utiliteitsbouw algemeen / klusbedrijf'
      },
      {
        selectable: false,
        title: 'Dak- en overige gespecialiseerde bouw'
      },
      {
        selectable: false,
        title: 'Grond, water, wegenbouw'
      },
      {
        selectable: false,
        title: 'Overige bouw'
      },
      {
        selectable: false,
        title: '(Locatie geschat)'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Vestigingen - Bouw',
    url: '/maps/handelsregister?version=1.3.0&service=WMS'
  },
  {
    authScope: 'HR/R',
    category: 'Economie en haven',
    id: 'csr',
    layers: ['cultuur_sport_recreatie'],
    legendItems: [
      {
        selectable: false,
        title: 'Kunst'
      },
      {
        selectable: false,
        title: 'Musea, bibliotheken, kunstuitleen'
      },
      {
        selectable: false,
        title: 'Recreatie'
      },
      {
        selectable: false,
        title: 'Sport'
      },
      {
        selectable: false,
        title: '(Locatie geschat)'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Vestigingen - Cultuur, sport, recreatie',
    url: '/maps/handelsregister?version=1.3.0&service=WMS'
  },
  {
    authScope: 'HR/R',
    category: 'Economie en haven',
    id: 'fdvrog',
    layers: ['financiele_dienstverlening_verhuur'],
    legendItems: [
      {
        selectable: false,
        title: 'Financiële dienstverlening en verzekeringen'
      },
      {
        selectable: false,
        title: 'Holdings'
      },
      {
        selectable: false,
        title: 'Verhuur van- en beheer/handel in onroerend goed'
      },
      {
        selectable: false,
        title: 'Verhuur van roerende goederen'
      },
      {
        selectable: false,
        title: '(Locatie geschat)'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Vestigingen - Financiële dienstv., verhuur van (on)roerend goed',
    url: '/maps/handelsregister?version=1.3.0&service=WMS'
  },
  {
    authScope: 'HR/R',
    category: 'Economie en haven',
    id: 'hvo',
    layers: ['handel_vervoer_opslag'],
    legendItems: [
      {
        selectable: false,
        title: 'Detailhandel (verkoop aan consumenten, niet zelf vervaardigd)'
      },
      {
        selectable: false,
        title: 'Dienstverlening vervoer'
      },
      {
        selectable: false,
        title: 'Groothandel (verkoop aan andere ondernemingen, niet zelf vervaardigd)'
      },
      {
        selectable: false,
        title: 'Handel en reparatie van auto\'s'
      },
      {
        selectable: false,
        title: 'Handelsbemiddeling (tussenpersoon, verkoopt niet zelf)'
      },
      {
        selectable: false,
        title: 'Opslag'
      },
      {
        selectable: false,
        title: 'Vervoer'
      },
      {
        selectable: false,
        title: '(Locatie geschat)'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Vestigingen - Handel, vervoer, opslag',
    url: '/maps/handelsregister?version=1.3.0&service=WMS'
  },
  {
    authScope: 'HR/R',
    category: 'Economie en haven',
    id: 'hrc',
    layers: ['horeca'],
    legendItems: [
      {
        selectable: false,
        title: 'Café'
      },
      {
        selectable: false,
        title: 'Cafetaria, snackbar, ijssalon'
      },
      {
        selectable: false,
        title: 'Hotel, pension'
      },
      {
        selectable: false,
        title: 'Hotel-restaurant'
      },
      {
        selectable: false,
        title: 'Kantine, catering'
      },
      {
        selectable: false,
        title: 'Restaurant, café-restaurant'
      },
      {
        selectable: false,
        title: 'Overige horeca'
      },
      {
        selectable: false,
        title: '(Locatie geschat)'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Vestigingen - Horeca',
    url: '/maps/handelsregister?version=1.3.0&service=WMS'
  },
  {
    authScope: 'HR/R',
    category: 'Economie en haven',
    id: 'itc',
    layers: ['telecommunicatie'],
    legendItems: [
      {
        selectable: false,
        title: 'Activiteiten op gebied van film, tv, radio, audio'
      },
      {
        selectable: false,
        title: 'Activiteiten op het gebied van ict'
      },
      {
        selectable: false,
        title: 'Telecommunicatie'
      },
      {
        selectable: false,
        title: 'Uitgeverijen'
      },
      {
        selectable: false,
        title: '(Locatie geschat)'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Vestigingen - Informatie, telecommunicatie',
    url: '/maps/handelsregister?version=1.3.0&service=WMS'
  },
  {
    authScope: 'HR/R',
    category: 'Economie en haven',
    id: 'lb',
    layers: ['landbouw'],
    legendItems: [
      {
        selectable: false,
        title: 'Dienstverlening voor de land/tuinbouw'
      },
      {
        selectable: false,
        title: 'Fokken, houden dieren'
      },
      {
        selectable: false,
        title: 'Gemengd bedrijf'
      },
      {
        selectable: false,
        title: 'Teelt eenjarige gewassen'
      },
      {
        selectable: false,
        title: 'Teelt meerjarige gewassen'
      },
      {
        selectable: false,
        title: 'Teelt sierplanten'
      },
      {
        selectable: false,
        title: '(Locatie geschat)'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Vestigingen - Landbouw',
    url: '/maps/handelsregister?version=1.3.0&service=WMS'
  },
  {
    authScope: 'HR/R',
    category: 'Economie en haven',
    id: 'ooz',
    layers: ['overheid_onderwijs_zorg'],
    legendItems: [
      {
        selectable: false,
        title: 'Gezondheids- en welzijnszorg'
      },
      {
        selectable: false,
        title: 'Onderwijs'
      },
      {
        selectable: false,
        title: 'Overheid'
      },
      {
        selectable: false,
        title: '(Locatie geschat)'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Vestigingen - Overheid, onderwijs, zorg',
    url: '/maps/handelsregister?version=1.3.0&service=WMS'
  },
  {
    authScope: 'HR/R',
    category: 'Economie en haven',
    id: 'pd',
    layers: ['persoonlijke_dienstverlening'],
    legendItems: [
      {
        selectable: false,
        title: 'Kappers'
      },
      {
        selectable: false,
        title: 'Sauna, solaria'
      },
      {
        selectable: false,
        title: 'Schoonheidsverzorging'
      },
      {
        selectable: false,
        title: 'Uitvaart, crematoria'
      },
      {
        selectable: false,
        title: 'Overige dienstverlening'
      },
      {
        selectable: false,
        title: '(Locatie geschat)'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Vestigingen - Persoonlijke dienstverlening',
    url: '/maps/handelsregister?version=1.3.0&service=WMS'
  },
  {
    authScope: 'HR/R',
    category: 'Economie en haven',
    id: 'pir',
    layers: ['productie_installatie_reparatie'],
    legendItems: [
      {
        selectable: false,
        title: 'Installatie (geen bouw)'
      },
      {
        selectable: false,
        title: 'Productie'
      },
      {
        selectable: false,
        title: 'Reparatie (geen bouw)'
      },
      {
        selectable: false,
        title: '(Locatie geschat)'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Vestigingen - Productie, installatie, reparatie',
    url: '/maps/handelsregister?version=1.3.0&service=WMS'
  },
  {
    authScope: 'HR/R',
    category: 'Economie en haven',
    id: 'zd',
    layers: ['zakelijke_dienstverlening'],
    legendItems: [
      {
        selectable: false,
        title: 'Accountancy, administratie'
      },
      {
        selectable: false,
        title: 'Advocaten rechtskundige diensten, notarissen'
      },
      {
        selectable: false,
        title: 'Arbeidsbemiddeling, uitzendbureaus, uitleenbureaus'
      },
      {
        selectable: false,
        title: 'Architecten'
      },
      {
        selectable: false,
        title: 'Design'
      },
      {
        selectable: false,
        title: 'Interieurarchitecten'
      },
      {
        selectable: false,
        title: 'Managementadvies, economisch advies'
      },
      {
        selectable: false,
        title: 'Public relationsbureaus'
      },
      {
        selectable: false,
        title: 'Reclame en Marktonderzoek'
      },
      {
        selectable: false,
        title: 'Technisch ontwerp, advies, keuring/research'
      },
      {
        selectable: false,
        title: 'Overige zakelijke dienstverlening'
      },
      {
        selectable: false,
        title: '(Locatie geschat)'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Vestigingen - Zakelijke dienstverlening',
    url: '/maps/handelsregister?version=1.3.0&service=WMS'
  },
  {
    authScope: 'HR/R',
    category: 'Economie en haven',
    id: 'ovrg',
    layers: ['overige'],
    legendItems: [
      {
        selectable: false,
        title: 'Belangenorganisaties'
      },
      {
        selectable: false,
        title: 'Hobbyclubs'
      },
      {
        selectable: false,
        title: 'Ideële organisaties'
      },
      {
        selectable: false,
        title: 'Overige'
      },
      {
        selectable: false,
        title: '(Locatie geschat)'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Vestigingen - Overige',
    url: '/maps/handelsregister?version=1.3.0&service=WMS'
  },
  {
    authScope: 'GREX/R',
    id: 'grexProjecten',
    category: 'Stedelijke ontwikkeling',
    layers: ['grondexploitatie_polygons'],
    legendItems: [
      {
        selectable: false,
        title: 'Actueel'
      },
      {
        selectable: false,
        title: 'Toekomstig'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Grondexploitaties - Projecten',
    url: '/maps/grondexploitatie?version=1.3.0&service=WMS'
  },
  {
    authScope: 'GREX/R',
    id: 'grexStadsdelen',
    category: 'Stedelijke ontwikkeling',
    layers: ['stadsdeel_polygons'],
    legendItems: [
      {
        selectable: false,
        title: 'Totale begroting baten',
        iconUrl: '/assets/images/map-legend/icon-grex-stadsdeel.svg'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Grondexploitaties - Stadsdelen',
    url: '/maps/grondexploitatie?version=1.3.0&service=WMS'
  }
];
