import { FunctionComponent } from 'react'
import IconButton from '../IconButton/IconButton'

export interface ToggleFullscreenProps {
  alignLeft?: boolean
  isFullscreen: boolean
  title: string
  onToggleFullscreen: () => void
}

const ToggleFullscreen: FunctionComponent<ToggleFullscreenProps> = ({
  isFullscreen,
  title,
  onToggleFullscreen,
  alignLeft,
}) => (
  <IconButton
    title={isFullscreen ? `${title} verkleinen` : `${title} vergroten`}
    icon={isFullscreen ? 'minimize' : 'maximize'}
    onClick={onToggleFullscreen}
    alignLeft={alignLeft}
    extraClass="qa-toggle-fullscreen"
  />
)

ToggleFullscreen.defaultProps = {
  alignLeft: false,
}

export default ToggleFullscreen
