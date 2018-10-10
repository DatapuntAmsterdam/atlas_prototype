import React from 'react';
import Link from 'redux-first-router-link';

import HomepageBlock from '../block/HomepageBlock';

import IconAddress from '../../../../public/images/icon-adres.svg';
import IconHr from '../../../../public/images/icon-hr.svg';
import IconKadaster from '../../../../public/images/icon-kadaster.svg';
import { features } from '../../../shared/environment';
import { routing } from '../../../app/routes';

const HomepageAddressBlock = () => {
  const brkClassName = `homepage-block__item ${features.eigendommen ? '' : 'homepage-block__item--invisible'}`;

  return (
    <HomepageBlock
      linkAction={{ type: routing.adressen.type }}
      title={'Adressentabel'}
      description={'Selecteer en download als spreadsheet'}
      hasTallDescription
    >
      <div className={'homepage-block__item'}>
        <Link // eslint-disable-line jsx-a11y/anchor-is-valid
          className={'c-link homepage-block__link'}
          title={'Bekijk Adressentabel'}
          to={{ type: routing.adressen.type }}
        >
          <span className="homepage-block__icon">
            <IconAddress />
          </span>
          <span className="homepage-block__label">
            Adressentabel
          </span>
        </Link>
      </div>

      <div className={'homepage-block__item'}>
        <Link // eslint-disable-line jsx-a11y/anchor-is-valid
          className={'c-link homepage-block__link'}
          title={'Bekijk handelsregister-tabel'}
          to={{ type: routing.vestigingen.type }}
        >
          <span className="homepage-block__icon">
            <IconHr />
          </span>
          <span className="homepage-block__label">
            Handelsregister-tabel
          </span>
        </Link>
      </div>

      <div className={brkClassName}>
        <Link // eslint-disable-line jsx-a11y/anchor-is-valid
          className={'c-link homepage-block__link'}
          title={'Bekijk kadaster-tabel'}
          to={{ type: routing.vestigingen.type }}
        >
          <span className="homepage-block__icon">
            <IconKadaster />
          </span>
          <span className="homepage-block__label">
            Kadaster-tabel
          </span>
        </Link>
      </div>

    </HomepageBlock>
  );
};

export default HomepageAddressBlock;
