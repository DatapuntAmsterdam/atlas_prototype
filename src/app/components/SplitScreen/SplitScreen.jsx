import React from 'react';
import PropTypes from 'prop-types';

/* istanbul ignore next */ // TODO: refactor, test
const SplitScreen = ({ leftComponent, rightComponent, printMode }) => (
  <div className="c-dashboard__column-holder">
    <div
      className={`
        c-dashboard__column
        u-col-sm--${(printMode) ? '12' : '4'}
        qa-dashboard__column--middle
        u-page-break-after
      `}
    >
      {leftComponent}
    </div>
    <div
      className={`
        c-dashboard__column
        c-dashboard__content
        u-overflow--y-auto
        u-col-sm--${(printMode) ? '12' : '8'}
        qa-dashboard__column--right
      `}
    >
      {rightComponent}
    </div>
  </div>
);

SplitScreen.propTypes = {
  leftComponent: PropTypes.node.isRequired,
  rightComponent: PropTypes.node.isRequired,
  printMode: PropTypes.bool.isRequired
};

export default SplitScreen;
