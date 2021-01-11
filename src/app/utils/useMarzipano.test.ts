import { renderHook } from '@testing-library/react-hooks'
import { MutableRefObject } from 'react'
import useMarzipano from './useMarzipano'

jest.mock('marzipano', () => ({
  Viewer: (() => {
    class FakeViewer {
      // eslint-disable-next-line class-methods-use-this
      addEventListener() {}
    }

    return FakeViewer
  })(),
}))

describe('useMarzipano', () => {
  it('initialises the Marzipano Viewer', () => {
    const ref: MutableRefObject<HTMLElement | null> = { current: null }
    const { result } = renderHook(() => useMarzipano(ref))

    expect(result.current.marzipanoViewer).toBeNull()

    const div = document.createElement('div')
    const actualRef = { current: div }
    const { result: resultWithRef } = renderHook(() => useMarzipano(actualRef))

    expect(resultWithRef.current.marzipanoViewer).not.toBeNull()
  })
})
