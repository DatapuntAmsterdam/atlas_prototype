// TODO: This dependency can be removed once https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/948 is released.
/// <reference types="resize-observer-browser" />
import { RefObject, useLayoutEffect, useMemo, useState } from 'react'

// NOTE: entry.borderBoxSize does not work in Safari, so use contentRect for now.
// Therefore we need to calculate the ResizeObserverSize by also passing the offset manually (in case the ref has a padding)
export default function useObserveSize<T extends Element>(
  ref: T | RefObject<T> | null,
  paddingOffsetInline = 0,
  paddingOffsetBlock = 0,
): ResizeObserverSize | null {
  const [size, setSize] = useState<ResizeObserverSize | null>(null)
  const resizeObserver = useMemo(
    () =>
      new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const inlineSize =
            entry.contentRect?.left + entry.contentRect?.right + paddingOffsetInline || 0

          const blockSize = entry.contentRect?.bottom + paddingOffsetBlock || 0

          if (inlineSize) {
            setSize({
              inlineSize,
              blockSize,
            })
          }
        })
      }),
    [],
  )

  useLayoutEffect(() => {
    if (!ref) {
      return undefined
    }

    const element = ref instanceof Element ? ref : ref.current

    if (!element) {
      return undefined
    }

    resizeObserver.observe(element)

    return () => resizeObserver.unobserve(element)
  }, [ref])

  return size
}
