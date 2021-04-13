import { shallow } from 'enzyme'
import { mocked } from 'ts-jest/utils'
import EditorialPage from '../../components/EditorialPage/EditorialPage'
import useDocumentTitle from '../../utils/useDocumentTitle'
import useFromCMS from '../../utils/useFromCMS'
import SpecialDetailPage from './SpecialDetailPage'

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

  it('should set the loading prop on the blog container', () => {
    mockedUseFromCMS.mockImplementation(
      () =>
        ({
          loading: true,
        } as any),
    )

    const component = shallow(<SpecialDetailPage />)

    const editorialPage = component.find(EditorialPage).at(0)
    expect(editorialPage.props().loading).toBeTruthy()
  })
})
