import { shallow } from 'enzyme'
import React from 'react'
import { wgs84ToRd } from '../../../shared/services/coordinate-reference-system/crs-converter'
import StatusBar from './StatusBar'

jest.mock('../../../shared/services/coordinate-reference-system/crs-converter')

describe('StatusBar', () => {
  it('should render', () => {
    const props = {
      heading: 999,
      date: '',
      currentLabel: 'Meest recent',
      location: [2, 3],
    }

    wgs84ToRd.mockReturnValue({ x: 12, y: 9 })

    const component = shallow(<StatusBar {...props} />)
    expect(component).toMatchSnapshot()
  })
})
