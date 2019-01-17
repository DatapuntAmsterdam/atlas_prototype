import get from 'lodash.get';
import { toGlossaryKey } from '../../../detail/services/endpoint-parser/endpoint-parser';
import GLOSSARY from '../../../detail/services/glossary.constant';
import { routing } from '../../../app/routes';
import { VIEW_MODE } from '../../ducks/ui/ui';
import { FETCH_DETAIL_SUCCESS } from '../../ducks/detail/constants';

export const homeDocumentTitle = (action, defaultTitle) => {
  let pageTitle = defaultTitle;
  const view = get(action, 'meta.query.view', '');
  const embed = get(action, 'meta.query.embed', 'false');
  if (view === VIEW_MODE.MAP) {
    pageTitle = 'Grote kaart';
    if (embed === 'true') {
      pageTitle = `${pageTitle} | Embeded`;
    }
  }

  return pageTitle;
};

export const detailDocumentTitle = (action, defaultTitle = 'UNKNOWN') => {
  const glossaryKey = toGlossaryKey(action.payload.type, action.payload.subtype);
  const glossaryDefinition = GLOSSARY.DEFINITIONS[glossaryKey];
  const label = glossaryDefinition ? glossaryDefinition.label_singular : defaultTitle;

  return `${label}: %display% `;
};

export const datasetDetailDocumentTitle = () => {
  const label = 'Datasets';

  return `${label}: %display% `;
};

export const detailDocumentTitleWithName = (action) => {
  // For now we fill the title for details in 2 steps
  const title = document.title
    .replace('%display%', action.payload.data._display)
    .replace(' - Dataportaal', '');
  return title;
};

const titleActionMapping = [
  {
    actionType: routing.home.type,
    getTitle: homeDocumentTitle
  },
  {
    actionType: routing.dataDetail.type,
    getTitle: detailDocumentTitle
  },
  {
    actionType: routing.datasetsDetail.type,
    getTitle: datasetDetailDocumentTitle
  },
  {
    actionType: FETCH_DETAIL_SUCCESS,
    getTitle: detailDocumentTitleWithName
  }
];

export default titleActionMapping;
