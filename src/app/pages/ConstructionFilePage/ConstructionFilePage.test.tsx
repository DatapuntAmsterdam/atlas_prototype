import { ThemeProvider } from '@amsterdam/asc-ui'
import { render, waitFor } from '@testing-library/react'
import { createMemoryHistory, createPath } from 'history'
import { Suspense } from 'react'
import { Route, Router } from 'react-router-dom'
import { mocked } from 'ts-jest/utils'
import { getBouwdossierById, singleFixture } from '../../../api/iiif-metadata/bouwdossier'
import { toConstructionFile } from '../../links'
import { routing } from '../../routes'
import useDocumentTitle from '../../utils/useDocumentTitle'
import ConstructionFilePage from './ConstructionFilePage'

jest.mock('../../../api/iiif-metadata/bouwdossier')
jest.mock('../../utils/useDocumentTitle')
jest.mock('./components/ImageViewer', () => () => <div data-testid="imageViewer" />)

const mockedGetBouwdossierById = mocked(getBouwdossierById)
const mockedUseDocumentTitle = mocked(useDocumentTitle)

const defaultHistory = createMemoryHistory({
  initialEntries: [createPath(toConstructionFile('foo'))],
})

function renderWithHistory(history = defaultHistory) {
  return (
    <Router history={history}>
      <ThemeProvider>
        <Route path={routing.constructionFile.path} exact component={ConstructionFilePage} />
      </ThemeProvider>
    </Router>
  )
}

describe('ConstructionFilePage', () => {
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
      initialEntries: [createPath(toConstructionFile('foo'))],
    })

    const { rerender } = render(renderWithHistory(history))

    expect(mockedSetDocumentTitle).toHaveBeenCalledWith(false)

    history.push(toConstructionFile('foo', 'somefile.png'))
    rerender(renderWithHistory(history))

    expect(mockedSetDocumentTitle).toHaveBeenCalledWith('Bouwtekening')
  })

  it('renders the loading state', () => {
    const { getByTestId } = render(renderWithHistory())

    expect(getByTestId('loadingSpinner')).toBeDefined()
  })

  it('renders the error state', async () => {
    mockedGetBouwdossierById.mockRejectedValue(new Error('Whoopsie'))

    const { getByTestId } = render(renderWithHistory())

    await waitFor(() => expect(getByTestId('errorMessage')).toBeDefined())
  })

  it('renders the file details', async () => {
    mockedGetBouwdossierById.mockResolvedValue(singleFixture)

    const { getByTestId } = render(renderWithHistory())

    await waitFor(() => expect(getByTestId('fileDetails')).toBeDefined())
  })

  it('renders the file viewer if a file is selected', async () => {
    mockedGetBouwdossierById.mockResolvedValue(singleFixture)

    const history = createMemoryHistory({
      initialEntries: [createPath(toConstructionFile('foo', 'file.png', 'path/to/file.png'))],
    })

    const { getByTestId } = render(<Suspense fallback="">{renderWithHistory(history)}</Suspense>)

    await waitFor(() => expect(getByTestId('imageViewer')).toBeDefined())
  })
})
