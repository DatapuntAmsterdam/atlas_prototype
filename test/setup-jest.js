/* eslint-disable no-console */
import Enzyme, { mount, render, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'leaflet'
import 'leaflet-draw'

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
