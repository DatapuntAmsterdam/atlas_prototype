import React from 'react'
import { FooterLinkList, FooterLinkListItem } from '@datapunt/asc-ui'
import { COLOFON_LINKS } from './services/footer-links'
import { toArticleDetail } from '../../../store/redux-first-router/actions'
import ActionLink from '../Links/ActionLink/ActionLink'

const ColofonLinks = () => (
  <FooterLinkList>
    {COLOFON_LINKS.map(({ title, id, slug }) => (
      <FooterLinkListItem key={id}>
        <ActionLink title={title} to={toArticleDetail(id, slug)} variant="with-chevron">
          {title}
        </ActionLink>
      </FooterLinkListItem>
    ))}
  </FooterLinkList>
)

export default ColofonLinks
