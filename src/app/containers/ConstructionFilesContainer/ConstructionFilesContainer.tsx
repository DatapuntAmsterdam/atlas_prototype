import { Alert, Heading, Paragraph, Row, themeSpacing } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import React, { lazy, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import environment from '../../../environment'
import { resetFile } from '../../../shared/ducks/files/actions'
import { getFileName, getFileUrl } from '../../../shared/ducks/files/selectors'
import { isPrintMode } from '../../../shared/ducks/ui/ui'
import { fetchWithToken } from '../../../shared/services/api/api'
import { getLocationPayload } from '../../../store/redux-first-router/selectors'
import ConstructionFileDetail, {
  ConstructionFileDetailProps as Results,
} from '../../components/ConstructionFileDetail/ConstructionFileDetail'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import useDocumentTitle from '../../utils/useDocumentTitle'

const ImageViewer = lazy(
  () => import(/* webpackChunkName: "ImageViewer" */ '../../components/ImageViewer/ImageViewer'),
)

const StyledRow = styled(Row)`
  justify-content: center;
  margin: ${themeSpacing(5)};
`

const ERROR_MESSAGE =
  'Er kunnen door een technische storing helaas geen bouw- en omgevingsdossiers worden getoond. Probeer het later nog eens.'

const ConstructionFilesContainer = () => {
  const [results, setResults] = useState<Results | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageViewerActive, setImageViewerActive] = useState(false)

  const { trackPageView } = useMatomo()
  const { documentTitle, setDocumentTitle } = useDocumentTitle()

  const dispatch = useDispatch()
  const handleResetFile = () => dispatch(resetFile())

  const fileName: string = useSelector(getFileName)
  const fileUrl: string = useSelector(getFileUrl)
  const printMode: boolean = useSelector(isPrintMode)
  const locationPayload: { id: string } = useSelector(getLocationPayload)

  const { titel: title } = results || {}

  async function fetchConstructionFiles() {
    setLoading(true)
    try {
      const data = await fetchWithToken(
        `${environment.API_ROOT}iiif-metadata/bouwdossier/${locationPayload.id.replace('id', '')}/`,
      )
      setResults(data)
    } catch (e) {
      setErrorMessage(ERROR_MESSAGE)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchConstructionFiles()
  }, [])

  // Effect to update the documentTitle
  useEffect(
    /* istanbul ignore next */
    () => {
      if (title) {
        setDocumentTitle(imageViewerActive && 'Bouwtekening')
      }
    },
    [title, imageViewerActive],
  )

  // Track pageView when documentTitle changes
  useEffect(
    /* istanbul ignore next */
    () => {
      if (title) {
        trackPageView({ documentTitle })
      }
    },
    [documentTitle],
  )

  // If there is no filename, don't show the viewer
  useEffect(
    /* istanbul ignore next */
    () => {
      setImageViewerActive(!!fileName)
    },
    [fileName],
  )

  const noResultsTemplate = (
    <StyledRow>
      <Heading as="em">Geen resultaten gevonden</Heading>
    </StyledRow>
  )

  const loadingTemplate = (
    <StyledRow>
      <LoadingSpinner />
    </StyledRow>
  )

  return errorMessage ? (
    <Alert level="error">
      <Paragraph>{errorMessage}</Paragraph>
    </Alert>
  ) : (
    <>
      {imageViewerActive && (
        <ImageViewer {...{ fileName, fileUrl, title: title || '', printMode, handleResetFile }} />
      )}
      {loading && loadingTemplate}
      {!loading &&
        !fileName &&
        (results ? <ConstructionFileDetail {...results} /> : noResultsTemplate)}
    </>
  )
}

export default ConstructionFilesContainer
