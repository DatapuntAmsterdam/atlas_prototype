import { shallow } from 'enzyme'
import * as templates from './Templates'

describe('Templates', () => {
  Object.values(templates).forEach((Template) => {
    it('should render without failing', () => {
      const component = shallow(
        <Template variables={[{ value: 'foo' }, { value: 'bar' }]} formattedValue={[]} />,
      )
      expect(component).toMatchSnapshot()
    })
  })
})
