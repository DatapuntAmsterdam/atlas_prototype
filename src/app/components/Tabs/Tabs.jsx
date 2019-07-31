import React from 'react'
import PropTypes from 'prop-types'

const Tabs = ({ children: childrenProp, currentPage }) => {
  let childIndex = 0
  const children = React.Children.map(childrenProp, child => {
    if (!React.isValidElement(child)) {
      return null
    }

    const childValue = child.props.page === undefined ? childIndex : child.props.page
    const selected = childValue === currentPage

    childIndex += 1
    return React.cloneElement(child, {
      isSelected: selected,
    })
  })
  return (
    <div>
      <div className="o-tabs qa-tabs u-margin__bottom--2">
        <ul>{children}</ul>
      </div>
    </div>
  )
}

Tabs.defaultProps = {
  children: null,
}

Tabs.propTypes = {
  children: PropTypes.node,
  currentPage: PropTypes.string.isRequired,
}

export default Tabs
