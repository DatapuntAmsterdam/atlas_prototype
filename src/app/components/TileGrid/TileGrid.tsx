import { FunctionComponent } from 'react'
import TileGridStyle, { Props } from './TileGridStyle'

const TileGrid: FunctionComponent<Props & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...otherProps
}) => <TileGridStyle {...otherProps}>{children}</TileGridStyle>

export default TileGrid
