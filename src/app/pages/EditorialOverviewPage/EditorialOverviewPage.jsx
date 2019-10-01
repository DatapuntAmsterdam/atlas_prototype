/* eslint-disable camelcase */
import React from 'react'
import { Column, Container, Row } from '@datapunt/asc-ui'
import useFromCMS from '../../utils/useFromCMS'
import cmsConfig from '../../../shared/config/cms.config'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import EditorialResults from '../../components/EditorialResults'

const EditorialOverviewPage = ({ type = '' }) => {
  const { results, fetchData, loading } = useFromCMS(cmsConfig[type], undefined, false)
  const [aggregatedData, setData] = React.useState([])
  const [page, setPage] = React.useState(0)
  const { data, links } = results || {}

  React.useEffect(() => {
    ;(async () => {
      await fetchData()
    })()
  }, [])

  React.useEffect(() => {
    if (data) {
      setData([...aggregatedData, ...data])
      setPage(page + 1)
    }
  }, [data])

  return (
    <Container>
      <Row>
        <ContentContainer>
          <Column
            wrap
            span={{ small: 12, medium: 12, big: 12, large: 12, xLarge: 9 }}
            push={{ small: 0, medium: 0, big: 0, large: 0, xLarge: 1 }}
          >
            <EditorialResults
              {...{
                page,
                loading,
                results: aggregatedData,
                type,
                links,
                onClickMore: fetchData,
              }}
            />
          </Column>
        </ContentContainer>
      </Row>
    </Container>
  )
}

export default EditorialOverviewPage
