import { useEffect, useRef } from 'react'

export default function useInterval(callback: () => void, delay: number) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const intervalId = setInterval(() => callbackRef.current(), delay)

    return () => clearInterval(intervalId)
  }, [delay])
}
