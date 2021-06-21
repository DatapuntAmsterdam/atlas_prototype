import { Button, srOnlyStyle, themeSpacing } from '@amsterdam/asc-ui'
import type { FunctionComponent } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import First from '../../../shared/assets/icons/first.svg'
import Last from '../../../shared/assets/icons/last.svg'
import Next from '../../../shared/assets/icons/next.svg'
import Previous from '../../../shared/assets/icons/previous.svg'
import { pageParam } from '../../pages/SearchPage/query-params'
import useParam from '../../utils/useParam'

const PaginationButton = styled(Button)`
  &:last-of-type {
    margin-left: ${themeSpacing(1)};
  }
`

const SrOnlySpan = styled.span`
  ${srOnlyStyle}
`

export interface LegacyPaginationProps {
  numberOfPages: number
  currentPage: number
}

// Todo: replace with pagination component
const LegacyPagination: FunctionComponent<LegacyPaginationProps> = ({
  numberOfPages,
  currentPage: curPage,
}) => {
  const [currentPage, setCurrentPage] = useState(curPage)
  const [, setPage] = useParam(pageParam)
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === numberOfPages

  const showPagination = numberOfPages > 1

  const goToPage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (currentPage >= 1 && currentPage <= numberOfPages) {
      setPage(currentPage)
    }
  }

  if (numberOfPages && currentPage > numberOfPages) {
    setPage(1)
  }

  return showPagination ? (
    <div className="c-data-selection-pagination">
      <div className="c-data-selection-pagination__separator" />

      <div className="c-data-selection-pagination__controls">
        <div className="c-data-selection-pagination__backward">
          <PaginationButton
            type="button"
            disabled={isFirstPage}
            variant="primaryInverted"
            iconSize={21}
            iconLeft={<First />}
            onClick={() => setPage(1)}
          >
            Eerste
          </PaginationButton>
          <PaginationButton
            type="button"
            variant="primaryInverted"
            iconSize={21}
            iconLeft={<Previous />}
            disabled={isFirstPage}
            onClick={() => setPage(isFirstPage ? null : currentPage - 1)}
          >
            Vorige
          </PaginationButton>
        </div>
        <form className="c-data-selection-pagination__go" onSubmit={(e) => goToPage(e)}>
          <span className="u-margin__right--1 c-data-selection-pagination-link-text">
            Naar pagina
          </span>
          <input
            value={currentPage}
            onChange={(e) => {
              setCurrentPage(parseInt(e.target.value, 10))
            }}
            type="number"
            className="c-data-selection-pagination__input"
            pattern="\d*"
            min="1"
            size={4}
            maxLength={4}
          />
          <PaginationButton type="submit" title="Ga naar ingevoerde pagina">
            Ga
            <SrOnlySpan>Ga naar ingevoerde pagina</SrOnlySpan>
          </PaginationButton>
          <span className="u-margin__left--1 c-data-selection-pagination-link-text">
            van {numberOfPages}
          </span>
        </form>
        <div className="c-data-selection-pagination__forward">
          <PaginationButton
            type="button"
            variant="primaryInverted"
            iconSize={21}
            iconRight={<Next />}
            disabled={isLastPage}
            onClick={() => setPage(isLastPage ? null : currentPage + 1)}
          >
            Volgende
          </PaginationButton>
          <PaginationButton
            type="button"
            variant="primaryInverted"
            iconSize={21}
            iconRight={<Last />}
            disabled={isLastPage}
            onClick={() => setPage(numberOfPages)}
          >
            Laatste
          </PaginationButton>
        </div>
      </div>
    </div>
  ) : null
}

export default LegacyPagination
