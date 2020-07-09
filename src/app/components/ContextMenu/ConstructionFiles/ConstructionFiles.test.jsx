import React from 'react'
import { shallow } from 'enzyme'
import ConstructionFiles from './ConstructionFiles'
import { sharePage } from '../../../../shared/ducks/ui/ui'

const mockHandleDownload = jest.fn()
const mockDispatch = jest.fn()

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}))
jest.mock('../../../../shared/ducks/ui/ui')

describe('ContextMenu for ConstructionFiles viewer', () => {
  let component
  const mockOpenPrintMode = jest.fn()

  beforeEach(() => {
    const props = {
      fileName: 'filename.jpg',
      openPrintMode: mockOpenPrintMode,
      isImage: true,
      handleDownload: mockHandleDownload,
    }
    sharePage.mockImplementation(() => ({ type: 'action' }))

    component = shallow(<ConstructionFiles {...props} />).dive()
  })

  it('should render', () => {
    expect(component).toMatchSnapshot()
  })

  it('should handle the onClick events', () => {
    mockHandleDownload.mockClear()

    const downloadButton = component.find('ContextMenuItem')

    downloadButton.at(1).simulate('click')
    expect(mockHandleDownload).toHaveBeenCalledTimes(1)

    downloadButton.at(2).simulate('click')
    expect(mockHandleDownload).toHaveBeenCalledTimes(2)

    downloadButton.at(3).simulate('click')
    expect(mockHandleDownload).toHaveBeenCalledTimes(3)
  })
})
