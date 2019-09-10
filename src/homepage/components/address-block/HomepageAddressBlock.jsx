import React from 'react'
import RouterLink from 'redux-first-router-link'

import HomepageBlock from '../block/HomepageBlock'

import { features } from '../../../shared/environment'
import { routing } from '../../../app/routes'
import { toAdresses, toDatasetsTableWithFilter } from '../../../store/redux-first-router/actions'
import { DATASET_ROUTE_MAPPER, DATASETS } from '../../../shared/ducks/data-selection/constants'

const BLOCK_ITEMS = {
  ADRESSEN: {
    label: 'Adressentabel',
    id: DATASETS.BAG,
    route: routing.addresses.type,
    title: 'Bekijk Adressentabel',
  },
  HANDELSREGISTER: {
    label: 'Handelsregister-tabel',
    id: DATASETS.HR,
    route: routing.establishments.type,
    title: 'Bekijk handelsregister-tabel',
  },
  KADASTER: {
    label: 'Kadaster-tabel',
    id: DATASETS.BRK,
    route: routing.cadastralObjects.type,
    title: 'Bekijk kadaster-tabel',
  },
}

const HomepageAddressBlock = () => (
  <HomepageBlock
    linkAction={toAdresses()}
    title="Adressentabel"
    description="Selecteer en download als spreadsheet"
    hasTallDescription
    blockIsLink={false}
  >
    <div className="homepage-block">
      {Object.keys(BLOCK_ITEMS).map(key => {
        const extraClass =
          key === 'KADASTER' && !features.eigendommen ? 'homepage-block__item--invisible' : ''
        const { label, id, title } = BLOCK_ITEMS[key]
        return (
          <div key={key} className={`homepage-block__item ${extraClass}`}>
            <RouterLink
              className="c-link homepage-block__link"
              title={title}
              to={toDatasetsTableWithFilter(DATASET_ROUTE_MAPPER[id])}
            >
              <span className={`homepage-block__icon homepage-block__icon--${id}`} />
              <span className="homepage-block__label">{label}</span>
            </RouterLink>
          </div>
        )
      })}
    </div>
  </HomepageBlock>
)

export default HomepageAddressBlock
