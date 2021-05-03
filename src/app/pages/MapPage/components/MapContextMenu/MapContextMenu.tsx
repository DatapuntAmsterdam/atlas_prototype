import { FunctionComponent, ReactNode } from 'react'
import {
  ChevronDown,
  Ellipsis,
  Embed,
  Print,
  Email,
  FacebookPadded,
  Linkedin,
  Twitter,
} from '@amsterdam/asc-assets'
import styled from 'styled-components'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import {
  ContextMenu as ContextMenuComponent,
  ContextMenuItem,
  Icon,
  themeSpacing,
} from '@amsterdam/asc-ui'
import getShareUrl, { ShareTarget } from '../../../../../shared/services/share-url/share-url'
import useDocumentTitle from '../../../../utils/useDocumentTitle'

const socialItemsArray: Array<{
  id: number
  title: string
  link: ShareTarget
  icon: ReactNode
}> = [
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

const StyledContextMenuComponent = styled(ContextMenuComponent)`
  margin-left: ${themeSpacing(0.5)};
  height: 100%;
  button {
    height: inherit;
    border: none;
  }
`

const MapContextMenu: FunctionComponent = () => {
  const { trackEvent } = useMatomo()
  const { documentTitle } = useDocumentTitle()
  const handlePageShare = (target: ShareTarget) => {
    trackEvent({
      category: 'menu',
      action: `menu-delen-${target}`,
      name: documentTitle,
    })

    const link = getShareUrl(target)
    if (link) {
      window.open(link.url, link.target)
    }
  }
  return (
    <StyledContextMenuComponent
      data-test="context-menu"
      title="Actiemenu"
      arrowIcon={<ChevronDown />}
      icon={
        <Icon padding={4} inline size={24}>
          <Ellipsis />
        </Icon>
      }
      position="bottom"
    >
      <ContextMenuItem
        role="button"
        data-test="print"
        divider
        onClick={() => window.print()}
        icon={
          <Icon padding={4} inline size={24}>
            <Print />
          </Icon>
        }
      >
        Printen
      </ContextMenuItem>

      <ContextMenuItem
        role="button"
        data-test="context-menu-embed"
        divider
        onClick={async () => {
          const params = new URLSearchParams(window.location.search)
          params.set('embed', 'true')
          await navigator.clipboard.writeText(
            `${window.location.origin}${window.location.pathname}?${params.toString()}`,
          )
          // eslint-disable-next-line no-alert
          alert('Embed URL is gekopieerd naar klembord')
        }}
        icon={
          <Icon padding={4} inline size={24}>
            <Embed />
          </Icon>
        }
      >
        Kopiëer embed link
      </ContextMenuItem>
      {socialItemsArray.map(({ link, title, icon, id }) => (
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
      ))}
    </StyledContextMenuComponent>
  )
}

export default MapContextMenu