import { Link, List, ListItem } from '@amsterdam/asc-ui'
import { FunctionComponent } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import environment from '../../../environment'
import { ContentLink } from '../../../shared/config/content-links'
import { toArticleDetail } from '../../links'

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
