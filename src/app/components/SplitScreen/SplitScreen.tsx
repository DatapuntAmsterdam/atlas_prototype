import { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components'

export interface SplitScreenProps {
  leftComponent: ReactNode
  rightComponent: ReactNode
  printMode: boolean
}

const Right = styled.div`
  width: 100%;
`

const SplitScreen: FunctionComponent<SplitScreenProps> = ({
  leftComponent,
  rightComponent,
  printMode,
}) => (
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
      <Right>{rightComponent}</Right>
    </div>
  </div>
)

export default SplitScreen
