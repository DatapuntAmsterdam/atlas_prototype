import { Alert, Heading, Paragraph, Row, themeSpacing } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import React, { FunctionComponent, lazy, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { resetFile } from '../../../shared/ducks/files/actions'
import { getFileName, getFileUrl } from '../../../shared/ducks/files/selectors'
import { isPrintMode } from '../../../shared/ducks/ui/ui'
import ConstructionFileDetail from '../../components/ConstructionFileDetail/ConstructionFileDetail'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import useDocumentTitle from '../../utils/useDocumentTitle'
import usePromise, { PromiseStatus } from '../../utils/usePromise'
import { getBouwdossierById, Bouwdossier } from '../../../api/iiif-metadata/bouwdossier'

const ImageViewer = lazy(
  () => import(/* webpackChunkName: "ImageViewer" */ '../../components/ImageViewer/ImageViewer'),
)

const StyledRow = styled(Row)`
  justify-content: center;
  margin: ${themeSpacing(5)};
`

const ERROR_MESSAGE =
  'Er kunnen door een technische storing helaas geen bouw- en omgevingsdossiers worden getoond. Probeer het later nog eens.'

interface ConstructionFilesPageParams {
  id: string
}

const ConstructionFilesPage: FunctionComponent = () => {
  const { id } = useParams<ConstructionFilesPageParams>()
  const [results, setResults] = useState<Bouwdossier | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [imageViewerActive, setImageViewerActive] = useState(false)

  const { trackPageView } = useMatomo()
  const { documentTitle, setDocumentTitle } = useDocumentTitle()

  const dispatch = useDispatch()
  const handleResetFile = () => dispatch(resetFile())

  const fileName: string = useSelector(getFileName)
  const fileUrl: string = useSelector(getFileUrl)
  const printMode: boolean = useSelector(isPrintMode)

  const bouwdossierResult = usePromise(
    useMemo(() => getBouwdossierById(id.replace('id', '')), [id]),
  )
  const { titel: title } = results || {}

  useEffect(() => {
    if (bouwdossierResult.status === PromiseStatus.Pending) return

    setLoading(false)

    if (bouwdossierResult.status === PromiseStatus.Rejected) {
      setErrorMessage(ERROR_MESSAGE)
      return
    }

    setResults(bouwdossierResult.value)
  }, [bouwdossierResult])

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

export default ConstructionFilesPage
