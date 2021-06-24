import { Enlarge, Minimise } from '@amsterdam/asc-assets'
import { Checkbox, Column, Link, Row, themeSpacing } from '@amsterdam/asc-ui'
import type { FunctionComponent } from 'react'
import { useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import type { Bestand, Document } from '../../../../../api/iiif-metadata/bouwdossier'
import { NOT_FOUND_THUMBNAIL } from '../../../../../shared/config/constants'
import { isAuthenticated } from '../../../../../shared/services/auth/auth'
import ActionButton from '../../../../components/ActionButton'
import { FEATURE_KEYCLOAK_AUTH, isFeatureEnabled } from '../../../../features'
import { toConstructionDossier } from '../../../../links'
import { useAuthToken } from '../../AuthTokenContext'
import IIIFThumbnail from '../IIIFThumbnail'

const StyledRow = styled(Row)<{ hasMarginBottom: boolean }>`
  justify-content: flex-start;
  margin-bottom: ${({ hasMarginBottom }) => (hasMarginBottom ? themeSpacing(8) : 0)};
`

const StyledColumn = styled(Column)`
  margin-right: ${themeSpacing(4)};
  margin-bottom: ${themeSpacing(4)};
  position: relative;
`

const StyledLink = styled(Link)<{ disabled: boolean }>`
  width: 100%;
  height: 100%;
  padding: 0;
  position: relative;
  display: inline-block;

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: no-drop;

      & * {
        cursor: no-drop;
      }
    `}

  // To make the link square
  &::before {
    content: '';
    display: block;
    padding-top: 100%;
  }

  & > * {
    height: 100%;
    position: absolute;
    top: 0;
    width: 100%;
  }
`

const StyledCheckbox = styled(Checkbox)`
  position: absolute;
  top: 0;
  right: 0;
  padding: ${themeSpacing(3)};

  // Todo: fix in ASC
  input {
    opacity: 0;
    left: 12px;
    top: 12px;
  }
`

const MAX_LENGTH = 6

export interface FilesGalleryProps {
  dossierId: string
  document: Document
  selectedFiles: Bestand[]
  onFileSelectionChange: (files: Bestand[]) => void
  disabled: boolean
  restricted: boolean
}

const FilesGallery: FunctionComponent<FilesGalleryProps> = ({
  dossierId,
  document,
  selectedFiles,
  onFileSelectionChange,
  disabled,
  restricted,
}) => {
  const lessFiles = useMemo(() => document.bestanden.slice(0, MAX_LENGTH), [document.bestanden])
  const [files, setFiles] = useState(lessFiles)
  const hasMore = document.bestanden.length > MAX_LENGTH
  const { token } = useAuthToken()
  const tokenQueryString = useMemo(
    () => (token ? `?${new URLSearchParams({ auth: token }).toString()}` : ''),
    [token],
  )

  // Only allow downloads from a signed in user if authenticated with Keycloak.
  // TODO: This logic can be removed once we switch to Keycloak entirely.
  const disableDownload = isAuthenticated() && !isFeatureEnabled(FEATURE_KEYCLOAK_AUTH)

  function toggleFile(file: Bestand) {
    if (selectedFiles.includes(file)) {
      onFileSelectionChange(selectedFiles.filter((selectedFile) => selectedFile.url !== file.url))
    } else {
      onFileSelectionChange([...selectedFiles, file])
    }
  }

  return (
    <>
      <StyledRow hasMarginBottom={hasMore} hasMargin={false} hasMaxWidth={false}>
        {files.map((file) => {
          return (
            <StyledColumn
              key={file.url}
              span={{ small: 1, medium: 2, big: 2, large: 2, xLarge: 2 }}
              data-testid="fileResult"
            >
              {/* @ts-ignore */}
              <StyledLink
                forwardedAs={disabled ? 'span' : RouterLink}
                to={toConstructionDossier(
                  dossierId,
                  file.filename,
                  file.url,
                  document.barcode as string, // TODO why do i need to define string here but not file args above?
                )}
                title={file.filename}
                disabled={disabled}
                data-testid="detailLink"
              >
                <IIIFThumbnail
                  src={
                    disabled
                      ? NOT_FOUND_THUMBNAIL // use the default not found image when user has no rights
                      : `${file.url}/square/180,180/0/default.jpg${tokenQueryString}`
                  }
                  title={file.filename}
                  data-testid="thumbnail"
                />
              </StyledLink>
              {!disabled && !disableDownload && !restricted && (
                <StyledCheckbox
                  data-testid="fileToggle"
                  checked={selectedFiles.includes(file)}
                  onChange={() => toggleFile(file)}
                />
              )}
            </StyledColumn>
          )
        })}
      </StyledRow>
      {hasMore &&
        (document.bestanden.length !== files.length ? (
          <ActionButton
            fetching={false}
            iconLeft={<Enlarge />}
            onClick={() => setFiles(document.bestanden)}
            label={`Toon alle (${document.bestanden.length})`}
            data-testid="showMore"
          />
        ) : (
          <ActionButton
            fetching={false}
            iconLeft={<Minimise />}
            onClick={() => setFiles(lessFiles)}
            label="Minder tonen"
            data-testid="showLess"
          />
        ))}
    </>
  )
}

export default FilesGallery
