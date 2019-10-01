import React from 'react'
import { Enlarge } from '@datapunt/asc-assets'
import styled from '@datapunt/asc-core'
import { Button, CardContainer, Heading, svgFill, themeColor, themeSpacing } from '@datapunt/asc-ui'
import LoadingIndicator from '../../../shared/components/loading-indicator/LoadingIndicator'
import { EDITORIAL_TITLES } from '../../pages/EditorialOverviewPage/constants'
import EditorialCard from '../EditorialCard'

const EditorialCardContainer = styled(CardContainer)`
  padding: 0;
`

const StyledButton = styled(Button)`
  border-color: ${themeColor('tint', 'level7')};
  color: ${themeColor('tint', 'level7')};
  background: ${themeColor('tint', 'level1')};
  ${svgFill('tint', 'level7')};

  &:hover,
  &:focus {
    outline: 0;
    background: ${themeColor('tint', 'level3')};
  }
`

const PageHeading = styled(Heading)`
  margin-bottom: ${themeSpacing(4)};
  padding-bottom: ${themeSpacing(2)};
  border-bottom: 1px solid ${themeColor('tint', 'level3')};
`

const EditorialResults = ({ page, results, loading, type, links, onClickMore, showTitle }) => {
  return (
    <EditorialCardContainer>
      {page === 0 && loading ? (
        <LoadingIndicator style={{ position: 'inherit' }} />
      ) : (
        <>
          {showTitle && <PageHeading $as="h1">{EDITORIAL_TITLES[type]}</PageHeading>}
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
  )
}

EditorialResults.defaultProps = {
  showTitle: true,
}

export default EditorialResults
