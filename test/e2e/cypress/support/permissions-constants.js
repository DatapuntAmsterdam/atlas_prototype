const urls = {
  address: '/data/bag/verblijfsobject/id03630000749400?lat=52.37026793589415&legenda=false&lng=4.893407140678303&zoom=16',
  business: '/data/brk/object/idNL.KAD.OnroerendeZaak.11460857510001?lat=52.370780184456194&legenda=false&lng=4.893603037285888&zoom=16',
  gemeentelijkeBeperking: '/data/wkpb/beperking/id1006388',
  geoSearch: '/data/geozoek?locatie=52.3736166%2C4.8943521',
  ligplaats: '/data/bag/ligplaats/id03630001025735',
  maatschappelijkeActiviteit: '/data/handelsregister/maatschappelijkeactiviteit/id01029509',
  map: '/data?center=52.3731081%2C4.8932945&modus=kaart&legenda=false',
  monument: '/data/monumenten/monumenten/idc115314a-59d4-4574-bfe9-1f7df5cb20c4',
  monumentComplex: '/data/monumenten/complexen/id182a9861-4052-4127-8300-6450cd75b6a5',
  natuurlijk: '/data/brk/subject/idNL.KAD.Persoon.171720901',
  nietNatuurlijk: 'data/brk/subject/idNL.KAD.Persoon.423186718',
  pand: '/data/bag/pand/id0363100012168052',
  parkeervak: '/data/parkeervakken/parkeervakken/id121403487278/',
  standplaats: '/data/bag/standplaats/id03630000691684',
  vestiging: '/data/handelsregister/vestiging/id000003579875/?modus=gesplitst',
  vestigingenTabel: '/data/hr/vestigingen?modus=volledig&legenda=false&zoom=11'
};

const queries = {
  autoSuggestHeader: '.qa-auto-suggest-header',
  headerTitle: '.o-header__title',
  headerSubTitle: '.o-header__subtitle',
  infoNotification: '.notification--info',
  keyValueList: '.c-key-value-list',
  legendItem: '.map-legend__title',
  legendNotification: '.map-legend__notification',
  legendToggleItem: '.map-layers__toggle-title',
  listItem: 'li',
  mapLayersCategory: '.map-layers__category',
  mapDetailResultHeaderSubTitle: '.map-detail-result__header-subtitle',
  mapDetailResultItem: '.map-detail-result__item',
  mapSearchResultsCategoryHeader: '.map-search-results-category__header',
  natuurlijkPersoon: 'dl.qa-natuurlijk-persoon',
  nietNatuurlijkPersoon: 'dl.qa-niet-natuurlijk-persoon',
  searchHeader: '.qa-search-header',
  warningPanel: '.notification--info',
  warningPanelAngular: '.c-panel--warning'
};

const values = {
  aantekeningen: 'Aantekeningen',
  bedrijvenInvloedsgebieden: 'Bedrijven - Invloedsgebieden',
  beschrijving: 'Beschrijving',
  documentnaam: 'Documentnaam',
  economieEnHaven: 'Economie en haven',
  geografie: 'Geografie',
  kadastraleSubjecten: 'Kadastrale subjecten',
  legendCafeValue: 'Café',
  legendPermissionNotification: 'Zichtbaar na inloggen',
  ligplaatsVestigingName: 'alac',
  maatschappelijkeActiviteitName: 'om B',
  maatschappelijkeActiviteitVestigingName: 'om B',
  pandVestigingName: 'ller',
  redengevendeOmschrijving: 'Redengevende omschrijving',
  standplaatsVestigingName: 'us B',
  parkeervakId: '121403487278',
  type: 'Type',
  vestigingName: 'om B',
  vestigingen: 'Vestigingen',
  vestigingenHoreca: 'Vestigingen - Horeca',
  zakelijkeRechten: 'Zakelijke rechten'
};

export default {
  queries,
  urls,
  values
};
