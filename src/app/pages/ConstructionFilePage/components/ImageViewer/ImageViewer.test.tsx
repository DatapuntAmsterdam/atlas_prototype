import { useMatomo } from '@datapunt/matomo-tracker-react'
import { fireEvent, render } from '@testing-library/react'
import { Viewer, ViewerEvent } from 'openseadragon'
import { useEffect } from 'react'
import { mocked } from 'ts-jest/utils'
import { getAccessToken } from '../../../../../shared/services/auth/auth-legacy'
import useDownload from '../../../../utils/useDownload'
import withAppContext from '../../../../utils/withAppContext'
import OSDViewer from '../OSDViewer'
import ImageViewer from './ImageViewer'

jest.mock('@datapunt/matomo-tracker-react')
jest.mock('../../../../../shared/services/auth/auth-legacy')
jest.mock('../../../../utils/useDownload')
jest.mock('../OSDViewer')

const mockedUseMatomo = mocked(useMatomo)
const mockedGetAccessToken = mocked(getAccessToken)
const mockedUseDownload = mocked(useDownload)
const mockedOSDViewer = mocked(OSDViewer)

describe('ImageViewer', () => {
  const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif']

  beforeEach(() => {
    mockedGetAccessToken.mockReturnValue('FAKETOKEN')
    mockedUseMatomo.mockReturnValue({ trackEvent: () => {} } as any)
    mockedUseDownload.mockReturnValue([false, () => {}])
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, ...otherProps }) => <div {...otherProps} />,
    )
  })

  afterEach(() => {
    mockedGetAccessToken.mockReset()
    mockedUseMatomo.mockReset()
    mockedUseDownload.mockReset()
    mockedOSDViewer.mockReset()
  })

  it('renders the viewer', () => {
    const { getByTestId } = render(
      withAppContext(
        <ImageViewer
          fileName="filename"
          title="Some file"
          fileUrl="/somefile/url"
          onClose={() => {}}
        />,
      ),
    )

    expect(getByTestId('imageViewer')).toBeDefined()
  })

  it('renders an error message if the image cannot be opened', () => {
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, ...otherProps }) => {
        useEffect(() => {
          onOpenFailed?.({} as ViewerEvent)
        }, [])

        return <div {...otherProps} />
      },
    )

    const { getByTestId } = render(
      withAppContext(
        <ImageViewer
          fileName="filename"
          title="Some file"
          fileUrl="/somefile/url"
          onClose={() => {}}
        />,
      ),
    )

    expect(getByTestId('errorMessage')).toBeDefined()
  })

  it('renders the correct error message if the file is an image', () => {
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, ...otherProps }) => {
        useEffect(() => {
          onOpenFailed?.({} as ViewerEvent)
        }, [])

        return <div {...otherProps} />
      },
    )

    const { getByText } = render(
      withAppContext(
        <ImageViewer
          fileName="filename.png"
          title="Some file"
          fileUrl="/somefile/url"
          onClose={() => {}}
        />,
      ),
    )

    expect(getByText('Er is een fout opgetreden bij het laden van dit bestand.')).toBeDefined()
  })

  it('renders the correct error message if the file is not an image', () => {
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, ...otherProps }) => {
        useEffect(() => {
          onOpenFailed?.({} as ViewerEvent)
        }, [])

        return <div {...otherProps} />
      },
    )

    const { getByText } = render(
      withAppContext(
        <ImageViewer
          fileName="filename.foobar"
          title="Some file"
          fileUrl="/somefile/url"
          onClose={() => {}}
        />,
      ),
    )

    expect(
      getByText('Dit bestandsformaat kan niet worden weergegeven op deze pagina.'),
    ).toBeDefined()
  })

  it('reloads the page if the error button is clicked when viewing an image', () => {
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, ...otherProps }) => {
        useEffect(() => {
          onOpenFailed?.({} as ViewerEvent)
        }, [])

        return <div {...otherProps} />
      },
    )

    IMAGE_EXTENSIONS.forEach((extension) => {
      const { getByText, unmount } = render(
        withAppContext(
          <ImageViewer
            fileName={`filename.${extension}`}
            title="Some file"
            fileUrl="/somefile/url"
            onClose={() => {}}
          />,
        ),
      )

      const originalLocation = window.location
      const reloadMock = jest.fn()

      Object.defineProperty(window, 'location', {
        writable: true,
        value: { reload: reloadMock },
      })

      fireEvent.click(getByText('Probeer opnieuw'))
      expect(reloadMock).toHaveBeenCalled()

      window.location = originalLocation
      unmount()
    })
  })

  it('downloads the source file if the error button is clicked when viewing a file that is not an image', () => {
    const mockedTrackEvent = jest.fn()
    const mockedDownloadFile = jest.fn()

    mockedUseMatomo.mockReturnValue({ trackEvent: mockedTrackEvent } as any)
    mockedUseDownload.mockReturnValue([false, mockedDownloadFile])
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, ...otherProps }) => {
        useEffect(() => {
          onOpenFailed?.({} as ViewerEvent)
        }, [])

        return <div {...otherProps} />
      },
    )

    const { getByText } = render(
      withAppContext(
        <ImageViewer
          fileName="filename.foobar"
          title="Some file"
          fileUrl="/somefile/url/filename.foobar"
          onClose={() => {}}
        />,
      ),
    )

    fireEvent.click(getByText('Download bronbestand'))

    expect(mockedDownloadFile).toHaveBeenCalledWith(
      `/somefile/url/filename.foobar?source_file=true`,
      { method: 'get', headers: { Authorization: `Bearer FAKETOKEN` } },
      'filename.foobar',
    )

    expect(mockedTrackEvent).toHaveBeenCalledWith({
      action: 'bouwtekening-download-origineel',
      category: 'download-bouwtekening',
      name: 'filename.foobar',
    })
  })

  it('renders the viewer controls when loading finishes', () => {
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, ...otherProps }) => {
        useEffect(() => {
          onOpen?.({} as ViewerEvent)
        }, [])

        return <div {...otherProps} />
      },
    )

    const { getByTestId } = render(
      withAppContext(
        <ImageViewer
          fileName="filename.png"
          title="Some file"
          fileUrl="/somefile/url"
          onClose={() => {}}
        />,
      ),
    )

    expect(getByTestId('viewerControls')).toBeDefined()
  })

  it('calls the onClose prop when the viewer is closed', () => {
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, ...otherProps }) => {
        useEffect(() => {
          onOpen?.({} as ViewerEvent)
        }, [])

        return <div {...otherProps} />
      },
    )

    const onClose = jest.fn()
    const { getByTitle } = render(
      withAppContext(
        <ImageViewer
          fileName="filename.png"
          title="Some file"
          fileUrl="/somefile/url"
          onClose={onClose}
        />,
      ),
    )

    fireEvent.click(getByTitle('Bestand sluiten'))
    expect(onClose).toHaveBeenCalled()
  })

  it('zooms in if the zoom button is pressed', () => {
    const zoomBy = jest.fn()

    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, ...otherProps }) => {
        useEffect(() => {
          onInit?.(({ viewport: { zoomBy } } as unknown) as Viewer)
          onOpen?.({} as ViewerEvent)
        }, [])

        return <div {...otherProps} />
      },
    )

    const { getByTitle } = render(
      withAppContext(
        <ImageViewer
          fileName="filename.png"
          title="Some file"
          fileUrl="/somefile/url"
          onClose={() => {}}
        />,
      ),
    )

    fireEvent.click(getByTitle('Inzoomen'))
    expect(zoomBy).toHaveBeenCalledWith(1.5)
  })

  it('zooms out if the zoom button is pressed', () => {
    const zoomBy = jest.fn()

    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, ...otherProps }) => {
        useEffect(() => {
          onInit?.(({ viewport: { zoomBy } } as unknown) as Viewer)
          onOpen?.({} as ViewerEvent)
        }, [])

        return <div {...otherProps} />
      },
    )

    const { getByTitle } = render(
      withAppContext(
        <ImageViewer
          fileName="filename.png"
          title="Some file"
          fileUrl="/somefile/url"
          onClose={() => {}}
        />,
      ),
    )

    fireEvent.click(getByTitle('Uitzoomen'))
    expect(zoomBy).toHaveBeenCalledWith(0.5)
  })
})
