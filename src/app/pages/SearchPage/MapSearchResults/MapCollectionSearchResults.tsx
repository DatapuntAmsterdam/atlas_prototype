import { ChevronDown, ChevronUp, MapLayers } from '@datapunt/asc-assets'
import {
  breakpoint,
  Button,
  Card,
  CardContent,
  Heading,
  Icon,
  Link,
  themeColor,
  themeSpacing,
} from '@datapunt/asc-ui'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import environment from '../../../../environment'

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: -${themeSpacing(6)};
`

const CardWrapper = styled.div`
  width: 100%;
  margin-bottom: ${themeSpacing(6)};
  @media screen and ${breakpoint('min-width', 'laptop')} {
    width: calc(50% - (${themeSpacing(6)} / 2));

    &:nth-of-type(2n) {
      margin-left: ${themeSpacing(6)};
    }
  }
`

const StyledCard = styled(Card)`
  width: 100%;
  border: ${themeColor('tint', 'level3')} 1px solid;
`

const StyledCardContent = styled(CardContent)`
  padding: ${themeSpacing(4)};
  margin-bottom: auto;
`

const CardHeader = styled(Link)`
  display: flex;
  width: 100%;
`

const CardHeadingContainer = styled.div`
  display: flex;
  width: 100%;
  padding: ${themeSpacing(2)};
  margin-bottom: auto;
`

const CardImage = styled.img`
  max-height: ${themeSpacing(18)};
`

const CardHeaderIcon = styled(Icon)`
  margin-right: ${themeSpacing(2)};
  fill: ${themeColor('support', 'valid')};
`

const CardHeaderHeading = styled(Heading)`
  margin: auto 0;
  color: ${themeColor('tint', 'level7')};
`

const List = styled.ul`
  margin: 0;
  list-style: inside;
  font-weight: bold;
  line-height: ${themeSpacing(7)};
`

const IntroText = styled.span`
  display: block;
  margin-bottom: ${themeSpacing(2)};
`

const StyledButton = styled(Button)<{ hasMarginBottom: boolean }>`
  height: auto;
  padding: 0;
  margin-top: ${themeSpacing(4)};
  margin-bottom: ${({ hasMarginBottom }) => (hasMarginBottom ? themeSpacing(4) : 0)};
  color: ${themeColor('primary', 'main')};
`

const StyledIcon = styled(Icon)`
  margin-left: ${themeSpacing(1)};
  fill: ${themeColor('primary', 'main')};
`

export interface MapCollectionSearchResultsProps {
  // TODO: Properly type the results
  results: any[]
}

const MAX_ITEMS = 4

const MapCollectionSearchResults: React.FC<MapCollectionSearchResultsProps> = ({ results }) => (
  <CardContainer>
    {results.map((result) => (
      <MapCollectionCard key={result.id} result={result} />
    ))}
  </CardContainer>
)

interface MapCollectionCardProps {
  result: any
}

const MapCollectionCard: React.FC<MapCollectionCardProps> = ({ result }) => {
  const [expanded, setExpanded] = useState(false)
  const visibleLayers = result.mapLayers.slice(0, MAX_ITEMS)
  const hiddenLayers = result.mapLayers.slice(MAX_ITEMS)

  const handleOnClick = useCallback(() => setExpanded((value) => !value), [])

  return (
    <CardWrapper>
      <StyledCard>
        <CardHeader href={result.href}>
          <CardImage src={environment.CMS_ROOT + result.meta.thumbnail} alt="" />
          <CardHeadingContainer>
            <CardHeaderIcon inline size={16}>
              <MapLayers />
            </CardHeaderIcon>
            <CardHeaderHeading as="h4">{result.title}</CardHeaderHeading>
          </CardHeadingContainer>
        </CardHeader>
        <StyledCardContent>
          <IntroText>Deze kaartcollectie bevat de volgende kaartlagen:</IntroText>
          <List>
            {visibleLayers.map((layer: any) => (
              <li key={layer.id}>{layer.title}</li>
            ))}
          </List>
          {hiddenLayers.length > 0 && (
            <StyledButton variant="blank" onClick={handleOnClick} hasMarginBottom={expanded}>
              {expanded ? 'Toon minder' : 'Toon meer'}
              <StyledIcon inline size={14}>
                {expanded ? <ChevronUp /> : <ChevronDown />}
              </StyledIcon>
            </StyledButton>
          )}
          {expanded && (
            <List>
              {hiddenLayers.map((layer: any) => (
                <li key={layer.id}>{layer.title}</li>
              ))}
            </List>
          )}
        </StyledCardContent>
      </StyledCard>
    </CardWrapper>
  )
}

export default MapCollectionSearchResults
