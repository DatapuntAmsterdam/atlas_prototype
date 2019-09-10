import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import ConstructionFiles from './ConstructionFiles'
import { sharePage } from '../../../../shared/ducks/ui/ui'

jest.mock('../../../../shared/ducks/ui/ui')

describe('ContextMenu for ConstructionFiles viewer', () => {
  let component
  const mockOnDownload = jest.fn()
  const mockOpenPrintMode = jest.fn()

  beforeEach(() => {
    const props = {
      fileName: 'filename.jpg',
      onDownload: mockOnDownload,
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
    expect(mockOnDownload).toHaveBeenCalledWith('klein')

    downloadButton.at(2).simulate('click')
    expect(mockOnDownload).toHaveBeenCalledWith('groot')

    downloadButton.at(3).simulate('click')
    expect(mockOnDownload).toHaveBeenCalledWith('origineel')
  })
})
