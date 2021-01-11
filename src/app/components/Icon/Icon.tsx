import { FunctionComponent } from 'react'

export interface IconProps {
  icon: string
}

const Icon: FunctionComponent<IconProps> = ({ icon }) => (
  <span
    className={`
      rc-icon
      rc-icon--${icon}
    `}
  />
)

export default Icon
