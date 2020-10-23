import React, { FunctionComponent, useMemo, useState } from 'react'
import { Column, Container, Heading, Row } from '@amsterdam/asc-ui'
import { getMetadata, Metadata } from '../../../api/metadata'
import PromiseResult from '../../components/PromiseResult/PromiseResult'
import ContentContainer from '../../components/ContentContainer/ContentContainer'

const ActualityPage: FunctionComponent = () => (
  <ContentContainer>
    <Container>
      <Row>
        <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
          <div>
            <Heading>Actualiteit</Heading>
            <div className="qa-page">{renderContents()}</div>
          </div>
        </Column>
      </Row>
    </Container>
  </ContentContainer>
)

function renderContents() {
  const [retryCount, setRetryCount] = useState(0)
  const promise = useMemo(() => getMetadata(), [retryCount])

  return (
    <PromiseResult<Metadata[]> promise={promise} onRetry={() => setRetryCount(retryCount + 1)}>
      {({ value }) => (
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
            {value.map((source) => (
              <tr className="c-table__content-row">
                {source.title && (
                  <td className="c-table__field c-table__content-field">{source.title}</td>
                )}
                <td className="c-table__field c-table__content-field">{source.update_frequency}</td>
                <td className="c-table__field c-table__content-field">
                  {source.data_modified_date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PromiseResult>
  )
}

export default ActualityPage
