const urls = {
  address: '/#?dte=bag%2Fverblijfsobject%2F03630000749400%2F&mpb=topografie&mpz=16&mpv=52.3702716:4.8933987&upg=KAART_DETAIL',
  business: '/#?dte=brk%2Fobject%2FNL.KAD.OnroerendeZaak.11460857510001%2F&mpb=topografie&mpz=16&mpv=52.370289:4.8931626&upg=KAART_DETAIL',
  gemeentelijkeBeperking: '/#?dte=wkpb%2Fbeperking%2F1006388%2F&mpb=topografie&mpz=13&mpo=gbep::T&mpv=52.3777106:4.8920377&upg=KAART_DETAIL',
  geoSearch: '/#?mpb=topografie&mpz=13&mpv=52.3736166:4.8943521&srl=ZRWuR:3JKmX&upg=KAART_SEARCH',
  ligplaats: '/#?dte=bag%2Fligplaats%2F0363020001025735%2F&mpb=topografie&mpz=15&mpv=52.3757011:4.906364&upg=KAART_DETAIL',
  maatschappelijkeActiviteit: '/#?dte=handelsregister%2Fmaatschappelijkeactiviteit%2F01029509%2F&dtfs=T&mpb=topografie&mpz=16&mpv=52.3606667:4.8941516&upg=KAART_DETAIL',
  map: '/#?mpb=topografie&mpz=11&mpfs=T&mpv=52.3731081:4.8932945&pgn=home&uvm=T&upg=KAART',
  monument: '/#?dte=monumenten%2Fmonumenten%2Fc115314a-59d4-4574-bfe9-1f7df5cb20c4%2F&mpb=topografie&mpz=16&mpv=52.3593154:4.8850025&upg=KAART_DETAIL',
  monumentComplex: '/#?dte=monumenten%2Fcomplexen%2F182a9861-4052-4127-8300-6450cd75b6a5%2F&dtfs=T&mpb=topografie&mpz=16&mpv=52.3671779:4.908292&upg=KAART_DETAIL',
  natuurlijk: '/#?dte=brk%2Fsubject%2FNL.KAD.Persoon.171720901%2F&dtfs=T&mpb=topografie&mpz=11&mpv=52.3731081:4.8932945&upg=KAART_DETAIL',
  nietNatuurlijk: '/#?dte=brk%2Fsubject%2FNL.KAD.Persoon.423186718%2F&dtfs=T&mpb=topografie&mpz=11&mpv=52.3731081:4.8932945&upg=KAART_DETAIL',
  pand: '/#?dte=bag%2Fpand%2F0363100012168052%2F&mpb=topografie&mpz=13&mpv=52.3736166:4.8943521&upg=KAART_DETAIL',
  standplaats: '/#?dte=bag%2Fstandplaats%2F03630000691684%2F&mpb=topografie&mpz=16&mpv=52.3747877:4.8352249&upg=KAART_DETAIL',
  vestiging: '/#?dte=handelsregister%2Fvestiging%2F000003579875%2F&mpb=topografie&mpz=16&mpv=52.3606667:4.8941516&upg=KAART_DETAIL',
  vestigingenTabel: '/#?dsd=hr&dsp=1&dsv=TABLE&mpb=topografie&mpz=11&mpv=52.3731081:4.8932945&upg=ADRESSEN'
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
  warningPanel: '.c-panel--warning'
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
