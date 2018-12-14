import React from 'react';
import PropTypes from 'prop-types';

const Tabs = ({ children: childrenProp, currentTab }) => {
  let childIndex = 0;
  const children = React.Children.map(childrenProp, (child) => {
    if (!React.isValidElement(child)) {
      return null;
    }

    const childValue = child.props.label === undefined ? childIndex : child.props.label;
    const selected = childValue === currentTab;

    childIndex += 1;
    return React.cloneElement(child, {
      isCurrentTab: selected
    });
  });
  return (
    <div>
      <div className="o-tabs qa-tabs u-margin__bottom--2">
        <ul>
          {children}
        </ul>
      </div>
    </div>
  );
};

Tabs.defaultProps = {
  children: null,
  currentTab: false
};

Tabs.propTypes = {
  children: PropTypes.node,
  currentTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
};

export default Tabs;
