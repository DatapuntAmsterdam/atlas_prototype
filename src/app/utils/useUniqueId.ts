import { useMemo } from 'react'
import { v4 as uuid } from 'uuid'

/**
 * A hook to generate a unique identifier with an optional prefix.
 *
 * For example:
 *
 * ```tsx
 * const controlId = uniqueId('first-name')
 *
 * return (
 *   <>
 *     <label for={controlId}>First name</label>
 *     <input type="text" id={controlId}>
 *   </>
 *  )
 * ```
 *
 * @param prefix The prefix to add before the unique identifier.
 * @returns The unique identifier formatted as `prefix-UUIDv4`
 */
export default function useUniqueId(prefix?: string) {
  return useMemo(() => (prefix ? `${prefix}-${uuid()}` : uuid()), [prefix])
}
