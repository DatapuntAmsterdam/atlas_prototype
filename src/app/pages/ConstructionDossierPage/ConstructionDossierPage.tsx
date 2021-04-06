import { Alert, Paragraph, Row, themeSpacing } from '@amsterdam/asc-ui'
import usePromise, { isPending, isRejected } from '@amsterdam/use-promise'
import { FunctionComponent, lazy, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { getBouwdossierById } from '../../../api/iiif-metadata/bouwdossier'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import { toConstructionDossier } from '../../links'
import useDocumentTitle from '../../utils/useDocumentTitle'
import useParam from '../../utils/useParam'
import { AuthTokenProvider } from './AuthTokenContext'
import DossierDetails from './components/DossierDetails'
import { fileNameParam, fileUrlParam } from './query-params'

const ImageViewer = lazy(
  () => import(/* webpackChunkName: "ImageViewer" */ './components/ImageViewer'),
)

const StyledRow = styled(Row)`
  justify-content: center;
  margin: ${themeSpacing(5)};
`

interface ConstructionDossierPageParams {
  id: string
}

const ConstructionDossierPage: FunctionComponent = () => {
  const history = useHistory()
  const { setDocumentTitle } = useDocumentTitle()
  const { id } = useParams<ConstructionDossierPageParams>()
  const [fileName] = useParam(fileNameParam)
  const [fileUrl] = useParam(fileUrlParam)
  const result = usePromise(() => getBouwdossierById(id), [id])

  useEffect(() => {
    setDocumentTitle(fileName ? 'Bouwtekening' : false)
  }, [fileName])

  if (isPending(result)) {
    return (
      <StyledRow>
        <LoadingSpinner data-testid="loadingSpinner" />
      </StyledRow>
    )
  }

  if (isRejected(result)) {
    return (
      <Alert level="error" data-testid="errorMessage">
        <Paragraph>
          Er kunnen door een technische storing helaas geen bouw- en omgevingsdossiers worden
          getoond. Probeer het later nog eens.
        </Paragraph>
      </Alert>
    )
  }

  const dossierId = `${result.value.stadsdeel}${result.value.dossiernr}`

  return (
    <AuthTokenProvider>
      {fileName && fileUrl && (
        <ImageViewer
          title={result.value.titel}
          fileName={fileName}
          fileUrl={fileUrl}
          onClose={() => history.replace(toConstructionDossier(dossierId))}
        />
      )}
      {!fileName && (
        <DossierDetails dossierId={dossierId} dossier={result.value} data-testid="dossierDetails" />
      )}
    </AuthTokenProvider>
  )
}

export default ConstructionDossierPage
