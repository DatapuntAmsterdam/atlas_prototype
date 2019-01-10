import React from 'react';
import Link from 'redux-first-router-link';

import HomepageBlock from '../block/HomepageBlock';

import { features } from '../../../shared/environment';
import { routing } from '../../../app/routes';
import { preserveQuery, toDatasetPage } from '../../../store/redux-first-router/actions';
import PARAMETERS from '../../../store/parameters';
import { DATASETS, VIEWS } from '../../../shared/ducks/data-selection/constants';


const BLOCK_ITEMS = {
  ADRESSEN: {
    label: 'Adressentabel',
    id: DATASETS.BAG,
    route: routing.addresses.type,
    title: 'Bekijk Adressentabel'
  },
  HANDELSREGISTER: {
    label: 'Handelsregister-tabel',
    id: DATASETS.HR,
    route: routing.establishments.type,
    title: 'Bekijk handelsregister-tabel'
  },
  KADASTER: {
    label: 'Kadaster-tabel',
    id: DATASETS.BRK,
    route: routing.cadastralObjects.type,
    title: 'Bekijk kadaster-tabel'
  }
};

const HomepageAddressBlock = () => (
  <HomepageBlock
    linkAction={{ type: routing.addresses.type }}
    title="Adressentabel"
    description="Selecteer en download als spreadsheet"
    hasTallDescription
    blockIsLink={false}
  >
    <div className="homepage-block">
      {Object.keys(BLOCK_ITEMS).map((key) => {
        const extraClass = (key === 'KADASTER' && !features.eigendommen) ? 'homepage-block__item--invisible' : '';
        const { label, id, title } = BLOCK_ITEMS[key];
        return (
          <div key={key} className={`homepage-block__item ${extraClass}`}>
            <Link
              className="c-link homepage-block__link"
              title={title}
              to={preserveQuery(toDatasetPage(id), {
                [PARAMETERS.VIEW]: VIEWS.TABLE
              })}
            >
              <span className={`homepage-block__icon homepage-block__icon--${id}`} />
              <span className="homepage-block__label">
                {label}
              </span>
            </Link>
          </div>
        );
      })}
    </div>
  </HomepageBlock>
);

export default HomepageAddressBlock;
