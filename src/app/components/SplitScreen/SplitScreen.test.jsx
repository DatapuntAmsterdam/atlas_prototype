import { shallow } from 'enzyme'
import SplitScreen from './SplitScreen'

// Todo: properly test this
describe('SplitScreen', () => {
  it('should render', () => {
    const component = shallow(
      <SplitScreen
        leftComponent={<p>Hello</p>}
        rightComponent={<span>World</span>}
        printMode={false}
      />,
    )
    expect(component).toMatchSnapshot()
  })

  it('should render in print mode', () => {
    const component = shallow(
      <SplitScreen leftComponent={<p>Hello</p>} rightComponent={<span>World</span>} printMode />,
    )
    expect(component).toMatchSnapshot()
  })
})
