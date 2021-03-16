import { fireEvent, render } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import * as reactRedux from 'react-redux'
import ContextMenu from './ContextMenu'
import withAppContext from '../../../../utils/withAppContext'
import { showPrintMode } from '../../../../../shared/ducks/ui/ui'

describe('ContextMenu', () => {
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch')

  afterEach(() => {
    useDispatchMock.mockClear()
  })

  it('renders the menu', () => {
    const { container } = render(
      withAppContext(
        <ContextMenu
          handleDownload={() => {}}
          fileUrl="test.png"
          isImage
          downloadLoading={false}
        />,
      ),
    )
    expect(container.firstChild).toBeDefined()
  })

  it('passes along other props to the root', () => {
    const { getByTestId } = render(
      withAppContext(
        <ContextMenu
          handleDownload={() => {}}
          fileUrl="test.png"
          isImage
          downloadLoading={false}
          data-testid="root"
        />,
      ),
    )
    expect(getByTestId('root')).toBeDefined()
  })

  it('opens the print mode if the print button is pressed', () => {
    const dispatchMock = jest.fn()

    useDispatchMock.mockReturnValue(dispatchMock)

    const { getByText } = render(
      withAppContext(
        <ContextMenu
          handleDownload={() => {}}
          fileUrl="test.png"
          isImage
          downloadLoading={false}
        />,
      ),
    )

    fireEvent.click(getByText('Printen'))

    expect(dispatchMock).toHaveBeenCalledWith(showPrintMode())
  })

  it('renders image download items if the file is an image', () => {
    const { queryByText, rerender } = render(
      withAppContext(
        <ContextMenu
          handleDownload={() => {}}
          fileUrl="test.png"
          isImage={false}
          downloadLoading={false}
        />,
      ),
    )

    expect(queryByText('Download klein')).toBeNull()
    expect(queryByText('Download groot')).toBeNull()

    rerender(
      withAppContext(
        <ContextMenu
          handleDownload={() => {}}
          fileUrl="test.png"
          isImage
          downloadLoading={false}
        />,
      ),
    )

    expect(queryByText('Download klein')).toBeDefined()
    expect(queryByText('Download groot')).toBeDefined()
  })

  it('disables the download items if the download is loading', () => {
    const { getByText } = render(
      withAppContext(
        <ContextMenu handleDownload={() => {}} fileUrl="test.png" isImage downloadLoading />,
      ),
    )

    expect(getByText('Download klein')).toHaveAttribute('disabled')
    expect(getByText('Download groot')).toHaveAttribute('disabled')
    expect(getByText('Download origineel')).toHaveAttribute('disabled')
  })

  it('triggers the downloads correctly if the file is an image', () => {
    const handleDownloadMock = jest.fn()
    const { getByText } = render(
      withAppContext(
        <ContextMenu
          handleDownload={handleDownloadMock}
          fileUrl="test.png"
          isImage
          downloadLoading={false}
        />,
      ),
    )

    fireEvent.click(getByText('Download klein'))
    fireEvent.click(getByText('Download groot'))
    fireEvent.click(getByText('Download origineel'))

    expect(handleDownloadMock).toHaveBeenCalledWith('test.png/full/800,/0/default.jpg', 'klein')
    expect(handleDownloadMock).toHaveBeenCalledWith('test.png/full/1600,/0/default.jpg', 'groot')
    expect(handleDownloadMock).toHaveBeenCalledWith('test.png/full/full/0/default.jpg', 'origineel')
  })

  it('triggers the download of the original if the file is an image', () => {
    const handleDownloadMock = jest.fn()
    const { getByText } = render(
      withAppContext(
        <ContextMenu
          handleDownload={handleDownloadMock}
          fileUrl="test.png"
          isImage={false}
          downloadLoading={false}
        />,
      ),
    )

    fireEvent.click(getByText('Download origineel'))

    expect(handleDownloadMock).toHaveBeenCalledWith('test.png?source_file=true', 'origineel')
  })
})
