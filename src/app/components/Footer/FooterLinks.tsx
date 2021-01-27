import { Link, List, ListItem } from '@amsterdam/asc-ui'
import { FunctionComponent } from 'react'
import RouterLink from 'redux-first-router-link'
import environment from '../../../environment'
import { ContentLink } from '../../../shared/config/content-links'
import { toArticleDetail } from '../../../store/redux-first-router/actions'

export interface FooterLinksProps {
  links: ContentLink[]
}

const FooterLinks: FunctionComponent<FooterLinksProps> = ({ children, links }) => (
  <List>
    {links.map((link) => {
      if ('href' in link) {
        return (
          <ListItem key={link.href}>
            <Link
              darkBackground
              href={link.href}
              rel="external noopener noreferrer"
              target="_blank"
              inList
              data-testid={`footerLink${link.testId}`}
            >
              {link.title}
            </Link>
          </ListItem>
        )
      }

      const linkId: string = link.id[environment.DEPLOY_ENV]

      return (
        <ListItem key={linkId}>
          <Link
            darkBackground
            as={RouterLink}
            to={toArticleDetail(linkId, link.slug)}
            inList
            data-testid={`footerLink${link.testId}`}
          >
            {link.title}
          </Link>
        </ListItem>
      )
    })}
    {children}
  </List>
)

export default FooterLinks
