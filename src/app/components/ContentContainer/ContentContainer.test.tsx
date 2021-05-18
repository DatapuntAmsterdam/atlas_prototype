import { shallow } from 'enzyme'
import type { ShallowWrapper } from 'enzyme'
import ContentContainer from './ContentContainer'

describe('ContentContainer', () => {
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(
      <ContentContainer>
        <div />
      </ContentContainer>,
    )
  })

  it('should render', () => {
    expect(component.find('.content-container').props().children).toStrictEqual(<div />)
  })

  it('should pass the className and beamColor to the styled component', () => {
    component.setProps({ className: 'my-class', beamColor: 'valid' })

    expect(component.find('.content-container').exists()).toBeFalsy()
    expect(component.find('.my-class').exists()).toBeTruthy()
  })
})
