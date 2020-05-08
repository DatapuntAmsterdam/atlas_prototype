import React from 'react'
import styled from 'styled-components'
import {
  Card,
  CardContent,
  Link,
  Heading,
  Paragraph,
  themeColor,
  themeSpacing,
  Tag,
} from '@datapunt/asc-ui'
import RouterLink from 'redux-first-router-link'
import focusOutline from '../shared/focusOutline'

const StyledHeading = styled(Heading)`
  border-bottom: 2px solid transparent;
  line-height: 22px;
  margin-bottom: ${themeSpacing(3)};
  width: fit-content;
  display: inline-block;
`

const StyledLink = styled(Link)`
  border-bottom: ${themeColor('tint', 'level3')} 1px solid;
  width: 100%;
  min-height: 66px;

  &:hover {
    border-bottom: ${themeColor('secondary')} 1px solid;

    ${StyledHeading} {
      color: ${themeColor('secondary')};
      border-color: ${themeColor('secondary')};
    }
  }

  &:focus {
    background: none;
    position: relative;

    ${focusOutline()}
  }
`

const StyledCard = styled(Card)`
  align-items: stretch;
  padding: 0;
`

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  padding: 0;
  position: relative;
`

const StyledParagraph = styled(Paragraph)`
  display: flex;
  padding-bottom: ${themeSpacing(4)};
`

const MetaText = styled(StyledParagraph)`
  color: ${themeColor('tint', 'level5')};
  font-size: 14px;
  line-height: 1.25;
`

const StyledTag = styled(Tag)`
  margin-right: ${themeSpacing(1)};
`

const DatasetCard = ({
  id,
  shortTitle,
  teaser,
  lastModified,
  modified,
  distributionTypes,
  to,
  ...otherProps
}) => (
  <StyledLink
    {...{
      forwardedAs: RouterLink,
      key: id,
      to,
      title: shortTitle,
      linkType: 'blank',
      ...otherProps,
    }}
  >
    <StyledCard horizontal>
      <StyledCardContent>
        <div>
          <StyledHeading forwardedAs="h4">{shortTitle}</StyledHeading>
        </div>

        <div>
          <MetaText as="time" data-test="metaText" datetime={modified}>
            {lastModified}
          </MetaText>
        </div>

        <div>
          <StyledParagraph dangerouslySetInnerHTML={{ __html: teaser }} />
        </div>

        <div>
          <MetaText data-test="metaText">
            {distributionTypes &&
              distributionTypes.length > 0 &&
              distributionTypes.map((distributionType) => (
                <StyledTag key={distributionType} colorType="tint" colorSubtype="level3">
                  {distributionType}
                </StyledTag>
              ))}
          </MetaText>
        </div>
      </StyledCardContent>
    </StyledCard>
  </StyledLink>
)

export default DatasetCard
