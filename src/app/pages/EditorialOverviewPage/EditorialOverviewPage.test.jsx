import React from 'react'
import { mount, shallow } from 'enzyme'
import { ThemeProvider } from '@datapunt/asc-ui'
import EditorialOverviewPage from './EditorialOverviewPage'
import useFromCMS from '../../utils/useFromCMS'
import linkAttributesFromAction from '../../../shared/services/link-attributes-from-action/linkAttributesFromAction'

jest.mock('../../../shared/services/link-attributes-from-action/linkAttributesFromAction')
jest.mock('../../utils/useFromCMS')

describe('EditorialOverviewPage', () => {
  let component
  const fetchDataMock = jest.fn()

  beforeEach(() => {
    linkAttributesFromAction.mockImplementation(() => ({
      href: 'https://this.is.alink',
    }))
    useFromCMS.mockImplementation(() => ({
      loading: true,
      fetchData: fetchDataMock,
    }))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should display the loading indicator', () => {
    component = shallow(<EditorialOverviewPage type="ARTICLES" />)

    expect(component.find('LoadingIndicator')).toBeTruthy()
  })

  it('should call the fetchData function on mount', () => {
    component = mount(
      <ThemeProvider>
        <EditorialOverviewPage type="ARTICLES" />
      </ThemeProvider>,
    )

    expect(fetchDataMock).toHaveBeenCalled()
  })

  it('should call the fetchData function when clicking the show more button', () => {
    useFromCMS.mockImplementation(() => ({
      loading: false,
      fetchData: fetchDataMock,
      results: {
        data: [],
        links: { next: { href: 'http://link' } },
      },
    }))

    component = mount(
      <ThemeProvider>
        <EditorialOverviewPage type="ARTICLES" />
      </ThemeProvider>,
    )

    const button = component.find('Button')

    button.simulate('click')

    expect(fetchDataMock).toHaveBeenCalledTimes(2)

    // This is the second loading indicator at the bottom of the page
    expect(component.find('LoadingIndicator').at(1)).toBeTruthy()
  })
})
