import React from 'react'
import { Api, Data, DocumentText, Map, Pano, Table } from '@datapunt/asc-assets'
import { Icon } from '@datapunt/asc-ui'
import {
  toMap,
  toPanoramaAndPreserveQuery,
  toPublicationOverview,
  toDatasets,
  toAdresses,
  toApisPage,
} from '../../../../store/redux-first-router/actions'

const NAVIGATION_LINKS = [
  {
    id: 0,
    to: toMap(),
    CardIcon: () => (
      <Icon square size={32}>
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
      <Icon size={36}>
        <Pano />
      </Icon>
    ),
    title: 'Panoramabeelden',
    description: 'Kijk 360 graden in het rond',
  },
  {
    id: 2,
    to: toPublicationOverview(),
    CardIcon: () => (
      <Icon size={36}>
        <DocumentText />
      </Icon>
    ),
    title: 'Publicaties',
    description: 'Download fasctsheets en onderzoeksrapporten',
  },
  {
    id: 3,
    to: toDatasets(),
    CardIcon: () => (
      <Icon size={32}>
        <Data />
      </Icon>
    ),
    title: 'Datasets',
    description: 'Zoek en download databestanden',
  },
  {
    id: 4,
    to: toAdresses(),
    CardIcon: () => (
      <Icon size={32}>
        <Table />
      </Icon>
    ),
    title: 'Tabellen',
    description: 'Selecteer data en sla op als spreadsheet',
  },
  {
    id: 5,
    to: toApisPage(),
    CardIcon: () => (
      <Icon size={36}>
        <Api />
      </Icon>
    ),
    title: 'Data services',
    description: 'Alles over het koppelen van data via APIs',
  },
]

export default NAVIGATION_LINKS
