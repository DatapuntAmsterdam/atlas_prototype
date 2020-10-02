import { ThemeProvider } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { mocked } from 'ts-jest/utils'
import { cmsConfig } from '../../../shared/config/config'
import linkAttributesFromAction from '../../../shared/services/link-attributes-from-action/linkAttributesFromAction'
import DocumentCover from '../../components/DocumentCover/DocumentCover'
import EditorialPage from '../../components/EditorialPage/EditorialPage'
import useDocumentTitle from '../../utils/useDocumentTitle'
import useDownload from '../../utils/useDownload'
import useFromCMS from '../../utils/useFromCMS'
import PublicationDetailPage from './PublicationDetailPage'

jest.mock('../../../shared/services/link-attributes-from-action/linkAttributesFromAction')
jest.mock('../../utils/useDocumentTitle')
jest.mock('../../utils/useDownload')
jest.mock('../../utils/useFromCMS')
jest.mock('@datapunt/matomo-tracker-react')

jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: 'foo' }),
}))

const mockedLinkAttributesFromAction = mocked(linkAttributesFromAction, true)
const mockedUseDocumentTitle = mocked(useDocumentTitle, true)
const mockedUseDownload = mocked(useDownload, true)
const mockedUseFromCMS = mocked(useFromCMS, true)
const mockedUseMatomo = mocked(useMatomo, true)

describe('PublicationDetailPage', () => {
  const href = 'https://this.is/a-link/this-is-a-slug'
  const fetchDataMock = jest.fn()
  const mockDownloadFile = jest.fn()
  const mockData = {
    fetchData: jest.fn(),
    results: {
      drupal_internal__nid: 100,
      title: 'This is a title',
      created: '2015-05-05',
      body: '<p>body text</p>',
      field_file_size: 'file size',
      field_file_type: 'pdf',
      field_publication_source: 'source',
      field_publication_intro: 'intro',
      included: [
        { attributes: { uri: { url: 'https://cover-link' } } },
        { attributes: { uri: { url: 'https://cover-link' } } },
        { attributes: { uri: { url: 'https://document-link' } } },
        { attributes: { uri: { url: 'https://document-link' } } },
      ],
    },
  }

  beforeEach(() => {
    mockedLinkAttributesFromAction.mockImplementation(() => ({ href } as any))
    mockedUseMatomo.mockImplementation(
      () =>
        ({
          trackPageView: jest.fn(),
          trackEvent: jest.fn(),
          href,
        } as any),
    )
    mockedUseDocumentTitle.mockImplementation(
      () =>
        ({
          setDocumentTitle: jest.fn(),
          href,
        } as any),
    )
    mockedUseDownload.mockImplementation(() => [false, mockDownloadFile])
  })

  it('should render the spinner when the request is loading', () => {
    mockedUseFromCMS.mockImplementation(
      () =>
        ({
          loading: true,
        } as any),
    )

    const component = shallow(<PublicationDetailPage />)

    const editorialPage = component.find(EditorialPage).at(0)
    expect(editorialPage.props().loading).toBeTruthy()
  })

  it('should call the fetchData function when the component mounts', () => {
    mockedUseFromCMS.mockImplementation(
      () =>
        ({
          loading: true,
          fetchData: fetchDataMock,
        } as any),
    )

    mount(
      <ThemeProvider>
        <PublicationDetailPage />
      </ThemeProvider>,
    )

    expect(mockedUseFromCMS).toHaveBeenCalledWith(cmsConfig.PUBLICATION, 'foo')
    expect(fetchDataMock).toHaveBeenCalled()
  })

  it('should render the publication when there are results', () => {
    mockedUseFromCMS.mockImplementation(() => mockData as any)
    const component = shallow(<PublicationDetailPage />)

    expect(component).toMatchSnapshot()
  })

  it('should call the useDownload hook when user tries to download publication', () => {
    mockedUseFromCMS.mockImplementation(() => mockData as any)
    const component = shallow(<PublicationDetailPage />)
    const documentCover = component.find(DocumentCover)

    expect(documentCover.exists()).toBeTruthy()

    documentCover.simulate('click')

    expect(mockDownloadFile).toHaveBeenCalled()
  })
})
