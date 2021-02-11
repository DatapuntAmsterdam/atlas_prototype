import { useRef } from 'react'

export default function useAnimationFrame(): (callback: FrameRequestCallback) => void {
  const isPendingRef = useRef(false)
  const callbackRef = useRef<FrameRequestCallback | null>(null)

  function handleFrame(time: number) {
    if (callbackRef.current) {
      callbackRef.current(time)
    }

    callbackRef.current = null
    isPendingRef.current = false
  }

  return (callback: FrameRequestCallback) => {
    callbackRef.current = callback

    if (isPendingRef.current) {
      return
    }

    isPendingRef.current = true
    window.requestAnimationFrame(handleFrame)
  }
}
