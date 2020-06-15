import { useStore } from 'react-redux'
import { Store } from 'redux'
import { RootState } from '../../../reducers/root'

declare global {
  interface Window {
    reduxStore: Store<RootState>
  }
}

// TODO: Remove this horrible hack of a method.
const getState = () => {
  if (typeof window !== 'undefined') {
    // Unfortunately some components / services cannot use the useStore hook
    return window.reduxStore.getState()
  }
  const store = useStore<RootState>()
  return store.getState()
}

export default getState
