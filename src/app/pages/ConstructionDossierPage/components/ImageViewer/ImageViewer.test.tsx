import { useMatomo } from '@datapunt/matomo-tracker-react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { readFileSync } from 'fs'
import { Viewer, ViewerEvent } from 'openseadragon'
import { useEffect } from 'react'
import { mocked } from 'ts-jest/utils'
import path from 'path'
import { rest, server } from '../../../../../../test/server'
import environment from '../../../../../environment'
import { getAccessToken } from '../../../../../shared/services/auth/auth'
import joinUrl from '../../../../utils/joinUrl'
import useDownload from '../../../../utils/useDownload'
import withAppContext from '../../../../utils/withAppContext'
import { AuthTokenProvider } from '../../AuthTokenContext'
import OSDViewer from '../OSDViewer'
import ImageViewer from './ImageViewer'

jest.mock('@datapunt/matomo-tracker-react')
jest.mock('../../../../../shared/services/auth/auth')
jest.mock('../../../../utils/useDownload')
jest.mock('../OSDViewer')

const mockedUseMatomo = mocked(useMatomo)
const mockedGetAccessToken = mocked(getAccessToken)
const mockedUseDownload = mocked(useDownload)
const mockedOSDViewer = mocked(OSDViewer)

const FILE_NAME = 'file.png'
const FILE_URL = joinUrl([environment.IIIF_ROOT, FILE_NAME])
const INFO_FILE_URL = joinUrl([FILE_URL, 'info.json'])

describe('ImageViewer', () => {
  const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif']

  beforeEach(() => {
    mockedGetAccessToken.mockReturnValue('FAKETOKEN')
    mockedUseMatomo.mockReturnValue({ trackEvent: () => {} } as any)
    mockedUseDownload.mockReturnValue([false, () => {}])
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, ...otherProps }) => <div {...otherProps} />,
    )

    server.use(
      rest.get(INFO_FILE_URL, (request, response, context) => {
        const fakeFile = readFileSync(path.resolve(__dirname, './fakeinfofile.json'))

        return response(context.json(JSON.parse(fakeFile.toString())))
      }),
    )
  })

  afterEach(() => {
    mockedGetAccessToken.mockReset()
    mockedUseMatomo.mockReset()
    mockedUseDownload.mockReset()
    mockedOSDViewer.mockReset()
  })

  it('renders the viewer', async () => {
    render(
      withAppContext(
        <AuthTokenProvider>
          <ImageViewer
            fileName={FILE_NAME}
            title="Some file"
            fileUrl={FILE_URL}
            onClose={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    await waitFor(() => expect(screen.getByTestId('imageViewer')).toBeInTheDocument())
  })

  it('renders an error message if the image cannot be opened', async () => {
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, ...otherProps }) => {
        useEffect(() => {
          onOpenFailed?.({} as ViewerEvent)
        }, [])

        return <div {...otherProps} />
      },
    )

    render(
      withAppContext(
        <AuthTokenProvider>
          <ImageViewer
            fileName={FILE_NAME}
            title="Some file"
            fileUrl={FILE_URL}
            onClose={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    await waitFor(() => expect(screen.getByTestId('errorMessage')).toBeInTheDocument())
  })

  it('renders the correct error message if the file is an image', async () => {
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, ...otherProps }) => {
        useEffect(() => {
          onOpenFailed?.({} as ViewerEvent)
        }, [])

        return <div {...otherProps} />
      },
    )

    render(
      withAppContext(
        <AuthTokenProvider>
          <ImageViewer
            fileName="filename.png"
            title="Some file"
            fileUrl={FILE_URL}
            onClose={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    await waitFor(() =>
      expect(
        screen.getByText('Er is een fout opgetreden bij het laden van dit bestand.'),
      ).toBeInTheDocument(),
    )
  })

  it('renders the correct error message if the file is not an image', async () => {
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, ...otherProps }) => {
        useEffect(() => {
          onOpenFailed?.({} as ViewerEvent)
        }, [])

        return <div {...otherProps} />
      },
    )

    render(
      withAppContext(
        <AuthTokenProvider>
          <ImageViewer
            fileName="filename.foobar"
            title="Some file"
            fileUrl={FILE_URL}
            onClose={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    await waitFor(() =>
      expect(
        screen.getByText('Dit bestandsformaat kan niet worden weergegeven op deze pagina.'),
      ).toBeInTheDocument(),
    )
  })

  it('reloads the page if the error button is clicked when viewing an image', async () => {
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, ...otherProps }) => {
        useEffect(() => {
          onOpenFailed?.({} as ViewerEvent)
        }, [])

        return <div {...otherProps} />
      },
    )

    // eslint-disable-next-line no-restricted-syntax
    for (const extension of IMAGE_EXTENSIONS) {
      const { unmount } = render(
        withAppContext(
          <AuthTokenProvider>
            <ImageViewer
              fileName={`filename.${extension}`}
              title="Some file"
              fileUrl={FILE_URL}
              onClose={() => {}}
            />
          </AuthTokenProvider>,
        ),
      )

      const originalLocation = window.location
      const reloadMock = jest.fn()

      Object.defineProperty(window, 'location', {
        writable: true,
        value: { reload: reloadMock },
      })

      // eslint-disable-next-line no-await-in-loop
      await waitFor(() => fireEvent.click(screen.getByText('Probeer opnieuw')))
      expect(reloadMock).toHaveBeenCalled()

      window.location = originalLocation
      unmount()
    }
  })

  it('downloads the source file if the error button is clicked when viewing a file that is not an image', async () => {
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

    render(
      withAppContext(
        <AuthTokenProvider>
          <ImageViewer
            fileName="filename.foobar"
            title="Some file"
            fileUrl="/somefile/url/filename.foobar"
            onClose={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    await waitFor(() => fireEvent.click(screen.getByText('Download bronbestand')))

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

  it('renders the viewer controls without zoom and context menu if the image cannot be opened', async () => {
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, ...otherProps }) => {
        useEffect(() => {
          onOpenFailed?.({} as ViewerEvent)
        }, [])

        return <div {...otherProps} />
      },
    )

    render(
      withAppContext(
        <AuthTokenProvider>
          <ImageViewer
            fileName="filename.png"
            title="Some file"
            fileUrl={FILE_URL}
            onClose={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    await waitFor(() => {
      expect(screen.getByTestId('viewerControls')).toBeInTheDocument()
      expect(screen.queryByTestId('zoomControls')).not.toBeInTheDocument()
      expect(screen.queryByTestId('contextMenu')).not.toBeInTheDocument()
    })
  })

  it('renders the viewer controls when the image is opened', async () => {
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, ...otherProps }) => {
        useEffect(() => {
          onOpen?.({} as ViewerEvent)
        }, [])

        return <div {...otherProps} />
      },
    )

    render(
      withAppContext(
        <AuthTokenProvider>
          <ImageViewer
            fileName="filename.png"
            title="Some file"
            fileUrl={FILE_URL}
            onClose={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    await waitFor(() => {
      expect(screen.getByTestId('viewerControls')).toBeInTheDocument()
      expect(screen.getByTestId('zoomControls')).toBeInTheDocument()
      expect(screen.getByTestId('contextMenu')).toBeInTheDocument()
    })
  })

  it('calls the onClose prop when the viewer is closed', async () => {
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, ...otherProps }) => {
        useEffect(() => {
          onOpen?.({} as ViewerEvent)
        }, [])

        return <div {...otherProps} />
      },
    )

    const onClose = jest.fn()

    render(
      withAppContext(
        <AuthTokenProvider>
          <ImageViewer
            fileName="filename.png"
            title="Some file"
            fileUrl={FILE_URL}
            onClose={onClose}
          />
        </AuthTokenProvider>,
      ),
    )

    await waitFor(() => {
      fireEvent.click(screen.getByTitle('Bestand sluiten'))
      expect(onClose).toHaveBeenCalled()
    })
  })

  it('zooms in if the zoom button is pressed', async () => {
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

    render(
      withAppContext(
        <AuthTokenProvider>
          <ImageViewer
            fileName="filename.png"
            title="Some file"
            fileUrl={FILE_URL}
            onClose={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    await waitFor(() => {
      fireEvent.click(screen.getByTitle('Inzoomen'))
      expect(zoomBy).toHaveBeenCalledWith(1.5)
    })
  })

  it('zooms out if the zoom button is pressed', async () => {
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

    render(
      withAppContext(
        <AuthTokenProvider>
          <ImageViewer
            fileName="filename.png"
            title="Some file"
            fileUrl={FILE_URL}
            onClose={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    await waitFor(() => {
      fireEvent.click(screen.getByTitle('Uitzoomen'))
      expect(zoomBy).toHaveBeenCalledWith(0.5)
    })
  })
})
