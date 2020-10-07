import { renderHook } from '@testing-library/react-hooks'

import useMarzipano from './useMarzipano'

describe('useMarzipano', () => {
  it('initialises the Marzipano Viewer', () => {
    const ref = { current: null }

    const { result } = renderHook(() => useMarzipano(ref))

    expect(result.current.marzipanoViewer).toBeNull()

    const div = document.createElement('div')
    document.body.appendChild(div)

    const actualRef = { current: div }

    const { result: resultWithRef } = renderHook(() => useMarzipano(actualRef))

    expect(resultWithRef.current.marzipanoViewer).not.toBeNull()
  })

  it('returns currentMarzipanoView', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const ref = { current: div }

    const { result } = renderHook(() => useMarzipano(ref))

    expect(result.current.currentMarzipanoView).toBeNull()

    result.current.marzipanoViewer.lookTo()

    expect(result.current.currentMarzipanoView).not.toBeNull()
  })
})
