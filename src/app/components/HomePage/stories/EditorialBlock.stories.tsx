import EditorialBlock from '../EditorialBlock'
import { cmsConfig } from '../../../../shared/config/config'

export default {
  title: 'Dataportaal/Homepage/EditorialBlock',

  decorators: [
    (storyFn: () => React.ReactNode) => <div style={{ padding: '40px 10px' }}>{storyFn()}</div>,
  ],
}

export const DefaultState = () => <EditorialBlock list={cmsConfig.HOME_SPECIALS} title="Specials" />
