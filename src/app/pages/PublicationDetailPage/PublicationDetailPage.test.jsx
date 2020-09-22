import { ThemeProvider } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { mount, shallow } from 'enzyme'
import React from 'react'
import configureMockStore from 'redux-mock-store'
import linkAttributesFromAction from '../../../shared/services/link-attributes-from-action/linkAttributesFromAction'
import useDocumentTitle from '../../utils/useDocumentTitle'
import useDownload from '../../utils/useDownload'
import useFromCMS from '../../utils/useFromCMS'
import PublicationDetailPage from './PublicationDetailPage'

jest.mock('../../utils/useFromCMS')
jest.mock('../../../shared/services/link-attributes-from-action/linkAttributesFromAction')
jest.mock('../../utils/useDocumentTitle')
jest.mock('../../utils/useDownload')
jest.mock('@datapunt/matomo-tracker-react')

describe('PublicationDetailPage', () => {
  const id = 3
  const href = 'https://this.is/a-link/this-is-a-slug'

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

  const mockFetchData = jest.fn()
  const mockDownloadFile = jest.fn()

  let store
  beforeEach(() => {
    linkAttributesFromAction.mockImplementation(() => ({ href }))
    useDocumentTitle.mockImplementation(() => ({
      setDocumentTitle: jest.fn(),
      href,
    }))
    useMatomo.mockImplementation(() => ({ trackPageView: jest.fn(), trackEvent: jest.fn(), href }))
    useDownload.mockImplementation(() => ['', mockDownloadFile])

    store = configureMockStore()({
      location: { payload: { id } },
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render the spinner when the request is loading', () => {
    useFromCMS.mockImplementation(() => ({
      loading: true,
    }))

    const component = shallow(<PublicationDetailPage store={store} />)
      .dive()
      .dive()

    const editorialPage = component.find('EditorialPage').at(0)
    expect(editorialPage.props().loading).toBeTruthy()
  })

  it('should call the fetchData function when the component mounts', () => {
    useFromCMS.mockImplementation(() => ({
      loading: true,
      fetchData: mockFetchData,
    }))

    const component = mount(
      <ThemeProvider>
        <PublicationDetailPage store={store} />
      </ThemeProvider>,
      { context: { store } },
    )

    expect(mockFetchData).toHaveBeenCalled()
    expect(component.find('PublicationDetailPage').props().id).toBe(id)
  })

  it('should render the publication when there are results', () => {
    useFromCMS.mockImplementation(() => mockData)
    const component = shallow(<PublicationDetailPage store={store} />)
      .dive()
      .dive()

    expect(component).toMatchSnapshot()
  })

  it('should call the useDownload hook when user tries to download publication', () => {
    useFromCMS.mockImplementation(() => mockData)
    const component = shallow(<PublicationDetailPage store={store} />)
      .dive()
      .dive()
    const documentCover = component.find('DocumentCover')

    expect(documentCover.exists()).toBeTruthy()

    documentCover.simulate('click')

    expect(mockDownloadFile).toHaveBeenCalled()
  })
})
