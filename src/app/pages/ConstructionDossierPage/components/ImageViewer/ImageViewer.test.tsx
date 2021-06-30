import { useMatomo } from '@datapunt/matomo-tracker-react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { readFileSync } from 'fs'
import { useEffect } from 'react'
import { mocked } from 'ts-jest/utils'
import path from 'path'
import type { Viewer, ViewerEvent } from 'openseadragon'
import { rest, server } from '../../../../../../test/server'
import environment from '../../../../../environment'
import { getAccessToken } from '../../../../../shared/services/auth/auth'
import joinUrl from '../../../../utils/joinUrl'
import useDownload from '../../../../utils/useDownload'
import withAppContext from '../../../../utils/withAppContext'
import { AuthTokenProvider } from '../../AuthTokenContext'
import OSDViewer from '../OSDViewer'
import type { DossierFile } from './ImageViewer'
import ImageViewer from './ImageViewer'

jest.mock('@datapunt/matomo-tracker-react')
jest.mock('../../../../../shared/services/auth/auth')
jest.mock('../../../../utils/useDownload')
jest.mock('../OSDViewer')

const mockedUseMatomo = mocked(useMatomo)
const mockedGetAccessToken = mocked(getAccessToken)
const mockedUseDownload = mocked(useDownload)
const mockedOSDViewer = mocked(OSDViewer)

// Create a selection of fake files
const MOCK_FILE_NAMES: string[] = []
const MOCK_FILE_URLS: string[] = []
const MOCK_INFO_FILE_URLS: string[] = []
const MOCK_FILES: DossierFile[] = []

for (let i = 0; i < 3; i += 1) {
  const filename = `files${i}.png`
  const url = joinUrl([environment.IIIF_ROOT, filename])

  MOCK_FILE_NAMES.push(filename)
  MOCK_FILE_URLS.push(url)
  MOCK_INFO_FILE_URLS.push(joinUrl([url, 'info.json']))
  MOCK_FILES.push({ filename, url })
}

describe('ImageViewer', () => {
  const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif']

  beforeEach(() => {
    mockedGetAccessToken.mockReturnValue('FAKETOKEN')
    mockedUseMatomo.mockReturnValue({ trackEvent: () => {} } as any)
    mockedUseDownload.mockReturnValue([false, () => {}])
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, onPageChange, ...otherProps }) => (
        <div {...otherProps} />
      ),
    )

    server.use(
      rest.get(MOCK_INFO_FILE_URLS[0], (request, response, context) => {
        const fakeFile = readFileSync(path.resolve(__dirname, `./fakeinfofile.json`))

        return response(context.json(JSON.parse(fakeFile.toString())))
      }),
      rest.get(MOCK_INFO_FILE_URLS[1], (request, response, context) => {
        const fakeFile = readFileSync(path.resolve(__dirname, './fakeinfofile.json'))

        return response(context.json(JSON.parse(fakeFile.toString())))
      }),
      rest.get(MOCK_INFO_FILE_URLS[2], (request, response, context) => {
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
            files={[MOCK_FILES[0]]}
            selectedFileName={MOCK_FILE_NAMES[0]}
            title="Some file"
            onClose={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    await waitFor(() => expect(screen.getByTestId('imageViewer')).toBeInTheDocument())
  })

  it('renders an error message if the image cannot be opened', async () => {
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, onPageChange, ...otherProps }) => {
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
            files={[MOCK_FILES[0]]}
            selectedFileName={MOCK_FILE_NAMES[0]}
            title="Some file"
            onClose={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    await waitFor(() => expect(screen.getByTestId('errorMessage')).toBeInTheDocument())
  })

  it('renders the correct error message if the file is an image', async () => {
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, onPageChange, ...otherProps }) => {
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
            files={[MOCK_FILES[0]]}
            selectedFileName={MOCK_FILE_NAMES[0]}
            title="Some file"
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
      ({ options, onInit, onOpen, onOpenFailed, onPageChange, ...otherProps }) => {
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
            files={[
              {
                filename: 'filename.foobar',
                url: MOCK_FILE_URLS[0],
              },
            ]}
            selectedFileName="filename.foobar"
            title="Some file"
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
      ({ options, onInit, onOpen, onOpenFailed, onPageChange, ...otherProps }) => {
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
              files={[
                {
                  filename: `filename.${extension}`,
                  url: MOCK_FILE_URLS[0],
                },
              ]}
              selectedFileName={`filename.${extension}`}
              title="Some file"
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
      ({ options, onInit, onOpen, onOpenFailed, onPageChange, ...otherProps }) => {
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
            files={[
              {
                filename: 'filename.foobar',
                url: '/somefile/url/filename.foobar',
              },
            ]}
            selectedFileName="filename.foobar"
            title="Some file"
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
      ({ options, onInit, onOpen, onOpenFailed, onPageChange, ...otherProps }) => {
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
            files={[MOCK_FILES[0]]}
            selectedFileName={MOCK_FILE_NAMES[0]}
            title="Some file"
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
      ({ options, onInit, onOpen, onOpenFailed, onPageChange, ...otherProps }) => {
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
            files={[MOCK_FILES[0]]}
            selectedFileName={MOCK_FILE_NAMES[0]}
            title="Some file"
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
      ({ options, onInit, onOpen, onOpenFailed, onPageChange, ...otherProps }) => {
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
            files={[MOCK_FILES[0]]}
            selectedFileName={MOCK_FILE_NAMES[0]}
            title="Some file"
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
      ({ options, onInit, onOpen, onOpenFailed, onPageChange, ...otherProps }) => {
        useEffect(() => {
          onInit?.({ viewport: { zoomBy } } as unknown as Viewer)
          onOpen?.({} as ViewerEvent)
        }, [])

        return <div {...otherProps} />
      },
    )

    render(
      withAppContext(
        <AuthTokenProvider>
          <ImageViewer
            files={[MOCK_FILES[0]]}
            selectedFileName={MOCK_FILE_NAMES[0]}
            title="Some file"
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
      ({ options, onInit, onOpen, onOpenFailed, onPageChange, ...otherProps }) => {
        useEffect(() => {
          onInit?.({ viewport: { zoomBy } } as unknown as Viewer)
          onOpen?.({} as ViewerEvent)
        }, [])

        return <div {...otherProps} />
      },
    )

    render(
      withAppContext(
        <AuthTokenProvider>
          <ImageViewer
            files={[
              {
                filename: MOCK_FILE_NAMES[0],
                url: MOCK_FILE_URLS[0],
              },
            ]}
            selectedFileName={MOCK_FILE_NAMES[0]}
            title="Some file"
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

  it('displays the previous and next button if there are multiple images', async () => {
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, onPageChange, ...otherProps }) => {
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
            files={MOCK_FILES}
            selectedFileName={MOCK_FILE_NAMES[0]}
            title="Some file"
            onClose={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    await waitFor(() => expect(screen.getByTestId('navigationControls')).toBeInTheDocument())
  })

  it('disables the prev button if user selects the start of the collection', async () => {
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, onPageChange, ...otherProps }) => {
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
            files={MOCK_FILES}
            selectedFileName={MOCK_FILE_NAMES[0]}
            title="Some file"
            onClose={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    await waitFor(() => {
      expect(screen.getByTestId('navigationControls').children[0]).toBeDisabled()
      expect(screen.getByTestId('navigationControls').children[1]).toBeEnabled()
    })
  })

  it('disables the next button if user selects the end of the collection', async () => {
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, onPageChange, ...otherProps }) => {
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
            files={MOCK_FILES}
            selectedFileName={MOCK_FILE_NAMES[2]}
            title="Some file"
            onClose={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    await waitFor(() => {
      const prevBtn = screen.getByTestId('navigationControls').children[0]
      const nextBtn = screen.getByTestId('navigationControls').children[1]

      expect(nextBtn).toBeDisabled()
      expect(prevBtn).toBeEnabled()
    })
  })

  it('displays the correct filename in the context menu', async () => {
    mockedOSDViewer.mockImplementation(
      ({ options, onInit, onOpen, onOpenFailed, onPageChange, ...otherProps }) => {
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
            files={MOCK_FILES}
            selectedFileName={MOCK_FILE_NAMES[0]}
            title="Some file"
            onClose={() => {}}
          />
        </AuthTokenProvider>,
      ),
    )

    await waitFor(() => {
      expect(screen.getByTestId('controlsMeta')).toHaveTextContent(MOCK_FILE_NAMES[0])
    })
  })
})
