import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';

import './_homepage-block.scss';

const HomepageBlock = ({
  classes,
  children,
  hasTallDescription,
  title,
  linkAction,
  description,
  blockIsLink
}) => {
  const className = `c-homepage__block-link c-homepage__block c-homepage__block--tall ${classes}`;
  const linkProps = { title: `Bekijk ${title}`, to: linkAction };

  const Block = blockIsLink ? Link : 'div';
  const blockProps = blockIsLink ? linkProps : {};

  const BlockButton = blockIsLink ? 'div' : Link;
  const blockButtonProps = blockIsLink ? {} : linkProps;
  return (
    <Block
      {...blockProps}
      className={className}
      onKeyDown={(event) => event.key === 'Enter' && linkAction}
      tabIndex="0"  // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
    >
      {children}
      <BlockButton
        {...blockButtonProps}
        className={`c-homepage__block-button ${hasTallDescription ? 'c-homepage__block-button--tall' : ''} qa-button-datasets`}
        tabIndex="-1"
      >
        <div className="o-btn--transparent">{title}</div>
        <div className="c-homepage__block-details">{description}</div>
      </BlockButton>
    </Block>
  );
};

HomepageBlock.propTypes = {
  linkAction: PropTypes.shape({}).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.object,
    PropTypes.node
  ]),
  description: PropTypes.string,
  hasTallDescription: PropTypes.bool,
  title: PropTypes.string,
  classes: PropTypes.string,
  blockIsLink: PropTypes.bool
};

HomepageBlock.defaultProps = {
  children: '',
  description: '',
  hasTallDescription: false,
  title: '',
  classes: '',
  blockIsLink: false
};

export default HomepageBlock;
