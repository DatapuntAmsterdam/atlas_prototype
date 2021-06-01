import { fireEvent, render, screen } from '@testing-library/react'
import * as reactRedux from 'react-redux'
import { mocked } from 'ts-jest/utils'
import socialItems from '../../../../components/ContextMenu/socialItems'
import withAppContext from '../../../../utils/withAppContext'
import ContextMenu from './ContextMenu'

jest.mock('../../../../components/ContextMenu/socialItems')

const socialItemsMock = mocked(socialItems)

describe('ContextMenu', () => {
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch')

  beforeEach(() => {
    socialItemsMock.mockReturnValue([])
  })

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
    render(
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
    expect(screen.getByTestId('root')).toBeInTheDocument()
  })

  it('opens the print mode if the print button is pressed', () => {
    const dispatchMock = jest.fn()

    useDispatchMock.mockReturnValue(dispatchMock)

    render(
      withAppContext(
        <ContextMenu
          handleDownload={() => {}}
          fileUrl="test.png"
          isImage
          downloadLoading={false}
        />,
      ),
    )

    fireEvent.click(screen.getByText('Printen'))
  })

  it('renders image download items if the file is an image', () => {
    const { rerender } = render(
      withAppContext(
        <ContextMenu
          handleDownload={() => {}}
          fileUrl="test.png"
          isImage={false}
          downloadLoading={false}
        />,
      ),
    )

    expect(screen.queryByText('Download klein')).not.toBeInTheDocument()
    expect(screen.queryByText('Download groot')).not.toBeInTheDocument()

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

    expect(screen.queryByText('Download klein')).toBeInTheDocument()
    expect(screen.queryByText('Download groot')).toBeInTheDocument()
  })

  it('disables the download items if the download is loading', () => {
    render(
      withAppContext(
        <ContextMenu handleDownload={() => {}} fileUrl="test.png" isImage downloadLoading />,
      ),
    )

    expect(screen.getByText('Download klein')).toBeDisabled()
    expect(screen.getByText('Download groot')).toBeDisabled()
    expect(screen.getByText('Download origineel')).toBeDisabled()
  })

  it('triggers the downloads correctly if the file is an image', () => {
    const handleDownloadMock = jest.fn()
    render(
      withAppContext(
        <ContextMenu
          handleDownload={handleDownloadMock}
          fileUrl="test.png"
          isImage
          downloadLoading={false}
        />,
      ),
    )

    fireEvent.click(screen.getByText('Download klein'))
    fireEvent.click(screen.getByText('Download groot'))
    fireEvent.click(screen.getByText('Download origineel'))

    expect(handleDownloadMock).toHaveBeenCalledWith('test.png/full/800,/0/default.jpg', 'klein')
    expect(handleDownloadMock).toHaveBeenCalledWith('test.png/full/1600,/0/default.jpg', 'groot')
    expect(handleDownloadMock).toHaveBeenCalledWith('test.png/full/full/0/default.jpg', 'origineel')
  })

  it('triggers the download of the original if the file is an image', () => {
    const handleDownloadMock = jest.fn()
    render(
      withAppContext(
        <ContextMenu
          handleDownload={handleDownloadMock}
          fileUrl="test.png"
          isImage={false}
          downloadLoading={false}
        />,
      ),
    )

    fireEvent.click(screen.getByText('Download origineel'))

    expect(handleDownloadMock).toHaveBeenCalledWith('test.png?source_file=true', 'origineel')
  })
})
