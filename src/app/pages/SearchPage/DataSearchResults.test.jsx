import React from 'react'
import { shallow } from 'enzyme'
import DataSearchResults from './DataSearchResults'

// This file contains imports from a .graphql and must therefore be mocked
// jest.mock('./config.js', () => ({
//   DEFAULT_LIMIT: 1,
//   DATA_FILTERS: {},
// }))

describe('DataSearchResults', () => {
  it('shows the compact card component', () => {
    const component = shallow(
      <DataSearchResults
        compact
        results={[
          {
            count: 1,
            results: [1, 2, 3],
          },
        ]}
        errors={[]}
      />,
    )

    expect(component.find('AuthAlert').exists()).toBeFalsy()
    expect(component.find('DataCard').exists()).toBeTruthy()
  })

  it('shows the list card component', () => {
    const component = shallow(
      <DataSearchResults
        results={[
          {
            count: 1,
            results: [1, 2, 3],
          },
        ]}
        errors={[]}
      />,
    )

    expect(component.find('AuthAlert').exists()).toBeFalsy()
    expect(component.find('DataList').exists()).toBeTruthy()
  })

  it('shows the list card component with unauthorized message', () => {
    const errors = [
      {
        message: '',
        path: ['dataSearch'],
        extensions: { code: 'UNAUTHORIZED', label: 'foo' },
      },
    ]

    const component = shallow(
      <DataSearchResults
        errors={errors}
        results={[
          {
            count: 1,
            type: 'foo',
            results: [],
          },
        ]}
      />,
    )

    const unauthorizedMessage = component.find('AuthAlert')

    expect(unauthorizedMessage.exists()).toBeTruthy()
    expect(unauthorizedMessage.props()).toMatchObject({
      excludedResults: 'foo',
    })
  })

  it('adds a prop to the DataList component when a type cannot be loaded', () => {
    const errors = [
      {
        message: '',
        path: ['dataSearch'],
        extensions: { code: 'GATEWAY_TIMEOUT', label: 'Timeout', type: 'foo' },
      },
      {
        message: '',
        path: ['dataSearch'],
        extensions: { code: 'ERROR', label: 'Error', type: 'abc' },
      },
    ]

    const component = shallow(
      <DataSearchResults
        compact={false}
        errors={errors}
        results={[
          {
            count: 1,
            type: 'foo',
            results: [],
          },
          {
            count: 3,
            type: 'abc',
            results: [],
          },
        ]}
      />,
    )

    const dataList = component.find('DataList')

    expect(dataList.at(0).exists()).toBeTruthy()
    expect(dataList.at(0).props()).toMatchObject({
      hasLoadingError: true,
    })

    expect(dataList.at(1).exists()).toBeTruthy()
    expect(dataList.at(1).props()).toMatchObject({
      hasLoadingError: true,
    })
  })

  it('shows the no results component', () => {
    let component
    component = shallow(<DataSearchResults results={[]} errors={[]} />)

    expect(component.find('NoDataSearchResults').exists()).toBeTruthy()

    // Or no component at all
    component = shallow(
      <DataSearchResults
        results={[
          {
            count: 1,
            results: [],
          },
        ]}
        errors={[]}
      />,
    )

    expect(component.find('DataList').exists()).toBeFalsy()
  })
})
