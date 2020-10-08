import { renderHook } from '@testing-library/react-hooks'

import useMarzipano from './useMarzipano'

describe('useMarzipano', () => {
  it('initialises the Marzipano Viewer', () => {
    const ref = { current: null }

    const { result } = renderHook(() => useMarzipano(ref))

    expect(result.current.marzipanoViewer).toBeNull()

    const div = document.createElement('div')

    const actualRef = { current: div }

    const { result: resultWithRef } = renderHook(() => useMarzipano(actualRef))

    expect(resultWithRef.current.marzipanoViewer).not.toBeNull()
  })
})
