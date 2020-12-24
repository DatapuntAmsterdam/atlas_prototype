import AboutBlock from '../AboutBlock'

export default {
  title: 'Dataportaal/Homepage/AboutBlock',

  decorators: [
    (storyFn: () => React.ReactNode) => <div style={{ padding: '40px 10px' }}>{storyFn()}</div>,
  ],
}

export const DefaultState = () => <AboutBlock />
