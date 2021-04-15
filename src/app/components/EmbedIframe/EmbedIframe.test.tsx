import { shallow } from 'enzyme'
import EmbedIframe from './EmbedIframe'

describe('EmbedIframe', () => {
  it('should render', () => {
    const component = shallow(<EmbedIframe />)
    expect(component).toMatchSnapshot()
  })
})
