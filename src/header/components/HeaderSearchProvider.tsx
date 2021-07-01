import { useState } from 'react'
import type { FunctionComponent } from 'react'
import createNamedContext from '../../app/utils/createNamedContext'
import useRequiredContext from '../../app/utils/useRequiredContext'

export interface HeaderSearchContextProps {
  searchQuery: string
  updateSearchQuery: (input: string) => void
}

const HeaderSearchContext = createNamedContext<HeaderSearchContextProps | null>(
  'SearchQueryPro',
  null,
)

const HeaderSearchProvider: FunctionComponent = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>('')

  const updateSearchQuery = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <HeaderSearchContext.Provider value={{ searchQuery, updateSearchQuery }}>
      {children}
    </HeaderSearchContext.Provider>
  )
}

export { HeaderSearchProvider }

export function useHeaderSearch() {
  return useRequiredContext(HeaderSearchContext)
}
