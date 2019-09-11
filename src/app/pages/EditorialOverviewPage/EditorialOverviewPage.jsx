import React from 'react'
import styled from '@datapunt/asc-core'
import { Button, CardContainer, Column, Heading, Row, themeColor, svgFill } from '@datapunt/asc-ui'
import { Enlarge } from '@datapunt/asc-assets'
import LoadingIndicator from '../../../shared/components/loading-indicator/LoadingIndicator'
import EditorialCard from '../../components/EditorialCard'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import './EditorialOverviewPage.scss'
import { EDITORIAL_TITLES } from './constants'

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

const EditorialOverviewPage = ({ page, loading, results, type, links, onClickMore }) => (
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
                <PageHeading $as="h1">{EDITORIAL_TITLES[type]}</PageHeading>

                {results && results.map(result => <EditorialCard {...result} />)}
                {page > 0 && loading && <LoadingIndicator />}
                {links &&
                  links.next &&
                  links.next.href !== 'None' &&
                  (loading ? (
                    <LoadingIndicator style={{ position: 'inherit' }} />
                  ) : (
                    <StyledButton
                      variant="primaryInverted"
                      iconLeft={<Enlarge />}
                      iconSize={12}
                      onClick={() => {
                        // Temporarily replace http:// as no changes will be made to JSON API
                        // until GraphQL API becomes available
                        const nextHref = links.next.href.replace('http://', 'https://')

                        onClickMore(nextHref)
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
)

export default EditorialOverviewPage
