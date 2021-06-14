import { Download } from '@amsterdam/asc-assets'
import { Button, Checkbox, Heading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
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
import LoginAlert from './LoginAlert'

export interface DocumentDetailsProps {
  dossierId: string
  dossier: Bouwdossier
  document: Document
  onRequestLoginLink: () => void
  onDownloadFiles: (files: Bestand[]) => void
  index: number
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

const StyledLabel = styled.label`
  position: relative;
`

const StyledCheckbox = styled(Checkbox)`
  padding: ${themeSpacing(3)};

  // Todo: fix in ASC
  input {
    opacity: 0;
    left: 12px;
    top: 12px;
  }
`

const DocumentDetails: FunctionComponent<DocumentDetailsProps> = ({
  index,
  dossierId,
  dossier,
  document,
  onRequestLoginLink,
  onDownloadFiles,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<Bestand[]>([])
  const [allFilesSelected, setAllFilesSelected] = useState(false)
  const scopes = getScopes()
  const { token, isTokenExpired } = useAuthToken()

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
    return scopes.includes(SCOPES['BD/R']) || (token && !isTokenExpired)
  }, [scopes, token])

  function onSelectAllClick(files: Bestand[]) {
    setAllFilesSelected(!allFilesSelected)
    setSelectedFiles(!allFilesSelected ? files : [])
  }

  function onFileSelectionChange(files: Bestand[]) {
    setSelectedFiles(files)
    setAllFilesSelected(files.length === document.bestanden.length)
  }

  return (
    <>
      <DocumentHeaderBlock data-testid={`constructionDocuments-${index}`}>
        {document.subdossier_titel && (
          <>
            <DocumentHeading forwardedAs="h3">
              {`${document.subdossier_titel} (${document.bestanden.length})`}
            </DocumentHeading>
            {hasRights && !disableDownload && (
              <>
                <StyledLabel data-testid="allFilesToggle">
                  Alles selecteren ({selectedFiles.length})
                  <StyledCheckbox
                    checked={allFilesSelected}
                    onChange={() => onSelectAllClick(document.bestanden)}
                  />
                </StyledLabel>
                <DownloadButton
                  type="button"
                  variant="primary"
                  iconLeft={<Download />}
                  onClick={() => onDownloadFiles(selectedFiles)}
                >
                  Downloaden
                </DownloadButton>
              </>
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
      <GalleryContainer data-testid="filesGalleryContainer">
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
              onFileSelectionChange={onFileSelectionChange}
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
