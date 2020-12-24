import { shallow } from 'enzyme'
import LoadingIndicator from './LoadingIndicator'

describe('LoadingIndicator', () => {
  it('should render everything', () => {
    const wrapper = shallow(<LoadingIndicator loading={false} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render with classname is-loadingf', () => {
    const wrapper = shallow(<LoadingIndicator loading />)
    expect(wrapper).toMatchSnapshot()
  })
})
