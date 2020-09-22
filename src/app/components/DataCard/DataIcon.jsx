import React from 'react'
// Check if these icons must be moved to @amsterdam/asc-assets
import { ReactComponent as IconBuilding } from '../../../shared/assets/icons/data/IconBuilding.svg'
import { ReactComponent as IconChurch } from '../../../shared/assets/icons/data/IconChurch.svg'
import { ReactComponent as IconConstruction } from '../../../shared/assets/icons/data/IconConstruction.svg'
import { ReactComponent as IconFactory } from '../../../shared/assets/icons/data/IconFactory.svg'
import { ReactComponent as IconHandshake } from '../../../shared/assets/icons/data/IconHandshake.svg'
import { ReactComponent as IconHouse } from '../../../shared/assets/icons/data/IconHouse.svg'
import { ReactComponent as IconMap } from '../../../shared/assets/icons/data/IconMap.svg'
import { ReactComponent as IconMarker } from '../../../shared/assets/icons/data/IconMarker.svg'
import { ReactComponent as IconMarkerMap } from '../../../shared/assets/icons/data/IconMarkerMap.svg'
import { ReactComponent as IconOffice } from '../../../shared/assets/icons/data/IconOffice.svg'
import { ReactComponent as IconPark } from '../../../shared/assets/icons/data/IconPark.svg'
import { ReactComponent as IconSkyscraper } from '../../../shared/assets/icons/data/IconSkyscraper.svg'

const ICONS = {
  adressen: <IconMarker />,
  gebieden: <IconMap />,
  kadastrale_objecten: <IconBuilding />,
  kadastrale_subjecten: <IconOffice />,
  maatschappelijkeactiviteit: <IconHandshake />,
  meetbouten: <IconHouse />,
  monumenten: <IconChurch />,
  openbareruimte: <IconPark />,
  panden: <IconSkyscraper />,
  straatnamen: <IconMarkerMap />,
  vestigingen: <IconFactory />,
  bouwdossiers: <IconConstruction />,
}

const DataIcon = ({ type }) => (ICONS[type] ? ICONS[type] : <></>)
export default DataIcon
