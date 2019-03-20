import get from 'lodash.get';
import { toGlossaryKey } from '../../../detail/services/endpoint-parser/endpoint-parser';
import GLOSSARY from '../../../detail/services/glossary.constant';
import { routing } from '../../../app/routes';
import { VIEW_MODE } from '../../ducks/ui/ui';
import { FETCH_DETAIL_SUCCESS } from '../../ducks/detail/constants';
import PARAMETERS from '../../../store/parameters';

export const mapDocumentTitle = (action, defaultTitle) => {
  let pageTitle = defaultTitle;
  const view = get(action, `meta.query[${PARAMETERS.VIEW}]`, '');
  const embed = get(action, `meta.query[${PARAMETERS.EMBED}]`, 'false');
  if (view === VIEW_MODE.MAP) {
    pageTitle = 'Grote kaart';
  }
  if (embed === 'true') {
    pageTitle = `${pageTitle} | Embedded`;
  }

  return pageTitle;
};

export const detailDocumentTitle = (action, defaultTitle = 'UNKNOWN') => {
  const glossaryKey = toGlossaryKey(action.payload.type, action.payload.subtype);
  const glossaryDefinition = GLOSSARY.DEFINITIONS[glossaryKey];
  let label = glossaryDefinition ? glossaryDefinition.label_singular : defaultTitle;
  const embed = get(action, `meta.query[${PARAMETERS.EMBED}]`, 'false');

  if (embed === 'true') {
    label = `${label} | Embedded`;
  }

  return `${label}`;
};

export const datasetDetailDocumentTitle = () => {
  const label = 'Dataset';

  return `${label}`;
};

export const detailDocumentTitleWithName = (action) => {
  // We fill the title for details in 2 steps
  let title = document.title.replace(' - Dataportaal', '');

  const isDataset = !!get(action, 'payload.data.editDatasetId', null);
  if (isDataset && title.indexOf(':') === -1) {
    title = `${title}: ${action.payload.data._display}`;
  }

  return title;
};

const titleActionMapping = [
  {
    actionType: routing.data.type,
    getTitle: mapDocumentTitle
  },
  {
    actionType: routing.dataDetail.type,
    getTitle: detailDocumentTitle
  },
  {
    actionType: routing.datasetDetail.type,
    getTitle: datasetDetailDocumentTitle
  },
  {
    actionType: FETCH_DETAIL_SUCCESS,
    getTitle: detailDocumentTitleWithName
  }
];

export default titleActionMapping;
