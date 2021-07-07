import { useState } from 'react'
import type { FunctionComponent } from 'react'
import createNamedContext from '../../utils/createNamedContext'
import useRequiredContext from '../../utils/useRequiredContext'
import { queryParam } from '../../pages/SearchPage/query-params'
import useParam from '../../utils/useParam'

export interface HeaderSearchContextProps {
  searchInputValue: string
  setSearchInputValue: (input: string) => void
}

const HeaderSearchContext = createNamedContext<HeaderSearchContextProps | null>(
  'SearchInputValue',
  null,
)

export default HeaderSearchContext

const HeaderSearchProvider: FunctionComponent = ({ children }) => {
  const [searchQuery] = useParam(queryParam)
  const [searchInputValue, setSearchInputValue] = useState<string>(searchQuery)

  return (
    <HeaderSearchContext.Provider value={{ searchInputValue, setSearchInputValue }}>
      {children}
    </HeaderSearchContext.Provider>
  )
}

export { HeaderSearchProvider }

export function useHeaderSearch() {
  return useRequiredContext(HeaderSearchContext)
}
