import { ReactElement } from 'react'
import { Api, Data, DocumentText, Map, Pano, Table } from '@amsterdam/asc-assets'
import { Icon } from '@amsterdam/asc-ui'
import { LocationDescriptorObject } from 'history'
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

export type NavigationLink = {
  CardIcon?: ReactElement
  description?: string
  id: number
  testId: string
  title: string
  to: LocationDescriptorObject
}

// The id's also represent the order in which they are displayed in the NavigationBlock on the homepage
// The order of how the items are placed in the array, is the order for the Menu
const navigationLinks = [
  {
    id: 0,
    to: toMapWithLegendOpen(),
    CardIcon: () => (
      <Icon size={48}>
        <Map />
      </Icon>
    ),
    testId: 'Kaart',
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
    testId: 'Panoramabeelden',
    title: 'Panoramabeelden',
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
    testId: NAVIGATION_LINK_DATA_IN_TABLES.testId,
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
    testId: NAVIGATION_LINK_DATA_SERVICES.testId,
    title: NAVIGATION_LINK_DATA_SERVICES.title,
    description: NAVIGATION_LINK_DATA_SERVICES.description,
  },
  {
    id: 6,
    to: toCollectionSearch(null, false, false, false),
    testId: routes.collectionSearch.title,
    title: routes.collectionSearch.title,
  },
  {
    id: 7,
    to: toSpecialSearch(null, false, false, false),
    testId: routes.specialSearch.title,
    title: routes.specialSearch.title,
  },
  {
    id: 9,
    to: toMapSearch(null, false, false, false),
    testId: routes.mapSearch.title,
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
    testId: routes.datasetSearch.title,
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
    testId: routes.publicationSearch.title,
    title: routes.publicationSearch.title,
    description: 'Download factsheets en onderzoeksrapporten',
  },
  {
    id: 8,
    to: toArticleSearch(null, false, false, false),
    testId: routes.articleSearch.title,
    title: routes.articleSearch.title,
  },
]

export default navigationLinks
