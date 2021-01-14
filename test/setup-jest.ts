import Enzyme from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import 'leaflet'
import 'leaflet-draw'
import 'raf/polyfill'
import 'jest-localstorage-mock'
import 'isomorphic-fetch'

// React 17 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() })

declare global {
  namespace JSDOM {
    interface Global {
      unsetAuthentication: () => void
      setInvalidAuthentication: () => void
      setExpiredAuthentication: () => void
      setValidAuthentication: () => void
      setAuthenticationWithToken: (token: string) => void
    }
  }
}
