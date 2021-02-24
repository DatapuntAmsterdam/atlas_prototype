import { useRef } from 'react'

const voidCallback = () => {}

export default function useAnimationFrame(): (callback: FrameRequestCallback) => void {
  const isPendingRef = useRef(false)
  const callbackRef = useRef<FrameRequestCallback>(voidCallback)

  function handleFrame(time: number) {
    callbackRef.current(time)

    callbackRef.current = voidCallback
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
