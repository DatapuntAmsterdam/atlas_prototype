import OrganizationBlock from '../OrganizationBlock'

export default {
  title: 'Dataportaal/Homepage/OrganizationBlock',

  decorators: [
    (storyFn: () => React.ReactNode) => <div style={{ padding: '40px 10px' }}>{storyFn()}</div>,
  ],
}

export const DefaultState = () => <OrganizationBlock />
