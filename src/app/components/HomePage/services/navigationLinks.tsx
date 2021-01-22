import { Api, Data, DocumentText, Map, Pano, Table } from '@amsterdam/asc-assets'
import { Icon } from '@amsterdam/asc-ui'
import { To } from 'redux-first-router-link'
import environment from '../../../../environment'
import {
  NAVIGATION_LINK_DATA_IN_TABLES,
  NAVIGATION_LINK_DATA_SERVICES,
} from '../../../../shared/config/content-links'
import {
  toArticleDetail,
  toArticleSearch,
  toCollectionSearch,
  toDatasetSearch,
  toMapSearch,
  toMapWithLegendOpen,
  toPanoramaAndPreserveQuery,
  toPublicationSearch,
  toSpecialSearch,
} from '../../../../store/redux-first-router/actions'
import { routing as routes } from '../../../routes'

export interface NavigationLink {
  id: number
  to: To
  CardIcon?: () => JSX.Element
  title: string
  description?: string
}

// The id's also represent the order in which they are displayed in the NavigationBlock on the homepage
// The order of how the items are placed in the array, is the order for the Menu
const navigationLinks: NavigationLink[] = [
  {
    id: 0,
    to: toMapWithLegendOpen(),
    CardIcon: () => (
      <Icon size={48}>
        <Map />
      </Icon>
    ),
    title: 'Kaart',
    description: 'Zoek en bekijk data op de kaart',
  },
  {
    id: 1,
    to: toPanoramaAndPreserveQuery(undefined, undefined, undefined, 'home'),
    CardIcon: () => (
      <Icon size={48}>
        <Pano />
      </Icon>
    ),
    // This text includes a soft hyphen to break words correctly, which might not show up in your editor.
    title: 'Panorama­beelden',
    description: 'Kijk 360 graden in het rond',
  },
  {
    id: 4,
    to: toArticleDetail(
      NAVIGATION_LINK_DATA_IN_TABLES.id[environment.DEPLOY_ENV],
      NAVIGATION_LINK_DATA_IN_TABLES.slug,
    ),
    CardIcon: () => (
      <Icon size={42}>
        <Table />
      </Icon>
    ),
    title: NAVIGATION_LINK_DATA_IN_TABLES.title,
    description: NAVIGATION_LINK_DATA_IN_TABLES.description,
  },
  {
    id: 5,
    to: toArticleDetail(
      NAVIGATION_LINK_DATA_SERVICES.id[environment.DEPLOY_ENV],
      NAVIGATION_LINK_DATA_SERVICES.slug,
    ),
    CardIcon: () => (
      <Icon size={48}>
        <Api />
      </Icon>
    ),
    title: NAVIGATION_LINK_DATA_SERVICES.title,
    description: NAVIGATION_LINK_DATA_SERVICES.description,
  },
  {
    id: 6,
    to: toCollectionSearch(null, false, false, false),
    title: routes.collectionSearch.title,
  },
  {
    id: 7,
    to: toSpecialSearch(null, false, false, false),
    title: routes.specialSearch.title,
  },
  {
    id: 9,
    to: toMapSearch(null, false, false, false),
    title: routes.mapSearch.title,
  },
  {
    id: 3,
    to: toDatasetSearch(null, false, false, false),
    CardIcon: () => (
      <Icon size={48}>
        <Data />
      </Icon>
    ),
    title: routes.datasetSearch.title,
    description: 'Zoek en download databestanden',
  },
  {
    id: 2,
    to: toPublicationSearch(null, false, false, false),
    CardIcon: () => (
      <Icon size={48}>
        <DocumentText />
      </Icon>
    ),
    title: routes.publicationSearch.title,
    // This text includes a soft hyphen to break words correctly, which might not show up in your editor.
    description: 'Download factsheets en onderzoeks­rapporten',
  },
  {
    id: 8,
    to: toArticleSearch(null, false, false, false),
    title: routes.articleSearch.title,
  },
]

export default navigationLinks
