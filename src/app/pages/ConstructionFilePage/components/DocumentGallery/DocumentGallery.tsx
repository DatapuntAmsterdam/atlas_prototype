import { Enlarge, Minimise } from '@amsterdam/asc-assets'
import { Alert, Column, Heading, Link, Row, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { FunctionComponent, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { Document } from '../../../../../api/iiif-metadata/bouwdossier'
import { getUserScopes } from '../../../../../shared/ducks/user/user'
import { SCOPES } from '../../../../../shared/services/auth/auth'
import ActionButton from '../../../../components/ActionButton/ActionButton'
import IIIFThumbnail from '../../../../components/IIIFThumbnail/IIIFThumbnail'
import { toConstructionFile } from '../../../../links'

const StyledAlert = styled(Alert)`
  margin-bottom: ${themeSpacing(5)} !important;
`

const GalleryContainer = styled.div`
  border-bottom: 1px solid ${themeColor('tint', 'level3')};
  padding: ${themeSpacing(5, 5, 10, 5)};
`

const StyledRow = styled(Row)<{ hasMarginBottom: boolean }>`
  justify-content: flex-start;
  margin-bottom: ${({ hasMarginBottom }) => (hasMarginBottom ? themeSpacing(8) : 0)};
`

const StyledColumn = styled(Column)`
  margin-right: ${themeSpacing(4)};
  margin-bottom: ${themeSpacing(4)};
`

const StyledLink = styled(Link)<{ disabled: boolean }>`
  width: 100%;
  height: 100%;
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

const MAX_LENGTH = 6

export interface DocumentGalleryProps {
  fileId: string
  document: Document
}

const DocumentGallery: FunctionComponent<DocumentGalleryProps> = ({
  fileId,
  document,
  ...otherProps
}) => {
  const lessFiles = document.bestanden.slice(0, MAX_LENGTH)
  const [files, setFiles] = useState(lessFiles)
  const scopes = useSelector(getUserScopes)

  const hasRights = scopes.includes(SCOPES['BD/R'])
  const hasExtendedRights = scopes.includes(SCOPES['BD/X'])

  const hasMore = document.bestanden.length > MAX_LENGTH
  const restricted = document.access === 'RESTRICTED'

  return (
    <GalleryContainer {...otherProps}>
      {files.length ? (
        <>
          {!hasRights && !hasExtendedRights ? (
            <StyledAlert level="info" dismissible>
              Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om bouw- en
              omgevingsdossiers te bekijken.
            </StyledAlert>
          ) : (
            restricted &&
            !hasExtendedRights && (
              <StyledAlert level="info" dismissible>
                Medewerkers/ketenpartners van Gemeente Amsterdam met extra bevoegdheden kunnen
                inloggen om alle bouw- en omgevingsdossiers te bekijken.
              </StyledAlert>
            )
          )}

          <StyledRow hasMarginBottom={hasMore} hasMargin={false} hasMaxWidth={false}>
            {files.map((file) => {
              const disabled =
                (!hasRights && !hasExtendedRights) || (restricted && !hasExtendedRights)

              return (
                <StyledColumn
                  key={file.url}
                  span={{ small: 1, medium: 2, big: 2, large: 2, xLarge: 2 }}
                >
                  {/*
                  // @ts-ignore */}
                  <StyledLink
                    forwardedAs={disabled ? 'span' : RouterLink}
                    to={toConstructionFile(fileId, file.filename, file.url)}
                    title={file.filename}
                    disabled={disabled}
                  >
                    <IIIFThumbnail
                      src={
                        disabled
                          ? '/assets/images/not_found_thumbnail.jpg' // use the default not found image when user has no rights
                          : `${file.url}/square/180,180/0/default.jpg`
                      }
                      title={file.filename}
                    />
                  </StyledLink>
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
              />
            ) : (
              <ActionButton
                fetching={false}
                iconLeft={<Minimise />}
                onClick={() => setFiles(lessFiles)}
                label="Minder tonen"
              />
            ))}
        </>
      ) : (
        <Heading as="em">Geen bouwtekening(en) beschikbaar.</Heading>
      )}
    </GalleryContainer>
  )
}

export default DocumentGallery
