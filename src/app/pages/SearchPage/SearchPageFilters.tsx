import React from 'react'
import SearchFilter from '../../components/SearchFilter'
import { Filter } from '../../models'

interface SearchPageFiltersProps {
  filters: Filter[]
  totalCount: number
}

const SearchPageFilters: React.FC<SearchPageFiltersProps> = ({ filters, totalCount }) => {
  return (
    <>
      {filters.map(filter => (
        <SearchFilter key={filter.type} filter={filter} totalCount={totalCount} hideCount />
      ))}
    </>
  )
}

export default SearchPageFilters
