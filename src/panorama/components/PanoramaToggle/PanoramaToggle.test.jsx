import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { setPanoramaTags, fetchPanoramaRequestExternal } from '../../ducks/actions'
import { PANO_LABELS } from '../../ducks/constants'
import { getStreetViewUrl } from '../../services/panorama-api/panorama-api'
import PanoramaToggle from './PanoramaToggle'

jest.mock('../../ducks/actions')
jest.mock('../../services/panorama-api/panorama-api')

describe('PanoramaToggle', () => {
  const props = {
    heading: 10,
    location: [2, 3],
    currentLabel: '2018',
  }
  const store = configureMockStore()({})
  const component = shallow(<PanoramaToggle {...props} store={store} />).dive()

  setPanoramaTags.mockImplementation(() => ({ type: 'action' }))
  fetchPanoramaRequestExternal.mockImplementation(() => ({ type: 'action' }))

  beforeEach(() => {
    global.window.open = jest.fn()
  })

  it('should render all the items of the menu', () => {
    expect(component.find('ContextMenuItem').length).toBe(PANO_LABELS.length + 1)
  })

  it('should handle onClick event on pano buttons', () => {
    component.find('ContextMenuItem').at(1).simulate('click')
    expect(setPanoramaTags).toHaveBeenCalledWith(PANO_LABELS[1].tags)
  })

  it('should handle onClick event on external pano button', () => {
    component.find('ContextMenuItem').at(PANO_LABELS.length).simulate('click')
    expect(getStreetViewUrl).toHaveBeenCalledWith(props.location, props.heading)
    expect(fetchPanoramaRequestExternal).toHaveBeenCalled()
  })
})
