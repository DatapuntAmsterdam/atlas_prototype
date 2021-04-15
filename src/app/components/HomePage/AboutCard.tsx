import {
  Card,
  CardContent,
  Heading,
  Link,
  Paragraph,
  styles,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { NormalizedFieldItems } from '../../../normalizations/cms/types'

const StyledCard = styled(Card)`
  width: 100%;
  height: 100%;
  pointer-events: none; /* FF 60 fix */
`

const StyledCardContent = styled(CardContent)`
  padding: ${themeSpacing(5, 4)};
`

const StyledLink = styled(Link)`
  width: 100%;
  height: 100%;

  &:hover {
    ${StyledCard} {
      box-shadow: 2px 2px ${themeColor('secondary')};
    }

    ${styles.HeadingStyle} {
      color: ${themeColor('secondary')};
      text-decoration: underline;
    }
  }

  &:focus {
    background: none;
    position: relative;
  }
`

// TODO: Instead of picking props and spreading them the data should be passed as a single prop.
interface AboutCardProps
  extends Pick<NormalizedFieldItems, 'shortTitle' | 'title' | 'teaser' | 'intro' | 'linkProps'> {
  loading: boolean
}

const AboutCard: FunctionComponent<AboutCardProps> = ({
  loading,
  shortTitle,
  title,
  teaser,
  intro,
  linkProps,
}) => (
  <StyledLink {...linkProps} variant="blank">
    <StyledCard backgroundColor="level2" shadow isLoading={loading}>
      <StyledCardContent>
        <Heading as="h3">{shortTitle ?? title}</Heading>
        <Paragraph dangerouslySetInnerHTML={{ __html: teaser ?? intro ?? '' }} />)
      </StyledCardContent>
    </StyledCard>
  </StyledLink>
)

export default AboutCard
