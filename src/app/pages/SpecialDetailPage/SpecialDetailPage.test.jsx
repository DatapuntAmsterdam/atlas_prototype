import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import SpecialDetailPage from './SpecialDetailPage'
import useFromCMS from '../../utils/useFromCMS'
import setIframeSize from '../../../shared/services/set-iframe-size/setIframeSize'
import linkAttributesFromAction from '../../../shared/services/link-attributes-from-action/linkAttributesFromAction'
import useDocumentTitle from '../../utils/useDocumentTitle'

jest.mock('../../utils/useFromCMS')
jest.mock('../../../shared/services/set-iframe-size/setIframeSize')
jest.mock('../../../shared/services/link-attributes-from-action/linkAttributesFromAction')
jest.mock('../../utils/useDocumentTitle')

describe('SpecialDetailPage', () => {
  const id = 6
  const href = 'https://this.is/a-link/this-is-a-slug'
  const fetchDataMock = jest.fn()

  let store
  let mockData

  beforeEach(() => {
    linkAttributesFromAction.mockImplementation(() => ({ href }))
    useDocumentTitle.mockImplementation(() => ({ setDocumentTitle: jest.fn() }))

    store = configureMockStore()({ location: { payload: { id } } })

    mockData = {
      fetchData: fetchDataMock,
      results: {
        drupal_internal__nid: 100,
        title: 'This is a title',
        created: '2015-05-05',
        field_slug: 'slug',
        field_special_type: 'special',
        field_iframe_link: {
          uri: 'http://this.is.alink',
        },
        included: [
          { attributes: { uri: { url: 'https://cover-link' } } },
          { attributes: { uri: { url: 'https://cover-link' } } },
          { attributes: { uri: { url: 'https://document-link' } } },
          { attributes: { uri: { url: 'https://document-link' } } },
        ],
      },
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should set the loading prop on the blog container', () => {
    useFromCMS.mockImplementation(() => ({
      loading: true,
    }))

    const component = shallow(<SpecialDetailPage store={store} />)
      .dive()
      .dive()

    const editorialPage = component.find('EditorialPage').at(0)
    expect(editorialPage.props().loading).toBeTruthy()
  })

  it('should mount the iframe when there are results', () => {
    useFromCMS.mockImplementation(() => mockData)

    const component = shallow(<SpecialDetailPage store={store} />)
      .dive()
      .dive()

    const iframe = component.find('iframe').at(0)
    expect(iframe.exists()).toBeTruthy()
  })

  it('should call the setIframeSize function', () => {
    setIframeSize.mockImplementation(() => {})

    useFromCMS.mockImplementation(() => mockData)

    const component = shallow(<SpecialDetailPage store={store} />)
      .dive()
      .dive()

    const iframe = component.find('iframe').at(0)
    expect(iframe.exists()).toBeTruthy()

    iframe.simulate('load')

    expect(setIframeSize).toHaveBeenCalled()

    component.unmount()

    expect(setIframeSize).not.toHaveBeenCalledTimes(2)
  })
})
