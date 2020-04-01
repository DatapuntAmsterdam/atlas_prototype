import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import ConstructionFiles from './ConstructionFiles'
import { sharePage } from '../../../../shared/ducks/ui/ui'

jest.mock('../../../../shared/ducks/ui/ui')

// Mock the access token
jest.mock('../../../../shared/services/redux/get-state', () =>
  jest.fn(() => ({ user: { accessToken: 'token' } })),
)

// Mock the useDownload hook
const mockOnDownload = jest.fn()
jest.mock('../../../utils/useDownload', () => jest.fn(() => [false, mockOnDownload]))

describe('ContextMenu for ConstructionFiles viewer', () => {
  let component
  const mockOpenPrintMode = jest.fn()

  beforeEach(() => {
    const props = {
      fileName: 'filename.jpg',
      openPrintMode: mockOpenPrintMode,
    }
    const initialState = {
      map: {
        mapPanelActive: true,
      },
      ui: {
        viewMode: 'print',
      },
    }
    sharePage.mockImplementation(() => ({ type: 'action' }))

    const store = configureMockStore()({ ...initialState })
    component = shallow(<ConstructionFiles {...props} store={store} />).dive()
  })

  it('should render', () => {
    expect(component).toMatchSnapshot()
  })

  it('should handle the onClick events', () => {
    const downloadButton = component.find('ContextMenuItem')

    downloadButton.at(1).simulate('click')
    expect(mockOnDownload).toHaveBeenCalledTimes(1)

    downloadButton.at(2).simulate('click')
    expect(mockOnDownload).toHaveBeenCalledTimes(2)

    downloadButton.at(3).simulate('click')
    expect(mockOnDownload).toHaveBeenCalledTimes(3)
  })
})
