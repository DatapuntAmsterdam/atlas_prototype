export enum ShareTarget {
  Facebook = 'facebook',
  Twitter = 'twitter',
  LinkedIn = 'linkedin',
  Email = 'email',
  Print = 'printversie',
}

export interface ShareDescriptor {
  url: string
  target: string
}

export default function getShareUrl(target: ShareTarget): ShareDescriptor | null {
  const { href } = window.location
  const { title } = window.document

  switch (target) {
    case ShareTarget.Facebook:
      return {
        url: `https://www.facebook.com/sharer/sharer.php?u=${href}&og:title=${title}`,
        target: '_blank',
      }
    case ShareTarget.Twitter:
      return {
        url: `https://twitter.com/intent/tweet?url=${href}&text=${title}`,
        target: '_blank',
      }
    case ShareTarget.LinkedIn:
      return {
        url: `https://www.linkedin.com/shareArticle?url=${href}&mini=true&title=${title}`,
        target: '_blank',
      }
    case ShareTarget.Email:
      return {
        url: `mailto:?subject=Gemaild vanaf data.amsterdam.nl&body=Zie: ${escape(href)}`,
        target: '_self',
      }
    default:
      return null
  }
}
