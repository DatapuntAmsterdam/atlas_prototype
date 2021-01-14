import { FunctionComponent, ReactNode } from 'react'

export interface SplitScreenProps {
  leftComponent: ReactNode
  rightComponent: ReactNode
  printMode: boolean
}

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
      <div style={{ width: '100%' }}>{rightComponent}</div>
    </div>
  </div>
)

export default SplitScreen
