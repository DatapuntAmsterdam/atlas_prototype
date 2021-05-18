import type { FunctionComponent } from 'react'
import type { TileGridProps } from './TileGridStyle'
import TileGridStyle from './TileGridStyle'

const TileGrid: FunctionComponent<TileGridProps & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...otherProps
}) => <TileGridStyle {...otherProps}>{children}</TileGridStyle>

export default TileGrid
