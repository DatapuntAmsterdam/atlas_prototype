/* eslint-disable no-nested-ternary */
import React from 'react'
import { Link, List, ListItem } from '@datapunt/asc-ui'
import RouterLink from 'redux-first-router-link'
import styled from 'styled-components'
import { toArticleDetail } from '../../../store/redux-first-router/actions'
import environment from '../../../environment'

export type FooterLink = {
  title: string
  id:
    | number
    | {
        development: string
        acceptance: string
        production: string
      }
  href?: string
  slug?: string
  order: number
  onClick?: (e: React.MouseEvent) => void
}

const Button = styled.button`
  background-color: transparent;
`

const FooterLinks: React.FC<{ links: FooterLink[] }> = ({ children, links }) => (
  <List>
    {links &&
      links.map(({ title, id, href, onClick, slug }) => {
        const linkId = !href ? id[environment.DEPLOY_ENV] || id : id

        return (
          <ListItem key={linkId}>
            {!href && !onClick ? (
              <Link
                darkBackground
                as={RouterLink}
                title={title}
                to={toArticleDetail(linkId, slug)}
                variant="with-chevron"
              >
                {title}
              </Link>
            ) : onClick ? (
              <Link
                darkBackground
                type="button"
                as={Button}
                title={title}
                variant="with-chevron"
                onClick={onClick}
              >
                Feedback geven
              </Link>
            ) : (
              <Link
                darkBackground
                key={linkId}
                title={title}
                href={href}
                rel="external noopener noreferrer"
                target="_blank"
                variant="with-chevron"
              >
                {title}
              </Link>
            )}
          </ListItem>
        )
      })}
    {children}
  </List>
)

export default FooterLinks
