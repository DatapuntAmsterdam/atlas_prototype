import { Enlarge, Minimise } from '@amsterdam/asc-assets'
import { Alert, Column, Heading, Link, Row, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { FunctionComponent, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { Bestand, BouwdossierAccess } from '../../../api/iiif-metadata/bouwdossier'
import { SCOPES } from '../../../shared/services/auth/auth'
import getState from '../../../shared/services/redux/get-state'
import { toConstructionFile } from '../../links'
import ActionButton from '../ActionButton/ActionButton'
import IIIFThumbnail from '../IIIFThumbnail/IIIFThumbnail'

const StyledAlert = styled(Alert)`
  margin-bottom: ${themeSpacing(5)} !important;
`

const GalleryContainer = styled.div`
  border-bottom: 1px solid ${themeColor('tint', 'level3')};
  padding: ${themeSpacing(5, 5, 10, 5)};
`

const StyledRow = styled(Row)`
  justify-content: flex-start;
  margin-bottom: ${({ hasMarginBottom }: { hasMarginBottom: boolean }) =>
    hasMarginBottom ? themeSpacing(8) : 0};
`

const StyledColumn = styled(Column)`
  margin-right: ${themeSpacing(4)};
  margin-bottom: ${themeSpacing(4)};
`

const StyledLink = styled(Link)`
  width: 100%;
  height: 100%;
  position: relative;
  display: inline-block;

  ${({ disabled }: { disabled: boolean }) =>
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

type GalleryProps = {
  allFiles: Bestand[]
  id: string
  access: BouwdossierAccess
}

const MAX_LENGTH = 6

const Gallery: FunctionComponent<GalleryProps> = ({ allFiles, id, access, ...otherProps }) => {
  const lessFiles = allFiles.slice(0, MAX_LENGTH)
  const [files, setFiles] = useState(lessFiles)

  const { scopes } = getState().user

  const hasRights = scopes.includes(SCOPES['BD/R'])
  const hasExtendedRights = scopes.includes(SCOPES['BD/X'])

  const hasMore = allFiles.length > MAX_LENGTH
  const restricted = access === 'RESTRICTED'

  return (
    <GalleryContainer key={id} data-testid={otherProps['data-testid']}>
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
            {files.map(({ filename: fileName, url: fileUrl }) => {
              const disabled =
                (!hasRights && !hasExtendedRights) || (restricted && !hasExtendedRights)

              return (
                <StyledColumn
                  key={fileName}
                  span={{ small: 1, medium: 2, big: 2, large: 2, xLarge: 2 }}
                >
                  {/*
                  // @ts-ignore */}
                  <StyledLink
                    forwardedAs={disabled ? 'span' : RouterLink}
                    to={toConstructionFile(id, fileName, fileUrl)}
                    title={fileName}
                    disabled={disabled}
                  >
                    <IIIFThumbnail
                      src={
                        disabled
                          ? '/assets/images/not_found_thumbnail.jpg' // use the default not found image when user has no rights
                          : `${fileUrl}/square/180,180/0/default.jpg`
                      }
                      title={fileName}
                    />
                  </StyledLink>
                </StyledColumn>
              )
            })}
          </StyledRow>
          {hasMore &&
            (allFiles.length !== files.length ? (
              <ActionButton
                fetching={false}
                iconLeft={<Enlarge />}
                onClick={() => setFiles(allFiles)}
                label={`Toon alle (${allFiles.length})`}
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

export default Gallery
