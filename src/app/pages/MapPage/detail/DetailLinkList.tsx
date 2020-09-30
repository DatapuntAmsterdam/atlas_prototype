import { Link, Paragraph, themeSpacing } from '@amsterdam/asc-ui'
import React from 'react'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import { DetailResultItemLinkList } from '../../../../map/types/details'

export const LinkList = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledLink = styled(Link)`
  margin-bottom: ${themeSpacing(2)};
`

export interface DetailLinkListProps {
  item: DetailResultItemLinkList
}

const DetailLinkList: React.FC<DetailLinkListProps> = ({ item, ...otherProps }) => {
  const { trackEvent } = useMatomo()

  return item.links.length ? (
    <LinkList {...otherProps}>
      {/*
      // @ts-ignore */}
      {item.links.map(({ url, to, title }) => (
        // @ts-ignore
        <StyledLink
          inList
          onClick={() => {
            trackEvent({
              category: 'detail-page',
              action: 'navigate',
              name: title,
            })
          }}
          {...(url ? { target: '_blank', href: url } : { forwardedAs: RouterLink, to })}
        >
          {title}
        </StyledLink>
      ))}
    </LinkList>
  ) : (
    <Paragraph>Geen resultaten gevonden</Paragraph>
  )
}

export default DetailLinkList
