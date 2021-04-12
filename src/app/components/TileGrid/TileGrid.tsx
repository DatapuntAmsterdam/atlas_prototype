import { FunctionComponent } from 'react'
import TileGridStyle, { TileGridProps } from './TileGridStyle'

const TileGrid: FunctionComponent<TileGridProps & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...otherProps
}) => <TileGridStyle {...otherProps}>{children}</TileGridStyle>

export default TileGrid
