/* eslint-disable camelcase */
import { breakpoint, Column, Row, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import CardList from '../CardList'
import type { NormalizedFieldItems } from '../../../../../normalizations/cms/types'

export interface CMSCollectionList {
  field_title: string
  field_content: NormalizedFieldItems[]
}

const StyledRow = styled(Row)`
  width: 100%;
`

const StyledOuterColumn = styled(Column)`
  background-color: ${themeColor('tint', 'level2')};
  padding: ${themeSpacing(8, 5, 0)}; // Padding on the right is added by the last rendered child
`

const StyledInnerRow = styled(Row)`
  flex-grow: 1;
`

const StyledColumn = styled(Column)`
  margin-right: ${themeSpacing(5)};
  margin-bottom: ${themeSpacing(8)};

  :nth-child(4n) {
    margin-right: 0;
  }

  @media screen and ${breakpoint('max-width', 'laptop')} {
    :nth-child(even) {
      margin-right: 0;
    } // There are only two CardList components on this breakpoint
  }

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    margin-right: 0;
  }
`

export interface CardListBlockProps {
  results?: CMSCollectionList[]
  loading: boolean
}

const CardListBlock: FunctionComponent<CardListBlockProps> = ({
  results,
  loading,
  ...otherProps
}) => (
  <StyledRow hasMargin={false} {...otherProps}>
    <StyledOuterColumn
      span={{
        small: 1,
        medium: 2,
        big: 6,
        large: 12,
        xLarge: 12,
      }}
    >
      <StyledInnerRow halign="flex-start" hasMargin={false}>
        {results &&
          results.map(({ field_title: title, field_content }) => (
            <StyledColumn
              key={title}
              wrap
              span={{ small: 1, medium: 2, big: 3, large: 3, xLarge: 3 }}
            >
              <CardList title={title} loading={loading} results={field_content} />
            </StyledColumn>
          ))}
      </StyledInnerRow>
    </StyledOuterColumn>
  </StyledRow>
)

export default CardListBlock
