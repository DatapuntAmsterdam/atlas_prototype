import Enzyme from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import 'leaflet'
import 'leaflet-draw'
import 'jest-localstorage-mock'
import 'isomorphic-fetch'

// React 17 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() })
