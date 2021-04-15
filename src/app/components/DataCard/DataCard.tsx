import {
  Card,
  CardContent,
  CardMedia,
  Heading,
  Icon,
  Link,
  Paragraph,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import { Fragment, FunctionComponent } from 'react'
import RouterLink from 'redux-first-router-link'
import styled from 'styled-components'
import { ViewMode } from '../../../shared/ducks/ui/ui'
import { toDataSearchType, toDetailFromEndpoint } from '../../../store/redux-first-router/actions'
import formatCount from '../../utils/formatCount'
import DataIcon, { DataIconType } from './DataIcon'
import { DataResult } from '../../pages/SearchPage/types'

const StyledLink = styled(Link)`
  cursor: pointer;
`

const StyledCard = styled(Card)`
  border: ${themeColor('tint', 'level3')} 1px solid;
  justify-content: flex-start;
  width: inherit;
`

const StyledCardContent = styled(CardContent)`
  padding: ${themeSpacing(2)};
  min-height: inherit;
  width: calc(100% - ${themeSpacing(19)});
`

const StyledCardMedia = styled(CardMedia)`
  max-width: ${themeSpacing(19)};
`

const StyledParagraph = styled(Paragraph)`
  white-space: nowrap;
  overflow: hidden;
  display: block;
  text-overflow: ellipsis;
`

const StyledParagraphLink = styled(Link)`
  font-weight: normal;
  color: inherit;
`

const StyledIcon = styled(Icon)`
  background: ${themeColor('tint', 'level2')};
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  & svg {
    width: 60px;
    height: 60px;
  }
`

const ParagraphWrapper = styled.div`
  flex-wrap: nowrap;
  max-width: 800px;
`

interface DataCardProps {
  type: DataIconType
  label: string
  count: number
  results: DataResult[]
}

const DataCard: FunctionComponent<DataCardProps> = ({
  type,
  label,
  count,
  results,
  ...otherProps
}) => (
  <StyledCard key={type} horizontal {...otherProps}>
    <StyledCardMedia>
      <StyledIcon>
        <DataIcon type={type} />
      </StyledIcon>
    </StyledCardMedia>
    <StyledCardContent>
      <div>
        <Heading as="h3" styleAs="h4">
          <StyledLink
            forwardedAs={RouterLink}
            to={toDataSearchType(type)}
          >{`${label} (${formatCount(count)})`}</StyledLink>
        </Heading>
      </div>

      <ParagraphWrapper>
        <StyledParagraph>
          {results?.map(({ id, endpoint, label: itemLabel }, index) => (
            <Fragment key={id}>
              <StyledParagraphLink
                to={toDetailFromEndpoint(endpoint, ViewMode.Split)}
                forwardedAs={RouterLink}
              >
                {itemLabel}
              </StyledParagraphLink>
              {index !== results.length - 1 ? `, ` : ''}
            </Fragment>
          ))}
        </StyledParagraph>
      </ParagraphWrapper>
    </StyledCardContent>
  </StyledCard>
)

export default DataCard
