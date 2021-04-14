import { ThemeProvider } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { mocked } from 'ts-jest/utils'
import cmsConfig from '../../../shared/config/cms.config'
import EditorialPage from '../../components/EditorialPage/EditorialPage'
import useDocumentTitle from '../../utils/useDocumentTitle'
import useFromCMS from '../../utils/useFromCMS'
import ArticleDetailPage from './ArticleDetailPage'
import { render } from '@testing-library/react'
import { LOADING_SPINNER_TEST_ID } from '../../components/LoadingSpinner/LoadingSpinner'

jest.mock('../../utils/useFromCMS')
jest.mock('../../utils/useDocumentTitle')
jest.mock('@datapunt/matomo-tracker-react')
jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: 'foo' }),
  useHistory: () => ({ createHref: () => '' }),
}))

const mockedUseFromCMS = mocked(useFromCMS, true)
const mockedUseDocumentTitle = mocked(useDocumentTitle, true)
const mockedUseMatomo = mocked(useMatomo, true)

describe('ArticleDetailPage', () => {
  const href = 'https://this.is/a-link/this-is-a-slug'
  const fetchDataMock = jest.fn()

  beforeEach(() => {
    mockedUseDocumentTitle.mockImplementation(
      () =>
        ({
          setDocumentTitle: jest.fn(),
          href,
        } as any),
    )
    mockedUseMatomo.mockImplementation(() => ({ trackPageView: jest.fn(), href } as any))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render the spinner when the request is loading', () => {
    mockedUseFromCMS.mockImplementation(
      () =>
        ({
          fetchData: jest.fn(),
          loading: true,
        } as any),
    )

    const { getByTestId } = render(<ArticleDetailPage />)

    expect(getByTestId(LOADING_SPINNER_TEST_ID)).toBeDefined()
  })

  it('should call the fetchData function when the component mounts', () => {
    mockedUseFromCMS.mockImplementation(
      () =>
        ({
          loading: true,
          fetchData: fetchDataMock,
        } as any),
    )

    render(
      <ThemeProvider>
        <ArticleDetailPage />
      </ThemeProvider>,
    )

    expect(useFromCMS).toHaveBeenCalledWith(cmsConfig.ARTICLE, 'foo')
    expect(fetchDataMock).toHaveBeenCalled()
  })
})
