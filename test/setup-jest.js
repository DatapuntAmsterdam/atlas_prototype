/* eslint-disable no-console */
import Enzyme, { mount, render, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'leaflet'
import 'leaflet-draw'

require('./load-env')

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() })

// Make Enzyme functions available in all test files without importing
global.shallow = shallow
global.render = render
global.mount = mount

// add leaflet
global.L = L

// Mock the window.fetch function
global.fetch = require('jest-fetch-mock')

// TODO DP-7140 Remove when we upgrade to React >= 16.9
const originalConsoleError = (message) => {
  // eslint-disable-line
  // throw new Error(message) // eslint-disable-line
}

console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return
  }
  originalConsoleError(...args)
}
