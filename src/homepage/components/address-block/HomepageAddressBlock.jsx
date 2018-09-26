import React from 'react';
import PropTypes from 'prop-types';

import HomepageBlock from '../block/HomepageBlock';

import IconAddress from '../../../../public/images/icon-adres.svg';
import IconHr from '../../../../public/images/icon-hr.svg';
import IconKadaster from '../../../../public/images/icon-kadaster.svg';
import { features } from '../../../shared/environment';

const HomepageAddressBlock = (props) => {
  const { onLinkClick } = props;
  const brkClassName = `homepage-block__item ${features.eigendommen ? '' : 'homepage-block__item--invisible'}`;

  return (
    <HomepageBlock
      onBlockLinkClick={() => onLinkClick({ dataset: 'bag', filters: {}, page: 1 })}
      title={'Adressentabel'}
      description={'Selecteer en download als spreadsheet'}
      hasTallDescription
    >
      <div className={'homepage-block__item'}>
        <button
          className={'c-link homepage-block__link'}
          title={'Bekijk Adressentabel'}
          onClick={() => onLinkClick({ dataset: 'bag', filters: {}, page: 1 })}
        >
          <span className="homepage-block__icon">
            <IconAddress />
          </span>
          <span className="homepage-block__label">
            Adressentabel
          </span>
        </button>
      </div>

      <div className={'homepage-block__item'}>
        <button
          className={'c-link homepage-block__link'}
          title={'Bekijk handelsregister-tabel'}
          onClick={() => onLinkClick({ dataset: 'hr', filters: {}, page: 1 })}
        >
          <span className="homepage-block__icon">
            <IconHr />
          </span>
          <span className="homepage-block__label">
            Handelsregister-tabel
          </span>
        </button>
      </div>

      <div className={brkClassName}>
        <button
          className={'c-link homepage-block__link'}
          title={'Bekijk kadaster-tabel'}
          onClick={() => onLinkClick({ dataset: 'brk', filters: {}, page: 1 })}
        >
          <span className="homepage-block__icon">
            <IconKadaster />
          </span>
          <span className="homepage-block__label">
            Kadaster-tabel
          </span>
        </button>
      </div>

    </HomepageBlock>
  );
};

HomepageAddressBlock.propTypes = {
  onLinkClick: PropTypes.func.isRequired
};

export default HomepageAddressBlock;
