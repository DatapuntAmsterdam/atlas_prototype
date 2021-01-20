import { shallow } from 'enzyme'

import MapSearchResultsItem from './MapSearchResultsItem'

describe('MapSearchResultsItem', () => {
  it('should make an item clickable', () => {
    const clickHandler = jest.fn()
    const label = 'Dam 1'
    const wrapper = shallow(<MapSearchResultsItem onClick={clickHandler} label={label} />)

    wrapper.find('button').at(0).simulate('click')
    expect(clickHandler).toHaveBeenCalled()
  })
})
