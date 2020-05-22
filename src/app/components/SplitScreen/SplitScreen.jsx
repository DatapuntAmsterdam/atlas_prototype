import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%; // Fix for IE11
`

/* istanbul ignore next */ const SplitScreen = ({ leftComponent, rightComponent, printMode }) => (
  <div className="c-dashboard__column-holder">
    <div
      className={`
        c-dashboard__column
        u-col-sm--${printMode ? '12' : '4'}
        qa-dashboard__column--middle

      `}
    >
      {leftComponent}
    </div>
    <div
      className={`
        c-dashboard__column
        c-dashboard__content
        u-overflow--y-auto
        u-col-sm--${printMode ? '12' : '8'}
        qa-dashboard__column--right
      `}
    >
      {/* Quickfix: extra div to make sure layout doesn't break due to legacy css mess */}
      <Wrapper>{rightComponent}</Wrapper>
    </div>
  </div>
)

SplitScreen.propTypes = {
  leftComponent: PropTypes.node.isRequired,
  rightComponent: PropTypes.node.isRequired,
  printMode: PropTypes.bool.isRequired,
}

export default SplitScreen
