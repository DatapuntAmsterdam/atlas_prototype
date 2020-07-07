import { Enlarge, Minimise } from '@datapunt/asc-assets'
import { Row, Column, Heading, Link, themeColor, themeSpacing, Alert } from '@datapunt/asc-ui'
import React from 'react'
import RouterLink from 'redux-first-router-link'
import styled, { css } from 'styled-components'
import { SCOPES } from '../../../shared/services/auth/auth'
import getState from '../../../shared/services/redux/get-state'
import { toConstructionFileViewer } from '../../../store/redux-first-router/actions'
import ActionButton from '../ActionButton/ActionButton'
import IIIFThumbnail from '../IIIFThumbnail/IIIFThumbnail'
import NotificationLevel from '../../models/notification'
import { ConstructionFileImage } from '../ConstructionFileDetail/ConstructionFileDetail'

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
  allFiles: Array<ConstructionFileImage>
  id: string
  access: 'RESTRICTED' | 'PUBLIC'
}
const MAX_LENGTH = 6

const Gallery: React.FC<GalleryProps> = ({ allFiles, id, access }) => {
  const lessFiles = allFiles.slice(0, MAX_LENGTH)
  const [files, setFiles] = React.useState(lessFiles)

  const { scopes } = getState().user

  const hasRights = scopes.includes(SCOPES['BD/R'])
  const hasExtendedRights = scopes.includes(SCOPES['BD/X'])

  const hasMore = allFiles.length > MAX_LENGTH
  const restricted = access === 'RESTRICTED'

  return (
    <GalleryContainer key={id}>
      {files.length ? (
        <>
          {!hasRights && !hasExtendedRights ? (
            <StyledAlert level={NotificationLevel.Attention} dismissible>
              Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om bouw- en
              omgevingsdossiers te bekijken.
            </StyledAlert>
          ) : (
            restricted &&
            !hasExtendedRights && (
              <StyledAlert level={NotificationLevel.Attention} dismissible>
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
                    to={toConstructionFileViewer(id, fileName, fileUrl)}
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
