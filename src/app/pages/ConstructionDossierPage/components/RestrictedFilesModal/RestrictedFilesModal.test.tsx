import { Modal, ThemeProvider } from '@amsterdam/asc-ui'
import { fireEvent, render, screen } from '@testing-library/react'
import { useEffect } from 'react'
import { mocked } from 'ts-jest/utils'
import RestrictedFilesModal from './RestrictedFilesModal'

jest.mock('@amsterdam/asc-ui', () => {
  const originalModule = jest.requireActual('@amsterdam/asc-ui')

  return {
    __esModule: true,
    ...originalModule,
    Modal: jest.fn(),
  }
})

const ModalMock = mocked(Modal)

describe('RestrictedFilesModal', () => {
  beforeEach(() => {
    ModalMock.mockImplementation(({ children, ...otherProps }) => (
      <div {...otherProps}>{children}</div>
    ))
  })

  afterEach(() => {
    ModalMock.mockClear()
  })

  it('renders the modal', () => {
    render(
      <ThemeProvider>
        <RestrictedFilesModal files={[]} onClose={() => {}} onDownload={() => {}} />
      </ThemeProvider>,
    )
  })

  it('closes when requested by the modal', () => {
    ModalMock.mockImplementation(({ children, onClose, ...otherProps }) => {
      useEffect(() => {
        onClose?.()
      }, [])

      return <div {...otherProps}>{children}</div>
    })

    const onClose = jest.fn()

    render(
      <ThemeProvider>
        <RestrictedFilesModal files={[]} onClose={onClose} onDownload={() => {}} />
      </ThemeProvider>,
    )

    expect(onClose).toHaveBeenCalled()
  })

  it('closes when pressing the close button', () => {
    const onClose = jest.fn()

    render(
      <ThemeProvider>
        <RestrictedFilesModal files={[]} onClose={onClose} onDownload={() => {}} />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByTitle('Sluit'))

    expect(onClose).toHaveBeenCalled()
  })

  it('downloads when pressing the download button', () => {
    const onDownload = jest.fn()

    render(
      <ThemeProvider>
        <RestrictedFilesModal files={[]} onClose={() => {}} onDownload={onDownload} />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByText('Download het dossier'))

    expect(onDownload).toHaveBeenCalled()
  })
})
