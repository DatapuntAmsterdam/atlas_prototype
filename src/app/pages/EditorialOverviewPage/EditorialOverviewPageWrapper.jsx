/* eslint-disable camelcase */
import React from 'react'
import { Container } from '@datapunt/asc-ui'
import Footer from '../../components/Footer/Footer'
import useFromCMS from '../../utils/useFromCMS'
import cmsConfig from '../../../shared/services/cms/cms.config'

import './EditorialOverviewPage.scss'
import linkAttributesFromAction from '../../../shared/services/link-attributes-from-action/linkAttributesFromAction'
import { EDITORIAL_DETAIL_ACTIONS } from './constants'
import EditorialOverviewPage from './EditorialOverviewPage'

const EditorialOverviewPageWrapper = ({ type = '' }) => {
  const { results, fetchData, loading } = useFromCMS(cmsConfig[type])
  const { data, links } = results || {}
  const [aggregatedData, setData] = React.useState([])
  const [page, setPage] = React.useState(0)

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

  let normalizedResults = []

  if (aggregatedData && aggregatedData.length) {
    normalizedResults = aggregatedData.map(dataItem => {
      const { href } = linkAttributesFromAction(
        dataItem.field_special_type
          ? EDITORIAL_DETAIL_ACTIONS[type](
              dataItem.id,
              dataItem.field_special_type,
              dataItem.field_slug,
            )
          : EDITORIAL_DETAIL_ACTIONS[type](dataItem.id, dataItem.field_slug),
      )

      const {
        id,
        title,
        teaserImageUrl,
        field_short_title,
        field_teaser,
        field_intro,
        field_special_type,
        localeDate,
      } = dataItem

      return {
        key: dataItem.nid,
        id,
        title,
        teaserImageUrl,
        shortTitle: field_short_title,
        teaser: field_teaser,
        intro: field_intro,
        specialType: field_special_type,
        localeDate,
        href,
      }
    })
  }

  return (
    <Container className="editorial-overview" beamColor="valid">
      <EditorialOverviewPage
        {...{ type, aggregatedData, page, loading, links }}
        results={normalizedResults}
        onClickMore={fetchData}
      />
      <Footer />
    </Container>
  )
}

export default EditorialOverviewPageWrapper
