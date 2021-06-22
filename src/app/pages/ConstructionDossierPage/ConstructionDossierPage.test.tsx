import { ThemeProvider } from '@amsterdam/asc-ui'
import { screen, render, waitFor } from '@testing-library/react'
import { createMemoryHistory, createPath } from 'history'
import { Suspense } from 'react'
import { Route, Router } from 'react-router-dom'
import { mocked } from 'ts-jest/utils'
import { getBouwdossierById, singleFixture } from '../../../api/iiif-metadata/bouwdossier'
import { toConstructionDossier } from '../../links'
import { routing } from '../../routes'
import useDocumentTitle from '../../utils/useDocumentTitle'
import ConstructionDossierPage from './ConstructionDossierPage'

jest.mock('../../../api/iiif-metadata/bouwdossier')
jest.mock('../../utils/useDocumentTitle')
jest.mock('./components/ImageViewer', () => () => <div data-testid="imageViewer" />)

const mockedGetBouwdossierById = mocked(getBouwdossierById)
const mockedUseDocumentTitle = mocked(useDocumentTitle)

const defaultHistory = createMemoryHistory({
  initialEntries: [createPath(toConstructionDossier('foo'))],
})

function renderWithHistory(history = defaultHistory) {
  return (
    <Router history={history}>
      <ThemeProvider>
        <Route path={routing.constructionDossier.path} exact component={ConstructionDossierPage} />
      </ThemeProvider>
    </Router>
  )
}

describe('ConstructionDossierPage', () => {
  beforeEach(() => {
    mockedGetBouwdossierById.mockReturnValue(new Promise(() => {}))

    mockedUseDocumentTitle.mockReturnValue({
      documentTitle: '',
      setDocumentTitle: jest.fn(),
    })
  })

  afterEach(() => {
    mockedGetBouwdossierById.mockReset()
    mockedUseDocumentTitle.mockReset()
  })

  it('renders the page', () => {
    const { container } = render(renderWithHistory())

    expect(container.firstChild).toBeDefined()
  })

  it('updates the page title if the selected file changes', () => {
    const mockedSetDocumentTitle = jest.fn()

    mockedUseDocumentTitle.mockReturnValue({
      documentTitle: '',
      setDocumentTitle: mockedSetDocumentTitle,
    })

    const history = createMemoryHistory({
      initialEntries: [createPath(toConstructionDossier('foo'))],
    })

    const { rerender } = render(renderWithHistory(history))

    expect(mockedSetDocumentTitle).toHaveBeenCalledWith(false)

    history.push(toConstructionDossier('foo', 'somefile.png'))
    rerender(renderWithHistory(history))

    expect(mockedSetDocumentTitle).toHaveBeenCalledWith('Bouwtekening')
  })

  it('renders the loading state', () => {
    render(renderWithHistory())

    expect(screen.getByTestId('loadingSpinner')).toBeInTheDocument()
  })

  it('renders the error state', async () => {
    mockedGetBouwdossierById.mockRejectedValue(new Error('Whoopsie'))

    render(renderWithHistory())

    await waitFor(() => expect(screen.getByTestId('errorMessage')).toBeInTheDocument())
  })

  it('renders the file viewer if a file is selected', async () => {
    mockedGetBouwdossierById.mockResolvedValue(singleFixture)

    const history = createMemoryHistory({
      initialEntries: [createPath(toConstructionDossier('foo', 'file.png', 'path/to/file.png'))],
    })

    render(<Suspense fallback="">{renderWithHistory(history)}</Suspense>)

    await waitFor(() => expect(screen.getByTestId('imageViewer')).toBeInTheDocument())
  })

  it('renders the file details', async () => {
    mockedGetBouwdossierById.mockResolvedValue(singleFixture)

    render(renderWithHistory())

    await waitFor(() => expect(screen.getByTestId('dossierDetails')).toBeInTheDocument())
  })

  it('hides the file details if the image viewer is active', async () => {
    mockedGetBouwdossierById.mockResolvedValue(singleFixture)

    const history = createMemoryHistory({
      initialEntries: [createPath(toConstructionDossier('foo', 'file.png', 'path/to/file.png'))],
    })

    render(<Suspense fallback="">{renderWithHistory(history)}</Suspense>)

    await waitFor(() => expect(screen.queryByTestId('dossierDetails')).not.toBeInTheDocument())
  })

  it('displays the dossier title as the page title when displaying the file details', async () => {
    const mockedSetDocumentTitle = jest.fn()

    mockedUseDocumentTitle.mockReturnValue({
      documentTitle: '',
      setDocumentTitle: mockedSetDocumentTitle,
    })

    mockedGetBouwdossierById.mockResolvedValue(singleFixture)

    render(renderWithHistory())

    await waitFor(() => expect(mockedSetDocumentTitle).toHaveBeenCalledWith(singleFixture.titel))
  })
})
