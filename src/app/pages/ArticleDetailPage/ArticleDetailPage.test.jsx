import { ThemeProvider } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { mount, shallow } from 'enzyme'
import React from 'react'
import configureMockStore from 'redux-mock-store'
import useDocumentTitle from '../../utils/useDocumentTitle'
import useFromCMS from '../../utils/useFromCMS'
import ArticleDetailPage from './ArticleDetailPage'

jest.mock('../../utils/useFromCMS')
jest.mock('../../utils/useDocumentTitle')
jest.mock('@datapunt/matomo-tracker-react')

describe('ArticleDetailPage', () => {
  const id = 3
  const href = 'https://this.is/a-link/this-is-a-slug'

  const mockData = {
    fetchData: jest.fn(),
    results: {
      drupal_internal__nid: 100,
      title: 'This is a title',
      created: '2015-05-05',
      body: '<h1><a href="http://nasdkj.com">body text</a></h1>',
      field_file_size: 'file size',
      field_file_type: 'pdf',
      field_publication_source: 'source',
      field_intro: 'intro',
      slug: 'slug',
      included: [
        { attributes: { uri: { url: 'https://cover-link' } } },
        { attributes: { uri: { url: 'https://cover-link' } } },
        { attributes: { uri: { url: 'https://document-link' } } },
        { attributes: { uri: { url: 'https://document-link' } } },
      ],
    },
  }

  const fetchDataMock = jest.fn()

  let store
  beforeEach(() => {
    useDocumentTitle.mockImplementation(() => ({
      setDocumentTitle: jest.fn(),
      href,
    }))
    useMatomo.mockImplementation(() => ({ trackPageView: jest.fn(), href }))

    store = configureMockStore()({ location: { payload: { id } } })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render the spinner when the request is loading', () => {
    useFromCMS.mockImplementation(() => ({
      loading: true,
    }))

    const component = shallow(<ArticleDetailPage store={store} />)
      .dive()
      .dive()

    const editorialPage = component.find('EditorialPage').at(0)
    expect(editorialPage.props().loading).toBeTruthy()
  })

  it('should call the fetchData function when the component mounts', () => {
    useFromCMS.mockImplementation(() => ({
      loading: true,
      fetchData: fetchDataMock,
    }))

    const component = mount(
      <ThemeProvider>
        <ArticleDetailPage store={store} />
      </ThemeProvider>,
      { context: { store } },
    )

    expect(fetchDataMock).toHaveBeenCalled()
    expect(component.find('ArticleDetailPage').props().id).toBe(id)
  })

  it('should render the publication when there are results', () => {
    useFromCMS.mockImplementation(() => mockData)
    const component = shallow(<ArticleDetailPage store={store} />)
      .dive()
      .dive()

    expect(component).toMatchSnapshot()
  })
})
