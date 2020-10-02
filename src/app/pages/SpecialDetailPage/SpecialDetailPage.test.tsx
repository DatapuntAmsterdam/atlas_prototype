import { shallow } from 'enzyme'
import React from 'react'
import { mocked } from 'ts-jest/utils'
import linkAttributesFromAction from '../../../shared/services/link-attributes-from-action/linkAttributesFromAction'
import EditorialPage from '../../components/EditorialPage/EditorialPage'
import useDocumentTitle from '../../utils/useDocumentTitle'
import useFromCMS from '../../utils/useFromCMS'
import SpecialDetailPage from './SpecialDetailPage'

jest.mock('../../utils/useFromCMS')
jest.mock('../../../shared/services/set-iframe-size/setIframeSize')
jest.mock('../../../shared/services/link-attributes-from-action/linkAttributesFromAction')
jest.mock('../../utils/useDocumentTitle')
jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: 'foo' }),
}))

const mockedUseFromCMS = mocked(useFromCMS, true)
const mockedLinkAttributesFromAction = mocked(linkAttributesFromAction, true)
const mockedUseDocumentTitle = mocked(useDocumentTitle, true)

describe('SpecialDetailPage', () => {
  const href = 'https://this.is/a-link/this-is-a-slug'

  beforeEach(() => {
    mockedLinkAttributesFromAction.mockImplementation(() => ({ href } as any))
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
