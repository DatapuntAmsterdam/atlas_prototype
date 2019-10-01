import PAGES from '../../pages'
import {
  toArticleDetail,
  toPublicationDetail,
  toSpecialDetail,
} from '../../../store/redux-first-router/actions'

export const EDITORIAL_TITLES = {
  [PAGES.ARTICLES]: 'Artikelen',
  [PAGES.PUBLICATIONS]: 'Publicaties',
  [PAGES.SPECIALS]: 'In beeld',
}

export const EDITORIAL_DETAIL_ACTIONS = {
  [PAGES.ARTICLES]: toArticleDetail,
  [PAGES.PUBLICATIONS]: toPublicationDetail,
  [PAGES.SPECIALS]: toSpecialDetail,
}

// Logic is that we don't show metadata in an editorial detail page
export const EDITORIAL_FIELD_TYPE_VALUES = {
  CONTENT: 'content',
}
