import { Row, themeSpacing } from '@amsterdam/asc-ui'
import usePromise, { isFulfilled, isPending, isRejected } from '@amsterdam/use-promise'
import { lazy, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import { getBouwdossierById } from '../../../api/iiif-metadata/bouwdossier'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import { toConstructionDossier } from '../../links'
import useDocumentTitle from '../../utils/useDocumentTitle'
import useParam from '../../utils/useParam'
import { AuthTokenProvider } from './AuthTokenContext'
import DossierDetails from './components/DossierDetails'
import { documentCodeParam, fileNameParam } from './query-params'
import GeneralErrorAlert from '../../components/Alerts/GeneralErrorAlert'
import DossierNotFoundAlert from './components/DossierNotFoundAlert'

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
  const [documentBarcode] = useParam(documentCodeParam)
  const result = usePromise(() => getBouwdossierById(id), [id])

  useEffect(() => {
    setDocumentTitle(fileName ? 'Bouwtekening' : false)

    if (!fileName && isFulfilled(result)) {
      setDocumentTitle(result.value.titel)
    }

    if (isRejected(result)) {
      setDocumentTitle('Dossier niet gevonden')
    }
  }, [fileName, result])

  if (isPending(result)) {
    return (
      <StyledRow>
        <LoadingSpinner data-testid="loadingSpinner" />
      </StyledRow>
    )
  }

  if (isRejected(result)) {
    if (result?.reason.code === 404) {
      return <DossierNotFoundAlert />
    }

    return <GeneralErrorAlert />
  }

  const dossierId = `${result.value.stadsdeel}${result.value.dossiernr}`
  const matchingDoc = result.value.documenten.find((doc) => doc.barcode === documentBarcode)

  return (
    <AuthTokenProvider>
      {fileName ? (
        <ImageViewer
          title={result.value.titel}
          files={matchingDoc ? matchingDoc.bestanden : []}
          selectedFileName={fileName}
          onClose={() => history.replace(toConstructionDossier(dossierId))}
        />
      ) : (
        <DossierDetails dossierId={dossierId} dossier={result.value} data-testid="dossierDetails" />
      )}
    </AuthTokenProvider>
  )
}

export default ConstructionDossierPage
