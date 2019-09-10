import React from 'react'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import InfoModalContainer from './InfoModalContainer'
import useDataFetching from '../../utils/useDataFetching'

jest.mock('../../utils/useDataFetching')

describe('InfoModalContainer', () => {
  beforeEach(() => {
    useDataFetching.mockImplementation(() => ({
      results: {
        data: [
          {
            attributes: {
              title: 'This is a title',
              body: {
                value: 'This is a <html> value',
              },
            },
          },
        ],
      },
    }))
  })
  it('should render the modal when there are results', () => {
    const store = configureMockStore()({ ui: { isEmbed: false } })
    const component = shallow(<InfoModalContainer store={store} />)
      .dive()
      .dive()

    const modal = component.find('Modal')
    expect(modal.exists()).toBeTruthy()
  })

  it('should always hide the modal on embed page', () => {
    const store = configureMockStore()({ ui: { isEmbed: true } })
    const component = shallow(<InfoModalContainer store={store} />)
      .dive()
      .dive()

    const modal = component.find('Modal')
    expect(modal.exists()).toBeFalsy()
  })

  it('should hide the modal when there are no api results', () => {
    useDataFetching.mockReset()

    useDataFetching.mockImplementationOnce(() => ({
      results: {
        data: [],
      },
    }))

    const store = configureMockStore()({ ui: { isEmbed: false } })
    const component = shallow(<InfoModalContainer store={store} />)
      .dive()
      .dive()

    const modal = component.find('Modal')
    expect(modal.exists()).toBeFalsy()
  })
})
