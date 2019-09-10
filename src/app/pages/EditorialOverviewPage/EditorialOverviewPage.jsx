import React from 'react'
import styled from '@datapunt/asc-core'
import {
  Button,
  CardContainer,
  Container,
  Column,
  Heading,
  Row,
  themeColor,
  svgFill,
} from '@datapunt/asc-ui'
import { Enlarge } from '@datapunt/asc-assets'
import LoadingIndicator from '../../../shared/components/loading-indicator/LoadingIndicator'
import PAGES from '../../pages'
import EditorialCard from '../../components/EditorialCard'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import Footer from '../../components/Footer/Footer'
import useFromCMS from '../../utils/useFromCMS'
import cmsConfig from '../../../shared/services/cms/cms-config'
import {
  toPublicationDetail,
  toArticleDetail,
  toSpecialDetail,
} from '../../../store/redux-first-router/actions'
import linkAttributesFromAction from '../../../shared/services/link-attributes-from-action/linkAttributesFromAction'

import './EditorialOverviewPage.scss'

const title = {
  [PAGES.ARTICLES]: 'Artikelen',
  [PAGES.PUBLICATIONS]: 'Publicaties',
  [PAGES.SPECIALS]: 'In beeld',
}

const toDetailPage = {
  [PAGES.ARTICLES]: toArticleDetail,
  [PAGES.PUBLICATIONS]: toPublicationDetail,
  [PAGES.SPECIALS]: toSpecialDetail,
}

const PageHeading = styled(Heading)`
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${themeColor('tint', 'level3')};
`

const EditorialCardContainer = styled(CardContainer)`
  padding: 0;
`

const StyledButton = styled(Button)`
  border-color: ${themeColor('tint', 'level7')};
  color: ${themeColor('tint', 'level7')};
  background: #fff;
  ${svgFill('tint', 'level7')};

  &:hover,
  &:focus {
    outline: 0;
    background: ${themeColor('tint', 'level3')};
  }
`

const EditorialOverviewPage = ({ type = '' }) => {
  const { results, fetchData, loading } = useFromCMS(cmsConfig[type])
  const { data, links } = results || {}
  const [aggregatedData, setData] = React.useState([])
  const [page, setPage] = React.useState(0)

  React.useEffect(() => {
    fetchData()
  }, [])

  React.useEffect(() => {
    if (data) {
      setData([...aggregatedData, ...data])
      setPage(page + 1)
    }
  }, [data])

  return (
    <Container className="editorial-overview" beamColor="valid">
      <div className="editorial-overview__body">
        <Row>
          <ContentContainer>
            <Column
              wrap
              span={{ small: 12, medium: 12, big: 12, large: 12, xLarge: 9 }}
              push={{ small: 0, medium: 0, big: 0, large: 0, xLarge: 1 }}
            >
              <EditorialCardContainer>
                {page === 0 && loading ? (
                  <LoadingIndicator style={{ position: 'inherit' }} />
                ) : (
                  <>
                    <PageHeading $as="h1">{title[type]}</PageHeading>

                    {aggregatedData.length &&
                      aggregatedData.map(dataItem => {
                        const { href } = linkAttributesFromAction(
                          dataItem.field_special_type
                            ? toDetailPage[type](
                                dataItem.id,
                                dataItem.field_special_type,
                                dataItem.field_slug,
                              )
                            : toDetailPage[type](dataItem.id, dataItem.field_slug),
                        )

                        return <EditorialCard key={dataItem.id} dataItem={dataItem} href={href} />
                      })}

                    {page > 0 && loading && <LoadingIndicator />}

                    {links &&
                      links.next &&
                      (loading ? (
                        <LoadingIndicator style={{ position: 'inherit' }} />
                      ) : (
                        <StyledButton
                          variant="primaryInverted"
                          iconLeft={<Enlarge />}
                          iconSize={12}
                          onClick={() => {
                            // Temporarily replace http:// as no changes will be made to JSON API
                            // untill GraphQL API becomes available
                            const nextHref = links.next.href.replace('http://', 'https://')

                            fetchData(nextHref)
                          }}
                        >
                          Toon meer
                        </StyledButton>
                      ))}
                  </>
                )}
              </EditorialCardContainer>
            </Column>
          </ContentContainer>
        </Row>
      </div>
      <Footer />
    </Container>
  )
}

export default EditorialOverviewPage
