import {
  cmsIds,
  OVER_OIS,
  RESOURCES,
  ABOUT_SITE,
  AMSTERDAM_EN_DATA,
} from '../../../../shared/config/cms.config'

export const COLOFON_LINKS = [
  {
    title: 'Over deze site',
    menuTitle: 'Onderzoek, Informatie en Statistiek',
    id: cmsIds[ABOUT_SITE],
    slug: ABOUT_SITE,
  },
  { title: 'Over OIS', menuTitle: 'Onderzoek', id: cmsIds[OVER_OIS], slug: OVER_OIS },
  {
    title: 'Databeleid',
    menuTitle: 'Databeleid',
    id: cmsIds[AMSTERDAM_EN_DATA],
    slug: AMSTERDAM_EN_DATA,
  },
  { title: 'Bronnen', menuTitle: 'Bronnen', id: cmsIds[RESOURCES], slug: RESOURCES },
]

export const FOLLOW_LINKS = [
  {
    id: 0,
    title: 'Nieuwsbrief OIS',
    href:
      'https://www.amsterdam.nl/nieuwsbrieven/bestuur-organisatie/dienstverlening/nieuwsbrief-data/nieuwsbrief-data/',
  },
  { id: 1, title: 'Twitter', href: 'https://twitter.com/AmsterdamNL' },
  { id: 2, title: 'Facebook', href: 'https://www.facebook.com/gemeenteamsterdam' },
  { id: 3, title: 'LinkedIn', href: 'https://www.linkedin.com/company/gemeente-amsterdam' },
  { id: 4, title: 'GitHub', href: 'https://github.com/Amsterdam' },
]
