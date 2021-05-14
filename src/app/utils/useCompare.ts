import usePrevious from './usePrevious'

export default function useCompare<T>(value: T) {
  const prevVal = usePrevious(value)
  return prevVal !== value
}
