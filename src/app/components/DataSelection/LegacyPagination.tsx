import React, { FunctionComponent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPage } from '../../../shared/ducks/data-selection/actions'

type Props = {
  numberOfPages: number
  currentPage: number
}

// Todo: replace with pagination component
const LegacyPagination: FunctionComponent<Props> = ({ numberOfPages, currentPage: curPage }) => {
  const [currentPage, setCurrentPage] = useState(curPage)
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === numberOfPages
  const dispatch = useDispatch()

  const showPagination = numberOfPages > 1

  const goToPage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (currentPage >= 1 && currentPage <= numberOfPages) {
      dispatch(setPage(currentPage))
    }
  }

  if (numberOfPages && currentPage > numberOfPages) {
    dispatch(setPage(1))
  }

  return showPagination ? (
    <div className="c-data-selection-pagination">
      <div className="c-data-selection-pagination__separator" />

      <div className="c-data-selection-pagination__controls">
        <div className="c-data-selection-pagination__backward">
          <button
            type="button"
            className="c-data-selection-pagination-link--first"
            disabled={isFirstPage}
            onClick={() => dispatch(setPage(1))}
          >
            Eerste
          </button>
          <button
            type="button"
            className="c-data-selection-pagination-link--previous"
            disabled={isFirstPage}
            onClick={() => dispatch(setPage(isFirstPage ? null : currentPage - 1))}
          >
            Vorige
          </button>
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
          <button
            type="submit"
            className="c-data-selection-pagination__button"
            title="Ga naar ingevoerde pagina"
          >
            Ga
            <span className="u-sr-only">Ga naar ingevoerde pagina</span>
          </button>
          <span className="u-margin__left--1 c-data-selection-pagination-link-text">
            van {numberOfPages}
          </span>
        </form>
        <div className="c-data-selection-pagination__forward">
          <button
            type="button"
            className="c-data-selection-pagination-link--next"
            disabled={isLastPage}
            onClick={() => dispatch(setPage(isLastPage ? null : currentPage + 1))}
          >
            Volgende
          </button>
          <button
            type="button"
            className="c-data-selection-pagination-link--last"
            disabled={isLastPage}
            onClick={() => dispatch(setPage(numberOfPages))}
          >
            Laatste
          </button>
        </div>
      </div>
    </div>
  ) : null
}

export default LegacyPagination
