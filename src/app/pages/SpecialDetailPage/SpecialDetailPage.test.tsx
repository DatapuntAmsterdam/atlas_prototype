import { render } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import useDocumentTitle from '../../utils/useDocumentTitle'
import useFromCMS from '../../utils/useFromCMS'
import SpecialDetailPage from './SpecialDetailPage'
import { LOADING_SPINNER_TEST_ID } from '../../components/LoadingSpinner/LoadingSpinner'

jest.mock('../../links')
jest.mock('../../utils/useFromCMS')
jest.mock('../../../shared/services/set-iframe-size/setIframeSize')
jest.mock('../../../shared/services/link-attributes-from-action/linkAttributesFromAction')
jest.mock('../../utils/useDocumentTitle')
jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: 'foo' }),
}))

const mockedUseFromCMS = mocked(useFromCMS)
const mockedUseDocumentTitle = mocked(useDocumentTitle)

describe('SpecialDetailPage', () => {
  beforeEach(() => {
    mockedUseDocumentTitle.mockImplementation(() => ({ setDocumentTitle: jest.fn() } as any))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should show a loading spinner', () => {
    mockedUseFromCMS.mockImplementation(
      () =>
        ({
          loading: true,
        } as any),
    )

    const { getByTestId } = render(<SpecialDetailPage />)

    expect(getByTestId(LOADING_SPINNER_TEST_ID)).toBeDefined()
  })
})
