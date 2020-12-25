import { shallow } from 'enzyme'
import ViewerControls from './ViewerControls'

describe('ViewerControls', () => {
  it('should render the component with classname', () => {
    const className = 'foo'
    const component = shallow(<ViewerControls className={className} />)

    expect(component.props().className).toContain(className)
  })

  it('should render the meta data', () => {
    const metaData = ['hello', 'world']
    const component = shallow(<ViewerControls metaData={metaData} />)

    const metaDataItem = component.find('.viewer-controls__meta__item span')

    expect(metaDataItem.at(0).props().children).toBe(metaData[0])
    expect(metaDataItem.at(1).props().children).toBe(metaData[1])
  })

  it('should render the control components', () => {
    const topLeftComponent = 'TopLeftComponent'
    const bottomLeftComponent = 'BottomLeftComponent'
    const topRightComponent = 'TopRightComponent'
    const bottomRightComponent = 'BottomRightComponent'
    const component = shallow(
      <ViewerControls
        topLeftComponent={topLeftComponent}
        bottomLeftComponent={bottomLeftComponent}
        topRightComponent={topRightComponent}
        bottomRightComponent={bottomRightComponent}
      />,
    )

    expect(component.find('.viewer-controls-item--top-left').at(0).props().children).toBe(
      topLeftComponent,
    )
    expect(component.find('.viewer-controls-item--bottom-left').at(0).props().children).toBe(
      bottomLeftComponent,
    )
    expect(component.find('.viewer-controls-item--top-right').at(0).props().children).toBe(
      topRightComponent,
    )

    // This should also render the meta data
    expect(component.find('.viewer-controls-item--bottom-right').at(0).props().children).toContain(
      bottomRightComponent,
    )
  })
})
