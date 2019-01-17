const urls = {
  address: '/data/bag/verblijfsobject/id03630000749400?lat=52.37026793589415&legenda=false&lng=4.893407140678303&zoom=16',
  business: '/data/brk/object/idNL.KAD.OnroerendeZaak.11460857510001?lat=52.370780184456194&legenda=false&lng=4.893603037285888&zoom=16',
  gemeentelijkeBeperking: '/data/wkpb/beperking/id1006388',
  geoSearch: '/data/geozoek?locatie=52.3736166%2C4.8943521&view=lijst-kaart',
  ligplaats: '/data/bag/ligplaats/id03630001025735?view=lijst-kaart',
  maatschappelijkeActiviteit: '/data/handelsregister/maatschappelijkeactiviteit/id01029509',
  map: '/?center=52.3731081%2C4.8932945&view=kaart',
  monument: '/data/monumenten/monumenten/idc115314a-59d4-4574-bfe9-1f7df5cb20c4',
  monumentComplex: '/data/monumenten/complexen/id182a9861-4052-4127-8300-6450cd75b6a5',
  natuurlijk: '/data/brk/subject/idNL.KAD.Persoon.171720901',
  nietNatuurlijk: 'data/brk/subject/idNL.KAD.Persoon.423186718',
  pand: '/data/bag/pand/id0363100012168052?legenda=false',
  standplaats: '/data/bag/standplaats/id03630000691684?view=lijst-kaart',
  vestiging: '/data/handelsregister/vestiging/id000003579875?view=lijst-kaart',
  vestigingenTabel: '/data/hr/vestigingen?legenda=false&zoom=11'
};

const oldTestUrls = {
  address: '/#?dte=bag%2Fverblijfsobject%2F03630000749400%2F&mpb=topografie&mpz=16&mpv=52.3702716:4.8933987',
  business: '/#?dte=brk%2Fobject%2FNL.KAD.OnroerendeZaak.11460857510001%2F&mpb=topografie&mpz=16&mpv=52.370289:4.8931626',
  gemeentelijkeBeperking: '/#?dte=wkpb%2Fbeperking%2F1006388%2F&mpb=topografie&mpz=13&mpo=gbep::T&mpv=52.3777106:4.8920377',
  geoSearch: '/#?mpb=topografie&mpz=13&mpv=52.3736166:4.8943521&srl=ZRWuR:3JKmX',
  ligplaats: '/#?dte=bag%2Fligplaats%2F0363020001025735%2F&mpb=topografie&mpz=15&mpv=52.3757011:4.906364',
  maatschappelijkeActiviteit: '/#?dte=handelsregister%2Fmaatschappelijkeactiviteit%2F01029509%2F&dtfs=T&mpb=topografie&mpz=16&mpv=52.3606667:4.8941516',
  map: '/#?mpb=topografie&mpz=11&mpfs=T&mpv=52.3731081:4.8932945&pgn=home&uvm=T',
  monument: '/#?dte=monumenten%2Fmonumenten%2Fc115314a-59d4-4574-bfe9-1f7df5cb20c4%2F&mpb=topografie&mpz=16&mpv=52.3593154:4.8850025',
  monumentComplex: '/#?dte=monumenten%2Fcomplexen%2F182a9861-4052-4127-8300-6450cd75b6a5%2F&dtfs=T&mpb=topografie&mpz=16&mpv=52.3671779:4.908292',
  natuurlijk: '/#?dte=brk%2Fsubject%2FNL.KAD.Persoon.171720901%2F&dtfs=T&mpb=topografie&mpz=11&mpv=52.3731081:4.8932945',
  nietNatuurlijk: '/#?dte=brk%2Fsubject%2FNL.KAD.Persoon.423186718%2F&dtfs=T&mpb=topografie&mpz=11&mpv=52.3731081:4.8932945',
  pand: '/#?dte=bag%2Fpand%2F0363100012168052%2F&mpb=topografie&mpz=13&mpv=52.3736166:4.8943521',
  standplaats: '/#?dte=bag%2Fstandplaats%2F03630000691684%2F&mpb=topografie&mpz=16&mpv=52.3747877:4.8352249',
  vestiging: '/#?dte=handelsregister%2Fvestiging%2F000003579875%2F&mpb=topografie&mpz=16&mpv=52.3606667:4.8941516',
  vestigingenTabel: '/#?dsd=hr&dsp=1&dsv=TABLE&mpb=topografie&mpz=11&mpv=52.3731081:4.8932945'
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
  table: '.c-table',
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
