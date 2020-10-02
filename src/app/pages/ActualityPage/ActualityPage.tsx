import React, { FunctionComponent, useMemo, useState } from 'react'
import styled from 'styled-components'
import { getMetadata } from '../../../api/metadata'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import usePromise, { PromiseStatus } from '../../utils/usePromise'

const StyledLoadingSpinner = styled(LoadingSpinner)`
  position: absolute;
  top: 200px;
`

const ActualityPage: FunctionComponent = () => (
  <div className="c-page">
    <div
      style={{ display: 'block' }}
      className="c-dashboard__column  u-col-sm--12 qa-dashboard__column--right"
    >
      <div className="c-dashboard__page o-max-width">
        <div className="c-dashboard__page-inner c-dashboard__content o-max-width__inner u-gutter">
          <h1 className="o-header__title u-margin__bottom--3">Actualiteit</h1>
          <div className="qa-page">{renderContents()}</div>
        </div>
      </div>
    </div>
  </div>
)

function renderContents() {
  const [retryCount, setRetryCount] = useState(0)
  const result = usePromise(useMemo(() => getMetadata(), [retryCount]))

  if (result.status === PromiseStatus.Pending) {
    return <StyledLoadingSpinner />
  }

  if (result.status === PromiseStatus.Rejected) {
    return (
      <ErrorMessage
        message="Er is een fout opgetreden bij het laden van de actualiteiten."
        buttonLabel="Probeer opnieuw"
        buttonOnClick={() => setRetryCount(retryCount + 1)}
      />
    )
  }

  return (
    <table className="c-table">
      <thead>
        <tr className="c-table__header-row">
          <th className="c-table__field c-table__header-field" scope="col">
            Thema
          </th>
          <th className="c-table__field c-table__header-field" scope="col">
            Actualisatie (aanmaak producten)
          </th>
          <th className="c-table__field c-table__header-field" scope="col">
            Peildatum gegevens
          </th>
        </tr>
      </thead>
      <tbody>
        {result.value.map((source) => (
          <tr className="c-table__content-row">
            {source.title && (
              <td className="c-table__field c-table__content-field">{source.title}</td>
            )}
            <td className="c-table__field c-table__content-field">{source.update_frequency}</td>
            <td className="c-table__field c-table__content-field">{source.data_modified_date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ActualityPage
