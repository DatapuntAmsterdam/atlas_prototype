import { FunctionComponent } from 'react'
import { Card, CardContent, Heading, Paragraph, themeSpacing } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'
import OverviewLink from './OverviewLink'
import { NormalizedFieldItems } from '../../../normalizations/cms/types'

const StyledCard = styled(Card)<{ isLoading: boolean }>`
  border-top: 2px solid;
  align-items: flex-start;
  height: 100%;
  width: 100%;

  // Override the margin-bottom of the Card component when used in a CardContainer
  && {
    margin-bottom: 0;
  }

  ${({ isLoading }) =>
    !isLoading &&
    css`
      background-color: inherit;
    `}
`

const StyledCardContent = styled(CardContent)`
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const StyledHeading = styled(Heading)`
  margin: ${themeSpacing(3, 0, 6)};
`

const StyledParagraph = styled(Paragraph)`
  height: 100%;

  // Override the margin-bottom of the Paragraph component
  && {
    margin-bottom: ${themeSpacing(6)};
  }
`

interface OrganizationCardProps
  extends Pick<NormalizedFieldItems, 'shortTitle' | 'title' | 'teaser' | 'intro' | 'linkProps'> {
  loading: boolean
}

const OrganizationCard: FunctionComponent<OrganizationCardProps> = ({
  loading,
  title,
  shortTitle,
  teaser,
  intro,
  linkProps,
}) => (
  <StyledCard isLoading={loading}>
    <StyledCardContent>
      <StyledHeading forwardedAs="h3">{shortTitle || title}</StyledHeading>
      {teaser ||
        (intro && <StyledParagraph dangerouslySetInnerHTML={{ __html: teaser || intro }} />)}

      <div>
        <OverviewLink
          linkProps={{
            ...linkProps,
            title: `Lees meer over ${shortTitle || title}`, // More descriptive title attribute (A11Y)
          }}
          label="Lees meer"
        />
      </div>
    </StyledCardContent>
  </StyledCard>
)

export default OrganizationCard
