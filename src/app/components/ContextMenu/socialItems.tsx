import { Email, FacebookPadded, Linkedin, Twitter } from '@amsterdam/asc-assets'
import { ContextMenuItem, Icon } from '@amsterdam/asc-ui'
import getShareUrl, { ShareTarget } from '../../../shared/services/share-url/share-url'

const socialItemsArray = [
  {
    id: 1,
    title: 'Facebook',
    link: ShareTarget.Facebook,
    icon: <FacebookPadded />,
  },
  {
    id: 2,
    title: 'Twitter',
    link: ShareTarget.Twitter,
    icon: <Twitter />,
  },
  {
    id: 3,
    title: 'Linkedin',
    link: ShareTarget.LinkedIn,
    icon: <Linkedin />,
  },
  {
    id: 4,
    title: 'E-mail',
    link: ShareTarget.Email,
    icon: <Email />,
  },
]

const socialItems = () => {
  const handlePageShare = (target: ShareTarget) => {
    const link = getShareUrl(target)
    if (link) {
      window.open(link.url, link.target)
    }
  }

  return socialItemsArray.map(({ link, title, icon, id }) => (
    <ContextMenuItem
      key={id}
      role="button"
      onClick={() => handlePageShare(link)}
      icon={
        <Icon inline size={24} padding={4}>
          {icon}
        </Icon>
      }
    >
      Deel via {title}
    </ContextMenuItem>
  ))
}

export default socialItems
