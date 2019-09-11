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
