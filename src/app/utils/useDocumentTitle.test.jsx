import { useContext } from 'react'
import * as reactRedux from 'react-redux'
import { shallow } from 'enzyme'
import useDocumentTitle from './useDocumentTitle'
import * as routes from '../routes'
import { getLocationType } from '../../store/redux-first-router/selectors'

jest.mock('react-redux')
jest.mock('../routes')
jest.mock('../../store/redux-first-router/selectors')

function HookWrapper(props) {
  // eslint-disable-next-line react/prop-types,react/destructuring-assignment
  const hook = props.hook ? props.hook() : undefined
  return <div hook={hook} />
}

describe('useDocumentTitle', () => {
  let realUseContext
  let useContextMock
  const mockTitle = 'The title!'

  reactRedux.useSelector.mockImplementation(() => 'SOME_TYPE')

  beforeEach(() => {
    realUseContext = useContext
    // eslint-disable-next-line no-multi-assign
    useContextMock = useContext = jest.fn({
      setState: jest.fn,
    })

    useContextMock.mockReturnValue({
      getState: jest.fn().mockReturnValue({
        location: {
          type: 'SOME_TYPE',
        },
      }),
    })

    getLocationType.mockReturnValue('SOME_TYPE')
    routes.routing = {
      foo: {
        type: 'SOME_TYPE',
        title: mockTitle,
      },
    }
  })

  afterEach(() => {
    useContext = realUseContext
  })

  it('should return a default title', () => {
    const wrapper = shallow(<HookWrapper hook={() => useDocumentTitle()} />)
    const { hook } = wrapper.find('div').props()
    const { documentTitle } = hook

    expect(documentTitle).toEqual(`${mockTitle} - Data en informatie - Amsterdam`)
  })

  it('should set a new title based on parameters passed to setDocumentTitle', () => {
    const wrapper = shallow(<HookWrapper hook={() => useDocumentTitle()} />)
    const { hook } = wrapper.find('div').props()
    const { setDocumentTitle } = hook

    const documentTitle = setDocumentTitle('Overridden Title', ['Some more', 'Info'])

    // Todo: eventually test the documentTitle from the hook! Couldn't get this to work now...
    // ({ hook } = wrapper.find('div').props());
    // const { documentTitle } = hook;
    expect(documentTitle).toEqual(
      'Overridden Title - Some more - Info - Data en informatie - Amsterdam',
    )
  })
})
