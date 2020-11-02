import { Link as AscLink, Paragraph, themeSpacing } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import React, { HTMLAttributes } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import { DetailResultItemLinkList, Link } from '../../../../map/types/details'

export const LinkList = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledLink = styled(AscLink)`
  margin-bottom: ${themeSpacing(2)};
`

export interface DetailLinkListProps extends HTMLAttributes<HTMLDivElement> {
  item: DetailResultItemLinkList
}

const DetailLinkList: React.FC<DetailLinkListProps> = ({ item, ...otherProps }) => {
  const { trackEvent } = useMatomo()

  function trackClick(link: Link) {
    trackEvent({
      category: 'detail-page',
      action: 'navigate',
      name: link.title || 'unknown',
    })
  }

  return item.links?.length ? (
    <LinkList {...otherProps} data-testid="detail-linklist">
      {item.links.map((link) => {
        if ('url' in link) {
          return (
            <StyledLink
              key={link.url}
              inList
              onClick={() => trackClick(link)}
              target="_blank"
              href={link.url}
            >
              {link.title}
            </StyledLink>
          )
        }

        return (
          // @ts-ignore
          <StyledLink
            inList
            onClick={() => {
              trackClick(link)
            }}
            forwardedAs={RouterLink}
            to={link.to}
            key={link.title}
          >
            {link.title}
          </StyledLink>
        )
      })}
    </LinkList>
  ) : (
    <Paragraph data-testid="detail-linklist">Geen resultaten gevonden</Paragraph>
  )
}

export default DetailLinkList
