export const ADDRESS_PAGE = {
  buttonOpenMap: '.c-toggle-view-button.qa-dp-link',
  buttonMaximizeMap: 'button.icon-button__right',
  buttonShowMore: '.map-search-results__button',
  dataSelection: '.c-data-selection',
  detailPage: '.c-detail',
  iconCluster: '.o-highlight-cluster',
  iconMapMarker: '.leaflet-marker-icon',
  linkVestigingen: '.qa-hr',
  mapContainer: '.qa-map-container',
  mapDetailResultHeader: '.map-detail-result__header-subtitle',
  notification: '.notification__content',
  panoramaThumbnail: 'img.c-panorama-thumbnail--img',
  resultsList: 'ul.o-list',
  resultsListItem: '.qa-list-item-link',
  resultsPanel: '.qa-dashboard__column--right',
  resultsPanelTitle: '.qa-title',
  tab: '.o-tabs__tab',
}

export const DATA_SEARCH = {
  autoSuggest: '.auto-suggest',
  autoSuggestDropdown: '.auto-suggest__dropdown',
  autosuggestDropdownActive: '.auto-suggest__dropdown-item--active',
  autosuggestDropdownInActive: '.auto-suggest__dropdown-item--inactive',
  autoSuggestDropdownCategories: '.auto-suggest__dropdown-category li',
  autoSuggestDropdownHighlighted: '.auto-suggest__dropdown__highlight',
  autoSuggestInput: '#auto-suggest__input',
  autoSuggestHeader: 'h4.qa-auto-suggest-header',
  headerTitle: '.o-header__title',
  headerSubTitle: '.o-header__subtitle',
  infoNotification: '.notification--info',
  keyValueList: '.c-key-value-list',
  listItem: 'li',
  mapLayersCategory: '.map-layers__category',
  mapDetailResultHeaderSubTitle: '.map-detail-result__header-subtitle',
  mapDetailResultItem: '.map-detail-result__item',
  natuurlijkPersoon: 'dl.qa-natuurlijk-persoon',
  nietNatuurlijkPersoon: 'dl.qa-niet-natuurlijk-persoon',
  scrollWrapper: '.scroll-wrapper',
  searchHeader: '.qa-search-header',
  searchResultsGrid: '.c-search-results',
  warningPanel: '.c-panel',
  warningPanelAngular: '.c-panel--warning',
}

export const DATA_SELECTION_TABLE = {
  table: '.c-ds-table',
  head: '.c-ds-table__head',
  body: '.c-ds-table__body',
  row: '.c-ds-table__row',
  cell: '.c-ds-table__cell',
  content: '.c-data-selection-content',
}

export const DATA_SETS = {
  datasetItem: '.resources-type__content-item',
  dataSetLink: '[data-test=DatasetCard]',
  headerDataset: '.o-header__subtitle',
}

export const HEADER = {
  root: '[data-test=header]',
}

export const HEADER_MENU = {
  buttonMenu: '[aria-label=Menu]',
  rootMobile: '[data-test=header-menu-mobile]',
  rootDefault: '[data-test=header-menu-default]',
  login: '[data-test=login]',
}

export const HEADINGS = {
  dataSelectionHeading: '[data-test=data-selection-heading]',
}

export const HOMEPAGE = {
  aboutBlock: '[data-test=about-block]',
  highlightBlock: '[data-test=highlight-block]',
  link: '[data-test=themes-block-link]',
  navigationBlock: '[data-test=navigation-block]',
  navigationBlockKaart:
    '[data-test=navigation-block] > [href="/data/?modus=kaart&legenda=true&lagen="]',
  navigationBlockPanorama: '[data-test=navigation-block] > [href*="/data/panorama/"]',
  navigationBlockTabellen: '[data-test=navigation-block] > [href*="/artikelen/artikel/tabellen/"]',
  organizationBlock: '[data-test=organization-block]',
  specialBlock: '[data-test=special-block]',
}

export const MAP = {
  buttonEnlarge: 'button.map-preview-panel__button[title="Volledige weergave tonen"]',
  checkboxPanoramabeelden: '#Panoramabeelden',
  checkboxHoogte: '#Hoogte',
  checkboxGebiedsindeling: '#Gebiedsindeling',
  checkboxVestigingen: '#Vestigingen',
  contextMenu: '[data-test=context-menu]',
  contextMenuItemEmbed: '[data-test=context-menu-embed]',
  embedButton: '[data-test=embed-button]',
  iconMapMarker: '.leaflet-marker-icon.leaflet-zoom-animated.leaflet-interactive',
  imageLayer: '.leaflet-image-layer',
  legendItem: '.map-legend__title',
  legendNotification: '.map-legend__notification',
  legendToggleItem: '.map-layers__toggle-title',
  mapContainer: '.leaflet-container',
  mapDetailResultPanel: '.map-detail-result',
  mapLegend: '.map-legend',
  mapMaximize: '.rc-icon-button',
  mapPanel: '.map-panel',
  mapPreviewPanel: '.map-preview-panel',
  mapPreviewPanelVisible: '.map-preview-panel.map-preview-panel--visible',
  mapDetailPanoramaHeader: '.map-search-results__header-pano',
  mapDetailPanoramaHeaderImage: 'img.map-detail-result__header-pano',
  mapSearchResultsCategoryHeader: '.map-search-results-category__header',
  mapSearchResultsItem: '.map-search-results-item__name',
  mapSearchResultsPanel: '.map-search-results',
  mapSelectedObject: '.leaflet-interactive',
  mapOverlayPane: '.leaflet-overlay-pane',
  mapZoomIn: '.leaflet-control-zoom-in',
  toggleMapPanel: '.map-panel__toggle',
}

export const PANORAMA = {
  buttonClosePanorama: '.c-panorama > .icon-button__right > .rc-icon-button',
  homepage: '.c-homepage',
  markerPane: '.leaflet-marker-pane',
  statusBarCoordinates: '.c-panorama-status-bar__coordinates',
  panorama: '.c-panorama',
}
export const PRINT = {
  buttonClosePrint: '.c-print-header__close',
  headerTitle: 'h1.c-print-header__title',
  printLink: '.qa-share-bar > div > button:nth(4) ',
}

export const PUBLICATIONS = {
  sortDropdown: '[data-testid="sort-select"]',
}

export const SEARCH = {
  form: '[data-test=search-form]',
  input: '[data-test=search-input]',
}

export const TABLES = {
  activeFilterItem: '.c-data-selection-active-filters__listitem',
  detailPane: '.qa-detail',
  detailTitle: 'h2.o-header__title',
  filterCategories: '.c-data-selection-available-filters__category',
  filterItem: '.c-data-selection-available-filters__item',
  filterLabel: '.qa-option-label',
  filterPanel: '.qa-available-filters',
  kadasterLink: '[href*="/data/brk/kadastrale-objecten"]',
  tableValue: '.qa-table-value',
  warningPanel: '.c-panel__paragraph',
  vestigingLink: '.qa-table-link',
}
