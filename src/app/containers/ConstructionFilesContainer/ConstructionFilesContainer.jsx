import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Heading, themeSpacing, Row } from '@datapunt/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import styled from 'styled-components'
import { getFileName, getFileUrl } from '../../../shared/ducks/files/selectors'
import { getUser } from '../../../shared/ducks/user/user'
import ConstructionFileDetail from '../../components/ConstructionFileDetail/ConstructionFileDetail'
import { getLocationPayload } from '../../../store/redux-first-router/selectors'
import LoadingIndicator from '../../../shared/components/loading-indicator/LoadingIndicator'
import ErrorAlert from '../../components/ErrorAlert/ErrorAlert'
import { getByUrl } from '../../../shared/services/api/api'
import useDocumentTitle from '../../utils/useDocumentTitle'

const ImageViewer = React.lazy(() =>
  import(/* webpackChunkName: "ImageViewer" */ '../../components/ImageViewer/ImageViewer'),
)

const StyledRow = styled(Row)`
  justify-content: center;
  margin: ${themeSpacing(5)};
`

const ERROR_MESSAGE =
  'Er kunnen door een technische storing helaas geen bouw- en omgevingsdossiers worden getoond. Probeer het later nog eens.'

const ConstructionFilesContainer = ({ fileName, fileUrl, endpoint }) => {
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

  const onDownloadFile = (size) => {
    trackEvent({
      documentTitle,
      category: 'download-bouwtekening',
      action: `bouwtekening-download-${size}`,
      value: fileName,
    })
  }

  const noResultsTemplate = (
    <StyledRow>
      <Heading as="em">Geen resultaten gevonden</Heading>
    </StyledRow>
  )

  const loadingTemplate = (
    <StyledRow>
      <LoadingIndicator />
    </StyledRow>
  )

  return errorMessage ? (
    <ErrorAlert errorMessage={errorMessage} />
  ) : (
    <>
      {imageViewerActive && <ImageViewer {...{ fileName, fileUrl, title, onDownloadFile }} />}
      {loading && loadingTemplate}
      {!loading &&
        !fileName &&
        (results ? <ConstructionFileDetail {...results} /> : noResultsTemplate)}
    </>
  )
}

ConstructionFilesContainer.propTypes = {
  fileName: PropTypes.string.isRequired,
  user: PropTypes.shape({}).isRequired,
  endpoint: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
  fileName: getFileName(state),
  fileUrl: getFileUrl(state),
  endpoint: `${process.env.API_ROOT}iiif-metadata/bouwdossier/${getLocationPayload(
    state,
  ).id.replace('id', '')}/`,
  user: getUser(state),
})

export default connect(mapStateToProps, null)(ConstructionFilesContainer)
