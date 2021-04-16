import { shallow } from 'enzyme'
import { mocked } from 'ts-jest/utils'
import setIframeSize from '../../../shared/services/set-iframe-size/setIframeSize'
import IFrame from './IFrame'

const setIframeSizeMock = mocked(setIframeSize)

jest.mock('../../../shared/services/set-iframe-size/setIframeSize')

describe('IFrame', () => {
  const contentLink = { uri: 'https://this.is/a-link/this-is-a-slug' }
  const title = 'title'

  let component: any

  beforeEach(() => {
    component = shallow(<IFrame contentLink={contentLink} title={title} />)

    setIframeSizeMock.mockImplementation(() => {})
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
