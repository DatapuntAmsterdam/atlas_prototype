import { createContext } from 'react'
import type { Context } from 'react'

export interface NamedContext<T> extends Omit<Context<T>, 'displayName'> {
  displayName: string
}

/**
 * Creates a Context object with a `displayName` property. React DevTools uses this string to determine what to display for the context.
 *
 * For more information see: https://reactjs.org/docs/context.html#contextdisplayname
 *
 * @param displayName The displayName for the context.
 * @param defaultValue The default value for the context.
 * @returns
 */
export default function createNamedContext<T>(
  displayName: string,
  defaultValue: T,
): NamedContext<T> {
  const context = createContext(defaultValue)

  context.displayName = displayName

  return context as NamedContext<T>
}
