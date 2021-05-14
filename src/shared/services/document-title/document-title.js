import { isEmbeddedParam, viewParam } from '../../../app/pages/MapPage/query-params'
import { routing } from '../../../app/routes'
import GLOSSARY from '../../../detail/services/glossary.constant'
import { FETCH_DETAIL_SUCCESS } from '../../ducks/detail/constants'
import { ViewMode } from '../../ducks/ui/ui'

export const mapDocumentTitle = (action, defaultTitle) => {
  let pageTitle = defaultTitle
  const view = action?.meta?.query?.[viewParam.name] ?? ''
  const embed = action?.meta?.query?.[isEmbeddedParam.name] ?? 'false'

  if (view === ViewMode.Map) {
    pageTitle = 'Grote kaart'
  }
  if (embed === 'true') {
    pageTitle = `${pageTitle} | Embedded`
  }

  return pageTitle
}

export const detailDocumentTitle = (action, defaultTitle = 'UNKNOWN') => {
  const glossaryKey =
    action.payload.subtype && action.payload.subtype.toUpperCase().replace(/-/g, '_')
  const glossaryDefinition = GLOSSARY.DEFINITIONS[glossaryKey]
  let label = glossaryDefinition ? glossaryDefinition.singular : defaultTitle
  const embed = action?.meta?.query?.[isEmbeddedParam.name] ?? 'false'

  if (embed === 'true') {
    label = `${label} | Embedded`
  }

  return `${label}`
}

export const datasetDetailDocumentTitle = () => {
  const label = 'Dataset'

  return `${label}`
}

export const detailDocumentTitleWithName = (action) => {
  // We fill the title for details in 2 steps
  let title = document.title.replace(' - Data en informatie - Amsterdam', '')

  const dataSetId = action?.payload?.data?.editDatasetId ?? null

  if (dataSetId !== null && title.indexOf(':') === -1) {
    // eslint-disable-next-line no-underscore-dangle
    title = `${title}: ${action.payload.data._display}`
  }

  return title
}

const titleActionMapping = [
  {
    actionType: routing.data.type,
    getTitle: mapDocumentTitle,
  },
  {
    actionType: routing.dataDetail.type,
    getTitle: detailDocumentTitle,
  },
  {
    actionType: routing.datasetDetail.type,
    getTitle: datasetDetailDocumentTitle,
  },
  {
    actionType: FETCH_DETAIL_SUCCESS,
    getTitle: detailDocumentTitleWithName,
  },
]

export default titleActionMapping
