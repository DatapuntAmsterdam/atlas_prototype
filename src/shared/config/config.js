import cmsConfig from './cms.config'

const IDS = {
  main: 'main',
  footer: 'footer',
  searchbar: 'auto-suggest__input',
}

const {
  FOOTER: FOOTER_LINKS,
  HEADER: HEADER_LINKS,
  HOMEPAGE: HOMEPAGE_LINKS,
  NAVIGATION: NAVIGATION_LINKS,
  CONTENT_REDIRECTS: CONTENT_REDIRECT_LINKS,
  SHORTLINKS,
} = require('./content-links.json')

export {
  cmsConfig,
  FOOTER_LINKS,
  HEADER_LINKS,
  NAVIGATION_LINKS,
  HOMEPAGE_LINKS,
  CONTENT_REDIRECT_LINKS,
  SHORTLINKS,
  IDS,
}
