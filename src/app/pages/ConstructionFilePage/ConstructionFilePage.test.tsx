import { ThemeProvider } from '@amsterdam/asc-ui'
import { render } from '@testing-library/react'
import { createMemoryHistory, createPath, History } from 'history'
import { Route, Router } from 'react-router-dom'
import { mocked } from 'ts-jest/utils'
import { toConstructionFile } from '../../links'
import { routing } from '../../routes'
import useDocumentTitle from '../../utils/useDocumentTitle'
import ConstructionFilePage from './ConstructionFilePage'

jest.mock('../../utils/useDocumentTitle')

const mockedUseDocumentTitle = mocked(useDocumentTitle)

function renderWithHistory(history: History) {
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
    mockedUseDocumentTitle.mockReturnValue({
      documentTitle: '',
      setDocumentTitle: jest.fn(),
    })
  })

  afterEach(() => {
    mockedUseDocumentTitle.mockReset()
  })

  it('renders the page', () => {
    const history = createMemoryHistory({
      initialEntries: [createPath(toConstructionFile('foo'))],
    })

    const { container } = render(renderWithHistory(history))

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
})
