import { Api, Data, DocumentText, Map, Pano, Table } from '@amsterdam/asc-assets'
import { Icon } from '@amsterdam/asc-ui'
import React from 'react'
import environment from '../../../../environment'
import { NAVIGATION_LINKS } from '../../../../shared/config/config'
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
import decodeHTML from '../../../utils/decodeHTML'

// The id's also represent the order in which they are displayed in the NavigationBlock on the homepage
// The order of how the items are placed in the array, is the order for the Menu
const navigationLinks = [
  {
    id: 0,
    to: toMapWithLegendOpen(),
    CardIcon: () => (
      <Icon square size={48}>
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
    title: decodeHTML('Panorama&shy;beelden'),
    description: 'Kijk 360 graden in het rond',
  },
  {
    id: 4,
    to: toArticleDetail(
      NAVIGATION_LINKS.DATA_IN_TABLES.id[environment.DEPLOY_ENV],
      NAVIGATION_LINKS.DATA_IN_TABLES.slug,
    ),
    CardIcon: () => (
      <Icon size={42}>
        <Table />
      </Icon>
    ),
    title: NAVIGATION_LINKS.DATA_IN_TABLES.title,
    description: NAVIGATION_LINKS.DATA_IN_TABLES.description,
  },
  {
    id: 5,
    to: toArticleDetail(
      NAVIGATION_LINKS.DATA_SERVICES.id[environment.DEPLOY_ENV],
      NAVIGATION_LINKS.DATA_SERVICES.slug,
    ),
    CardIcon: () => (
      <Icon size={48}>
        <Api />
      </Icon>
    ),
    title: NAVIGATION_LINKS.DATA_SERVICES.title,
    description: NAVIGATION_LINKS.DATA_SERVICES.description,
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
    description: decodeHTML('Download factsheets en onderzoeks&shy;rapporten'),
  },
  {
    id: 8,
    to: toArticleSearch(null, false, false, false),
    title: routes.articleSearch.title,
  },
]

export default navigationLinks
