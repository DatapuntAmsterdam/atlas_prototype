import { useStore } from 'react-redux'
import type { Store } from 'redux'
import type { RootState } from '../../ducks/root'

declare global {
  interface Window {
    reduxStore: Store<RootState>
  }
}

// TODO: Remove this horrible hack of a method.
const getState = () => {
  if (typeof window !== 'undefined') {
    // Unfortunately some components / services cannot use the useStore hook
    return window.reduxStore?.getState()
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const store = useStore<RootState>()
  return store.getState()
}

export default getState