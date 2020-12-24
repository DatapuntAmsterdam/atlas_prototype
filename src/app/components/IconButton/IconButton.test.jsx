import { shallow } from 'enzyme'
import IconButton from './IconButton'

describe('IconButton', () => {
  it('should render', () => {
    const component = shallow(<IconButton title="Test" icon="cross" onClick={() => {}} alignLeft />)
    expect(component).toMatchSnapshot()
  })

  it('should render on the right side', () => {
    const component = shallow(
      <IconButton title="Test" icon="cross" onClick={() => {}} alignLeft={false} />,
    )
    expect(component).toMatchSnapshot()
  })
})
