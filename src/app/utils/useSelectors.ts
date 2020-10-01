import { useSelector } from 'react-redux'

type Selector = (state: any) => any

const useSelectors = (arrayOfSelectors: Selector[]) => arrayOfSelectors.map((fn) => useSelector(fn))

export default useSelectors
