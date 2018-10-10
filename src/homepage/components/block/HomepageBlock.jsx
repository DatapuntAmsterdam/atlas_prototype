import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';

import './_homepage-block.scss';

const HomepageBlock = (props) => (
  <div className="homepage-block c-homepage__block c-homepage__block--tall">

    {props.children}

    <Link // eslint-disable-line jsx-a11y/anchor-is-valid
      className={`c-homepage__block-button ${props.hasTallDescription ? 'c-homepage__block-button--tall' : ''}`}
      title={`Bekijk ${props.title}`}
      to={props.linkAction}
    >
      <div className="o-btn--transparent">{props.title}</div>
      <div className="c-homepage__block-details">{props.description}</div>
    </Link>
  </div>
);

HomepageBlock.propTypes = {
  linkAction: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.object,
    PropTypes.node
  ]),
  description: PropTypes.string,
  hasTallDescription: PropTypes.bool,
  title: PropTypes.string
};

HomepageBlock.defaultProps = {
  children: '',
  description: '',
  hasTallDescription: false,
  title: ''
};

export default HomepageBlock;
