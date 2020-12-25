export function typedAction<T extends string>(type: T): { type: T }
export function typedAction<T extends string, P extends any>(
  type: T,
  payload: P,
): { type: T; payload: P }
export function typedAction<T extends string, P extends any, M extends any>(
  type: T,
  payload: P,
  meta: M,
): { type: T; payload: P; meta: M }

/**
 * Creates a Redux action that is properly typed so it's payload can be inferred based on it's action type.
 *
 * @param type The type of the action.
 * @param payload The payload of the action.
 * @param meta The metadata of the action.
 * @example
 * ```typescript
 * const SET_VALUE = 'SET_VALUE'
 * const CLEAR_VALUE = 'CLEAR_VALUE'
 *
 * export const setValue = (value: string) => typedAction(SET_VALUE, value)
 * export const clearValue = () => typedAction(CLEAR_VALUE)
 *
 * type Action = ReturnType<typeof setValue | typeof clearValue>
 *
 * interface State {
 *   value: string | null
 * }
 *
 * const initialState: State = { value: null }
 *
 * export default function reducer(state = initialState, action: Action): State {
 *   switch (action.type) {
 *     case SET_VALUE:
 *       // TypeScript now knows that 'payload' is a string based on the return type of 'setValue'.
 *       return { ...state, value: action.payload }
 *     case CLEAR_VALUE:
 *       return { ...state, value: null }
 *   }
 * }
 * ```
 */
export function typedAction(type: string, payload?: any, meta?: any) {
  return { type, payload, meta }
}
