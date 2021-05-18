import type { FunctionComponent } from 'react'
import IconBuilding from '../../../shared/assets/icons/data/IconBuilding.svg'
import IconChurch from '../../../shared/assets/icons/data/IconChurch.svg'
import IconConstruction from '../../../shared/assets/icons/data/IconConstruction.svg'
import IconFactory from '../../../shared/assets/icons/data/IconFactory.svg'
import IconHandshake from '../../../shared/assets/icons/data/IconHandshake.svg'
import IconHouse from '../../../shared/assets/icons/data/IconHouse.svg'
import IconMap from '../../../shared/assets/icons/data/IconMap.svg'
import IconMarker from '../../../shared/assets/icons/data/IconMarker.svg'
import IconMarkerMap from '../../../shared/assets/icons/data/IconMarkerMap.svg'
import IconOffice from '../../../shared/assets/icons/data/IconOffice.svg'
import IconPark from '../../../shared/assets/icons/data/IconPark.svg'
import IconSkyscraper from '../../../shared/assets/icons/data/IconSkyscraper.svg'

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

export type DataIconType = keyof typeof ICONS

export interface DataIconProps {
  type: DataIconType
}

const DataIcon: FunctionComponent<DataIconProps> = ({ type }) => ICONS[type]

export default DataIcon
