import React from 'react'

const FOCUSABLE_ELEMENTS = [
  // Extend to your needs
  'a[href]:not([disabled])',
]

enum KeyboardKeys {
  // Extend to your needs
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  ArrowRight = 'ArrowRight',
  ArrowLeft = 'ArrowLeft',
  Escape = 'Escape',
  Enter = 'Enter',
  Space = 'Space',
  Home = 'Home',
  End = 'End',
}

/**
 * Focus on children with arrow keys and home / end buttons.
 *
 * @param ref Component ref
 * @param callback
 * @param options
 * @param options.rotating Jump to first item from last or vice versa
 * @param options.directChildrenOnly Useful if you don't want to focus on other focussable elements inside the child components of the ref
 * @param options.horizontally In case you need to navigate horizontally, using left / right arrow buttons
 */
const useTraverseList = (
  ref: React.RefObject<HTMLElement>,
  callback: (activeElement: HTMLElement, list: Element[]) => void,
  options: {
    rotating: boolean
    directChildrenOnly: boolean
    horizontally: boolean
    skipElementWithClass?: string
  } = {
    rotating: false,
    directChildrenOnly: false,
    horizontally: false,
  },
) => {
  const next = options?.horizontally ? KeyboardKeys.ArrowRight : KeyboardKeys.ArrowDown
  const previous = options?.horizontally ? KeyboardKeys.ArrowLeft : KeyboardKeys.ArrowUp
  const keyDown = (e: React.KeyboardEvent) => {
    if (ref.current) {
      const element = ref.current

      const directChildSelector = options?.directChildrenOnly ? ':scope > ' : ''
      const focusableEls: Array<Element> = Array.from(
        element.querySelectorAll(
          `${directChildSelector}${FOCUSABLE_ELEMENTS.join(`, ${directChildSelector}`)}`,
        ),
      ).filter((elm) =>
        options.skipElementWithClass ? !elm.classList.contains(options.skipElementWithClass) : elm,
      )
      const activeElement = document.querySelector('.auto-suggest__dropdown-item--active')

      const getIndex = (el: Element | null) => {
        return el && focusableEls.includes(el) ? focusableEls.indexOf(el) : 0
      }

      let el

      switch (e.key) {
        case next: {
          if (getIndex(activeElement) !== focusableEls.length - 1) {
            el = focusableEls[activeElement ? getIndex(activeElement) + 1 : 0]
            // If there is nothing focussed yet, set the focus on the first element
            if (activeElement && !focusableEls.includes(activeElement)) {
              ;[el] = focusableEls
            }
          } else if (options?.rotating) {
            ;[el] = focusableEls
          }

          break
        }

        case previous: {
          if (getIndex(activeElement) !== 0) {
            el = focusableEls[getIndex(activeElement) - 1]
          } else if (options?.rotating) {
            el = focusableEls[focusableEls.length - 1]
          }
          break
        }

        case KeyboardKeys.Home: {
          ;[el] = focusableEls
          break
        }

        case KeyboardKeys.End: {
          el = focusableEls[focusableEls.length - 1]
          break
        }

        default:
      }

      if (
        (e.key === KeyboardKeys.ArrowDown ||
          e.key === KeyboardKeys.ArrowUp ||
          e.key === KeyboardKeys.ArrowLeft ||
          e.key === KeyboardKeys.ArrowRight ||
          e.key === KeyboardKeys.Home ||
          e.key === KeyboardKeys.End) &&
        el instanceof HTMLElement
      ) {
        callback(el, focusableEls)
        e.preventDefault()
      }
    }
  }

  return {
    keyDown,
  }
}

export default useTraverseList
