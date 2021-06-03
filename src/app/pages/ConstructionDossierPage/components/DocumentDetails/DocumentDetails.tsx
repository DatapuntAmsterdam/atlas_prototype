import { Download } from '@amsterdam/asc-assets'
import { Button, Heading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import type { FunctionComponent } from 'react'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import type {
  Bestand,
  Document,
  Single as Bouwdossier,
} from '../../../../../api/iiif-metadata/bouwdossier'
import { getScopes, isAuthenticated, SCOPES } from '../../../../../shared/services/auth/auth'
import { FEATURE_KEYCLOAK_AUTH, isFeatureEnabled } from '../../../../features'
import { useAuthToken } from '../../AuthTokenContext'
import ContentBlock, { DefinitionList, DefinitionListItem, SubHeading } from '../ContentBlock'
import FilesGallery from '../FilesGallery'
import RequestDownloadModal from '../RequestDownloadModal'
import SelectFilesModal from '../SelectFilesModal'
import LoginAlert from './LoginAlert'

export interface DocumentDetailsProps {
  dossierId: string
  dossier: Bouwdossier
  document: Document
  onRequestLoginLink: () => void
}

const DocumentHeaderBlock = styled(ContentBlock)`
  display: flex;
`

const DocumentHeading = styled(SubHeading)`
  margin-right: auto;
`

const DownloadButton = styled(Button)`
  margin-left: ${themeSpacing(2)};
  flex-shrink: 0;
`

const GalleryContainer = styled.div`
  border-bottom: 1px solid ${themeColor('tint', 'level3')};
  padding: ${themeSpacing(5, 5, 10, 5)};
`

const DocumentDetails: FunctionComponent<DocumentDetailsProps> = ({
  dossierId,
  dossier,
  document,
  onRequestLoginLink,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<Bestand[]>([])
  const [showSelectFilesModal, setShowSelectFilesModal] = useState(false)
  const [showRequestDownloadModal, setShowRequestDownloadModal] = useState(false)
  const scopes = getScopes()
  const { token } = useAuthToken()

  // Only allow downloads from a signed in user if authenticated with Keycloak.
  // TODO: This logic can be removed once we switch to Keycloak entirely.
  const disableDownload = isAuthenticated() && !isFeatureEnabled(FEATURE_KEYCLOAK_AUTH)
  const restricted = dossier.access === 'RESTRICTED' || document.access === 'RESTRICTED'
  const hasRights = useMemo(() => {
    // Only users with extended rights can view restricted documents.
    if (restricted) {
      return scopes.includes(SCOPES['BD/X'])
    }

    // Only users with read rights, or with a login link token can view public documents.
    return scopes.includes(SCOPES['BD/R']) || !!token
  }, [restricted, scopes, token])

  function onDownloadFiles() {
    if (selectedFiles.length === 0) {
      setShowSelectFilesModal(true)
    } else {
      setShowRequestDownloadModal(true)
    }
  }

  return (
    <>
      {showSelectFilesModal && <SelectFilesModal onClose={() => setShowSelectFilesModal(false)} />}
      {showRequestDownloadModal && (
        <RequestDownloadModal
          files={selectedFiles}
          onClose={() => setShowRequestDownloadModal(false)}
        />
      )}
      <DocumentHeaderBlock>
        {document.subdossier_titel && (
          <>
            <DocumentHeading forwardedAs="h3">
              {`${document.subdossier_titel} (${document.bestanden.length})`}
            </DocumentHeading>
            {hasRights && !disableDownload && (
              <DownloadButton
                type="button"
                variant="primary"
                iconLeft={<Download />}
                onClick={onDownloadFiles}
              >
                Downloaden
              </DownloadButton>
            )}
          </>
        )}
      </DocumentHeaderBlock>
      {dossier.olo_liaan_nummer && (
        <DefinitionList data-testid="oloLiaanNumberDescription">
          {document.document_omschrijving && (
            <DefinitionListItem term="Beschrijving">
              {document.document_omschrijving}
            </DefinitionListItem>
          )}
          {document.oorspronkelijk_pad.length > 0 && (
            <DefinitionListItem term="Oorspronkelijk pad">
              {document.oorspronkelijk_pad.join(', ')}
            </DefinitionListItem>
          )}
          <DefinitionListItem term="Openbaarheid">{document.access}</DefinitionListItem>
        </DefinitionList>
      )}
      <GalleryContainer>
        {document.bestanden.length > 0 ? (
          <>
            {!hasRights && (
              <LoginAlert restricted={restricted} onRequestLoginLink={onRequestLoginLink} />
            )}
            <FilesGallery
              data-testid="filesGallery"
              dossierId={dossierId}
              document={document}
              selectedFiles={selectedFiles}
              onFileSelectionChange={(files) => setSelectedFiles(files)}
              disabled={!hasRights}
            />
          </>
        ) : (
          <Heading as="em" data-testid="noResults">
            Geen bouwtekening(en) beschikbaar.
          </Heading>
        )}
      </GalleryContainer>
    </>
  )
}

export default DocumentDetails
