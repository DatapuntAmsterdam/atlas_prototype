import { renderHook } from '@testing-library/react-hooks'
import useDocumentTitle from './useDocumentTitle'
import withAppContext from './withAppContext'

const historyReplaceMock = jest.fn()
const pathname = '/'

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname,
  }),
  useHistory: () => ({
    replace: historyReplaceMock,
  }),
}))

describe('useDocumentTitle', () => {
  it('should return a default title', () => {
    const { result } = renderHook(() => useDocumentTitle(), {
      wrapper: ({ children }) => withAppContext(<div>{children}</div>),
    })

    expect(result.current.documentTitle).toEqual('Home - Data en informatie')
  })

  it('should set a new title based on parameters passed to setDocumentTitle', () => {
    const { result } = renderHook(() => useDocumentTitle(), {
      wrapper: ({ children }) => withAppContext(<div>{children}</div>),
    })

    const documentTitle = result.current.setDocumentTitle('Overridden Title', ['Some more', 'Info'])

    // Todo: eventually test the documentTitle from the hook! Couldn't get this to work now...
    // ({ hook } = wrapper.find('div').props());
    // const { documentTitle } = hook;
    expect(documentTitle).toEqual('Overridden Title - Some more - Info - Data en informatie')
  })
})
