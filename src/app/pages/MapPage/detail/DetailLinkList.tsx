import { Link, Paragraph, themeSpacing } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import React, { useMemo } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { DetailResultItemLinkList } from '../../../../map/types/details'
import buildDetailUrl from './buildDetailUrl'

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
  const location = useLocation()
  const { trackEvent } = useMatomo()

  const links = useMemo(
    () =>
      item.links.map((link) => {
        const url = link.external ? link.url : buildDetailUrl(link.url)
        return {
          ...link,
          url,
        }
      }),
    [location, item],
  )

  return links.length ? (
    <LinkList {...otherProps}>
      {links.map(({ url, title, external }) => (
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
          {...(external ? { target: '_blank', href: url } : { forwardedAs: RouterLink, to: url })}
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
