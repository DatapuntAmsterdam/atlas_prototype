import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Heading } from '@datapunt/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { getFileName } from '../../../shared/ducks/files/selectors'
import { getUser } from '../../../shared/ducks/user/user'
import { SCOPES } from '../../../shared/services/auth/auth'
import NotAuthorizedMessage from '../../components/PanelMessages/NotAuthorizedMessage'
import ConstructionFileDetail from '../../components/ConstructionFileDetail/ConstructionFileDetail'
import SHARED_CONFIG from '../../../shared/services/shared-config/shared-config'
import { getLocationPayload } from '../../../store/redux-first-router/selectors'
import LoadingIndicator from '../../../shared/components/loading-indicator/LoadingIndicator'
import ErrorMessage from '../../components/PanelMessages/ErrorMessage/ErrorMessage'
import { getByUrl } from '../../../shared/services/api/api'
import './ConstructionFilesContainer.scss'
import { ConstructionFiles as ContextMenu } from '../../components/ContextMenu'
import useDocumentTitle from '../../utils/useDocumentTitle'
import withGrid from '../../utils/withGrid'

const ImageViewer = React.lazy(() => import('../../components/ImageViewer/ImageViewer'))

const ERROR_MESSAGE =
  'Er kunnen door een technische storing helaas geen bouwdossiers worden getoond. Probeer het later nog eens.'

const ConstructionFilesContainer = ({ fileName, user, endpoint }) => {
  const [results, setResults] = React.useState(null)
  const [errorMessage, setErrorMessage] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [imageViewerActive, setImageViewerActive] = React.useState(false)

  const { trackPageView, trackEvent } = useMatomo()
  const { documentTitle, setDocumentTitle } = useDocumentTitle()

  const { titel: title } = results || {}

  async function fetchConstructionFiles() {
    setLoading(true)
    try {
      const data = await getByUrl(endpoint)
      setResults(data)
    } catch (e) {
      setErrorMessage(ERROR_MESSAGE)
    }
    setLoading(false)
  }

  React.useEffect(() => {
    fetchConstructionFiles()
  }, [])

  // Effect to update the documentTitle
  React.useEffect(
    /* istanbul ignore next */
    () => {
      if (title) {
        setDocumentTitle(imageViewerActive && 'Bouwtekening')
      }
    },
    [title, imageViewerActive],
  )

  // Track pageView when documentTitle changes
  React.useEffect(
    /* istanbul ignore next */
    () => {
      if (title) {
        trackPageView({ documentTitle })
      }
    },
    [documentTitle],
  )

  // If there is no filename, don't show the viewer
  React.useEffect(
    /* istanbul ignore next */
    () => {
      setImageViewerActive(!!fileName)
    },
    [fileName],
  )

  const onDownloadFile = size => {
    trackEvent({
      documentTitle,
      action: 'Download-bouwtekening',
      name: `bouwtekening-download-${size}`,
      value: fileName,
    })
  }

  const noResultsTemplate = withGrid(<Heading as="em">Geen resultaten gevonden</Heading>)

  const notAuthorizedTemplate = withGrid(<NotAuthorizedMessage type="bouwdossiers" />)

  const loadingTemplate = withGrid(<LoadingIndicator />)

  // eslint-disable-next-line no-nested-ternary
  return user.scopes.includes(SCOPES['BD/R']) ? (
    errorMessage ? (
      <ErrorMessage errorMessage={errorMessage} />
    ) : (
      <React.Fragment>
        {imageViewerActive && (
          <ImageViewer
            {...{ fileName, title }}
            contextMenu={<ContextMenu onDownload={onDownloadFile} fileName={fileName} />}
          />
        )}
        {loading && loadingTemplate}
        {!loading &&
          !fileName &&
          (results ? <ConstructionFileDetail results={results} /> : noResultsTemplate)}
      </React.Fragment>
    )
  ) : (
    notAuthorizedTemplate
  )
}

ConstructionFilesContainer.propTypes = {
  fileName: PropTypes.string,
  user: PropTypes.shape({}).isRequired,
  endpoint: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  fileName: getFileName(state),
  endpoint: `${SHARED_CONFIG.API_ROOT}stadsarchief/bouwdossier/${getLocationPayload(
    state,
  ).id.replace('id', '')}/`,
  user: getUser(state),
})

export default connect(
  mapStateToProps,
  null,
)(ConstructionFilesContainer)
