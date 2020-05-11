import { useStore } from 'react-redux'

const getState = () => {
  if (typeof window !== 'undefined') {
    // Unfortunately some components / services cannot use the useStore hook
    return window.reduxStore.getState()
  }
  const store = useStore()
  return store.getState()
}

export default getState
