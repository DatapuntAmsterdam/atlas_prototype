import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import Enzyme from 'enzyme'
import 'isomorphic-fetch'
import 'jest-canvas-mock'
import 'jest-localstorage-mock'
import 'leaflet'
import 'leaflet-draw'

// React 17 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() })
