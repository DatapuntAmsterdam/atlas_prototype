import { render } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react-hooks'
import { mocked } from 'ts-jest/utils'
import withAppContext from '../../utils/withAppContext'
import useParam from '../../utils/useParam'
import HeaderSearchContext, { HeaderSearchProvider, useHeaderSearch } from './HeaderSearchContext'
import type { HeaderSearchContextProps } from './HeaderSearchContext'
import HeaderSearch from './HeaderSearch'

jest.mock('./HeaderSearch', () => () => <div />)
jest.mock('../../utils/useParam')

const useParamMock = mocked(useParam)

describe('HeaderSearchContext', () => {
  beforeEach(() => {
    useParamMock.mockReturnValue([null, () => {}])
  })

  afterEach(() => {
    useParamMock.mockClear()
  })

  it('renders', () => {
    render(
      withAppContext(
        <HeaderSearchProvider>
          <HeaderSearch />
        </HeaderSearchProvider>,
      ),
    )
  })

  it('provides an empty value if the URL param is empty', () => {
    useParamMock.mockReturnValue(['', () => {}])

    const Tests = () => {
      expect(useHeaderSearch().searchInputValue).toEqual('')
      return null
    }

    render(
      <HeaderSearchProvider>
        <Tests />
      </HeaderSearchProvider>,
    )
  })

  it('uses the URL param as search query', () => {
    useParamMock.mockReturnValue(['foobar', () => {}])

    const Tests = () => {
      expect(useHeaderSearch().searchInputValue ?? '').toEqual('foobar')
      return null
    }

    render(
      <HeaderSearchProvider>
        <Tests />
      </HeaderSearchProvider>,
    )
  })

  it('updates the search query', () => {
    const setSearchInputValueMock = jest.fn()

    const value: HeaderSearchContextProps = {
      searchInputValue: 'foobar',
      setSearchInputValue: setSearchInputValueMock,
    }
    const { result } = renderHook(() => useHeaderSearch(), {
      wrapper: ({ children }) => (
        <HeaderSearchContext.Provider value={value}>{children}</HeaderSearchContext.Provider>
      ),
    })

    act(() => {
      result.current.setSearchInputValue('foobar123')
    })

    expect(setSearchInputValueMock).toHaveBeenCalledWith('foobar123')
  })
})
