import { useState } from 'react'
import type { FunctionComponent } from 'react'
import createNamedContext from '../../app/utils/createNamedContext'
import useRequiredContext from '../../app/utils/useRequiredContext'
import { queryParam } from '../../app/pages/SearchPage/query-params'
import useParam from '../../app/utils/useParam'

export interface HeaderSearchContextProps {
  searchInputValue: string
  updateSearchInputValue: (input: string) => void
}

const HeaderSearchContext = createNamedContext<HeaderSearchContextProps | null>(
  'SearchInputValue',
  null,
)

const HeaderSearchProvider: FunctionComponent = ({ children }) => {
  const [searchQuery] = useParam(queryParam)
  const [searchInputValue, setSearchInputValue] = useState<string>(searchQuery)

  const updateSearchInputValue = (query: string) => {
    setSearchInputValue(query)
  }

  return (
    <HeaderSearchContext.Provider value={{ searchInputValue, updateSearchInputValue }}>
      {children}
    </HeaderSearchContext.Provider>
  )
}

export { HeaderSearchProvider }

export function useHeaderSearch() {
  return useRequiredContext(HeaderSearchContext)
}
