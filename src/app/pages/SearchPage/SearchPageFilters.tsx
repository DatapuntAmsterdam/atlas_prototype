import { Close } from '@datapunt/asc-assets'
import styled from 'styled-components'
import {
  breakpoint,
  Button,
  Column,
  Heading,
  Modal,
  Spinner,
  themeColor,
  themeSpacing,
  TopBar,
} from '@datapunt/asc-ui'
import React, { ReactElement } from 'react'
import PageFilterBox from '../../components/PageFilterBox/PageFilterBox'
import SearchFilter from '../../components/SearchFilter'
import { Filter } from '../../models/filter'
import CONSTANTS from '../../../shared/config/constants'

interface SearchPageFiltersProps {
  filters: Filter[]
  totalCount: number
  hideCount: boolean
  setShowFilter: Function
  query: string
  currentPage: string
  showFilter: boolean
  fetching: boolean
}

const FilterColumn = styled(Column)`
  align-content: flex-start;
  @media screen and ${breakpoint('max-width', 'laptop')} {
    display: none;
  }
`

const ModalCloseButton = styled(Button)`
  margin-left: auto;
`

const StyledModal = styled(Modal)`
  ${FilterColumn} {
    top: 0;
    width: 100%;
    display: block;
    overflow-y: scroll;
    left: 0;
    right: ${themeSpacing(5)};
    padding: ${themeSpacing(5)};
    flex-grow: 1;
  }
  [role='dialog'] {
    max-width: calc(400px + ${themeSpacing(12)});
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: absolute;
    max-height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    pointer-events: all;
    transform: initial;
  }
`

const ApplyFilters = styled.div`
  width: 100%;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  padding: ${themeSpacing(4)};
  background-color: #fff;
  box-shadow: 0 0 ${themeSpacing(2)} 1px black;
  margin-top: auto;
  position: relative; // No idea why, but this will make sure the box-shadow overlaps the borders of the sibling components
`

const ApplyFiltersButton = styled(Button)`
  width: 100%;
  display: flex;
  text-align: center;
  justify-content: center;
`

const StyledTopBar = styled(TopBar)`
  border-bottom: 2px solid ${themeColor('tint', 'level3')};
`

const SearchPageFilters: React.FC<SearchPageFiltersProps> = ({
  filters,
  totalCount,
  hideCount,
  setShowFilter,
  query,
  currentPage,
  showFilter,
  fetching,
}) => {
  const Filters: ReactElement = (
    <FilterColumn wrap span={{ small: 0, medium: 0, big: 0, large: 4, xLarge: 3 }}>
      <PageFilterBox {...{ query, currentPage }} />
      <>
        {filters.length > 0 &&
          filters.map((filter) => (
            <SearchFilter
              key={filter.type}
              filter={filter}
              totalCount={totalCount}
              hideCount={hideCount}
            />
          ))}
      </>
    </FilterColumn>
  )

  return (
    <>
      {Filters}
      <StyledModal
        aria-labelledby="filters"
        aria-describedby="filters"
        open={showFilter}
        onClose={() => setShowFilter(false)}
        hideOverFlow={false}
        zIndexOffset={1}
        backdropOpacity={CONSTANTS.BACKDROP_OPACITY}
      >
        <StyledTopBar>
          <Heading style={{ flexGrow: 1 }} as="h4">
            <ModalCloseButton
              variant="blank"
              type="button"
              size={30}
              onClick={() => setShowFilter(false)}
              icon={<Close />}
            />
          </Heading>
        </StyledTopBar>
        {Filters}
        <ApplyFilters>
          <ApplyFiltersButton
            iconLeft={fetching && <Spinner />}
            onClick={() => setShowFilter(false)}
            variant="primary"
          >
            {!fetching && `${totalCount} resultaten tonen`}
          </ApplyFiltersButton>
        </ApplyFilters>
      </StyledModal>
    </>
  )
}

export default SearchPageFilters
