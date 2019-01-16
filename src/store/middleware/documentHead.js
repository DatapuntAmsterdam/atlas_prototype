import get from 'lodash.get';
import { routing } from '../../app/routes';
import documentTitleRouteMapping from '../../shared/services/document-title/document-title';

const TITLE_SUFFIX = 'Dataportaal';
const TITLE_DEFAULT = 'Dataportaal';

const getDefaultDocumentTitle = (page) => () => get(routing, `[${page}].title`, TITLE_DEFAULT);

const documentHead = () => (next) => (action) => {
  const typeIsRoute = Object.keys(routing).map((key) => routing[key].type).includes(action.type);
  if (typeIsRoute) {
    const page = Object.keys(routing).find((key) => routing[key].type === action.type);
    const pageType = get(routing, `[${page}].type`, '');

    const titleResolver = documentTitleRouteMapping.filter(
      (item) => pageType === item.route
    )[0];

    const getTitle = get(titleResolver, 'getTitle', getDefaultDocumentTitle(page));
    const pageTitle = getTitle(action, getDefaultDocumentTitle(page)());

    document.title = `${pageTitle} - ${TITLE_SUFFIX}`;
  }
  return next(action);
};

export default documentHead;
