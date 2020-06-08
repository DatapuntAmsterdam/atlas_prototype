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
  padding: ${themeSpacing(10, 5)};
`

const StyledHeading = styled(Heading)`
  margin-bottom: ${themeSpacing(3)};
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

  ${({ disabled }: { disabled: boolean }) =>
    disabled &&
    css`
      pointer-events: none;
      cursor: default;
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
  title: string
  allFiles: Array<ConstructionFileImage>
  id: string
  access: 'RESTRICTED' | 'PUBLIC'
}
const MAX_LENGTH = 6

const Gallery: React.FC<GalleryProps> = ({ title, allFiles, id, access }) => {
  const lessFiles = allFiles.slice(0, MAX_LENGTH)
  const [files, setFiles] = React.useState(lessFiles)

  const { scopes } = getState().user

  const hasRights = scopes.includes(SCOPES['BD/R'])
  const hasExtendedRights = scopes.includes(SCOPES['BD/X'])

  const hasMore = allFiles.length > MAX_LENGTH
  const restricted = access === 'RESTRICTED'

  return (
    <GalleryContainer key={title}>
      <StyledHeading color="secondary" forwardedAs="h3">
        {title} {hasMore && `(${allFiles.length})`}
      </StyledHeading>
      {files.length ? (
        <>
          {!hasRights && !hasExtendedRights ? (
            <StyledAlert level={NotificationLevel.Attention} dismissible>
              Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om bouwdossiers te
              bekijken.
            </StyledAlert>
          ) : (
            restricted &&
            !hasExtendedRights && (
              <StyledAlert level={NotificationLevel.Attention} dismissible>
                Medewerkers/ketenpartners van Gemeente Amsterdam met extra bevoegdheden kunnen
                inloggen om alle bouwdossiers te bekijken.
              </StyledAlert>
            )
          )}

          <StyledRow hasMarginBottom={hasMore} hasMargin={false}>
            {files.map(({ filename: fileName, url: fileUrl }) => {
              const disabled = (!hasRights && !hasExtendedRights) || (restricted && !hasRights)

              return (
                <StyledColumn
                  key={fileName}
                  span={{ small: 1, medium: 2, big: 2, large: 2, xLarge: 2 }}
                >
                  {/*
                  // @ts-ignore */}
                  <StyledLink
                    forwardedAs={RouterLink}
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
