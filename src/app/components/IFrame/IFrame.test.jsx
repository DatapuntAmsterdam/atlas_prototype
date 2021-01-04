import { shallow } from 'enzyme'
import IFrame from './IFrame'
import setIframeSize from '../../../shared/services/set-iframe-size/setIframeSize'

jest.mock('../../../shared/services/set-iframe-size/setIframeSize')

describe('IFrame', () => {
  const contentLink = { uri: 'https://this.is/a-link/this-is-a-slug' }
  const title = 'title'

  let component

  beforeEach(() => {
    component = shallow(<IFrame contentLink={contentLink} title={title} />)

    setIframeSize.mockImplementation(() => {})
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should mount the iframe when there are results', () => {
    const iframe = component.find('iframe').at(0)
    expect(iframe.exists()).toBeTruthy()
  })

  it('should call the setIframeSize function', () => {
    const iframe = component.find('iframe').at(0)
    expect(iframe.exists()).toBeTruthy()

    iframe.simulate('load')

    expect(setIframeSize).toHaveBeenCalled()

    component.unmount()

    expect(setIframeSize).not.toHaveBeenCalledTimes(2)
  })
})
