import { shallow } from 'enzyme/build'
import configureMockStore from 'redux-mock-store'
import { sharePage, showEmbedPreview, showPrintMode } from '../../../../shared/ducks/ui/ui'
import getShareUrl from '../../../../shared/services/share-url/share-url'
import ContextMenu from './Map'

jest.mock('../../../../shared/ducks/ui/ui')
jest.mock('../../../../shared/services/share-url/share-url')

describe('ContextMenu for Maps', () => {
  const initialState = {
    map: {
      mapPanelActive: true,
    },
    ui: {
      viewMode: 'print',
    },
  }
  const props = {
    isMapPanelVisible: true,
    hasPrintButton: false,
    hasEmbedButton: false,
  }

  const store = configureMockStore()({ ...initialState })
  const component = shallow(<ContextMenu {...props} store={store} />)
    .dive()
    .dive()

  sharePage.mockImplementation(() => ({ type: 'action' }))
  showPrintMode.mockImplementation(() => ({ type: 'action' }))
  showEmbedPreview.mockImplementation(() => ({ type: 'action' }))
  getShareUrl.mockImplementation(() => ({ url: '/foo/bar' }))

  beforeEach(() => {
    global.window.title = 'Page title'
    global.window.open = jest.fn()
  })

  describe('should render all the items of the menu', () => {
    expect(component.find('ContextMenuItem').length).toBe(4)

    it("should only render the print button on certain scenario's", () => {
      component.setProps({ hasPrintButton: true })

      component.find('ContextMenuItem').at(0).simulate('click')
      expect(showPrintMode).toHaveBeenCalled()
    })

    it("should only render the embed button on certain scenario's", () => {
      component.setProps({ hasPrintButton: false, hasEmbedButton: true })

      component.find('ContextMenuItem').at(0).simulate('click')
      expect(showEmbedPreview).toHaveBeenCalled()
    })
  })

  it('should handle onClick event on pano buttons', () => {
    component.find('ContextMenuItem').at(1).simulate('click')
    expect(sharePage).toHaveBeenCalledWith('facebook')
  })

  it('should handle onClick event on pano buttons', () => {
    component.find('ContextMenuItem').at(2).simulate('click')
    expect(sharePage).toHaveBeenCalledWith('twitter')
  })

  it('should handle onClick event on pano buttons', () => {
    component.find('ContextMenuItem').at(3).simulate('click')
    expect(sharePage).toHaveBeenCalledWith('linkedin')
  })

  it('should handle onClick event on pano buttons', () => {
    component.find('ContextMenuItem').at(4).simulate('click')
    expect(sharePage).toHaveBeenCalledWith('email')
  })
})
