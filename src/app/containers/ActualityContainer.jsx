import React, { useEffect, useState } from 'react'
import LoadingIndicator from '../../shared/components/loading-indicator/LoadingIndicator'
import { fetchWithoutToken } from '../../shared/services/api/api'

const ActualityContainer = () => {
  const [loading, setLoading] = useState(false)
  const [sources, setSources] = useState()

  useEffect(() => {
    setLoading(true)
    fetchWithoutToken(`${process.env.API_ROOT}metadata/`)
      .then(setSources)
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="c-page">
      <div
        style={{ display: 'block' }}
        className="c-dashboard__column  u-col-sm--12 qa-dashboard__column--right"
      >
        <div className="c-dashboard__page o-max-width">
          <div className="c-dashboard__page-inner c-dashboard__content o-max-width__inner u-gutter">
            <h1 className="o-header__title u-margin__bottom--3">Actualiteit</h1>
            <div className="qa-page">
              {loading ? (
                <LoadingIndicator style={{ top: '200px' }} />
              ) : (
                sources && (
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
                      {sources.map((source) => (
                        <tr className="c-table__content-row">
                          {source.title && (
                            <td className="c-table__field c-table__content-field">
                              {source.title}
                            </td>
                          )}
                          <td className="c-table__field c-table__content-field">
                            {source.update_frequency}
                          </td>
                          <td className="c-table__field c-table__content-field">
                            {source.data_modified_date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActualityContainer
