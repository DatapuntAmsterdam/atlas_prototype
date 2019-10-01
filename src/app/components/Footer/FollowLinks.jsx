import React from 'react'
import { FooterLinkList, FooterLinkListItem, Link } from '@datapunt/asc-ui'
import { FOLLOW_LINKS } from './services/footer-links'

const FollowLinks = () => (
  <FooterLinkList>
    {FOLLOW_LINKS.map(({ id, title, href }) => (
      <FooterLinkListItem key={id}>
        <Link
          title={title}
          href={href}
          rel="external noopener noreferrer"
          target="_blank"
          variant="with-chevron"
        >
          {title}
        </Link>
      </FooterLinkListItem>
    ))}
  </FooterLinkList>
)

export default FollowLinks
