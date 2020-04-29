/* eslint-disable no-nested-ternary */
import React from 'react'
import { PropTypes } from 'prop-types'
import RouterLink from 'redux-first-router-link'
import styled from '@datapunt/asc-core'
import { GridContainer, GridItem, Heading, themeSpacing, themeColor, Link } from '@datapunt/asc-ui'
import { Minimise, Enlarge } from '@datapunt/asc-assets'
import { toConstructionFileViewer } from '../../../store/redux-first-router/actions'
import ActionButton from '../ActionButton/ActionButton'
import IIIFThumbnail from '../IIIFThumbnail/IIIFThumbnail'
import Notification from '../../../shared/components/notification/Notification'
import getState from '../../../shared/services/redux/get-state'
import { SCOPES } from '../../../shared/services/auth/auth'

// This can be deleted when the Notifications will be refactored to be styled-components
const StyledNotification = styled(Notification)`
  margin-bottom: ${themeSpacing(5)} !important;
`

const GalleryGridContainer = styled(GridContainer)`
border-bottom: 1px solid ${themeColor('tint', 'level3')}
  padding-bottom: ${themeSpacing(5)}
  padding-top: ${themeSpacing(10)}

`

const StyledHeading = styled(Heading)`
  margin-bottom: ${themeSpacing(3)};
`

const StyledGridContainer = styled(GridContainer)`
  margin-bottom: ${({ hasMarginBottom }) => (hasMarginBottom ? themeSpacing(8) : 0)};
`

const StyledLink = styled(Link)`
  width: 100%;
  height: 100%;
  position: relative;

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

// Todo: replace the "encodeURIComponent(file.match(/SU(.*)/g)" when files are on the proper server
const Gallery = ({ title, allThumbnails, id, maxLength, access }) => {
  const lessThumbnails = allThumbnails.slice(0, maxLength)
  const [thumbnails, setThumbnails] = React.useState(lessThumbnails)

  const { scopes } = getState().user

  const hasRights = scopes.includes(SCOPES['BD/R'])
  const hasExtendedRights = scopes.includes(SCOPES['BD/X'])

  const hasMore = allThumbnails.length > maxLength
  const restricted = access === 'RESTRICTED'

  return (
    <GalleryGridContainer key={title} direction="column" gutterX={20}>
      <GridItem>
        <StyledHeading color="secondary" forwardedAs="h3">
          {title} {hasMore && `(${allThumbnails.length})`}
        </StyledHeading>
        {thumbnails && thumbnails.length ? (
          <>
            {!hasRights && !hasExtendedRights ? (
              <StyledNotification type="warning">
                Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om bouwdossiers te
                bekijken.
              </StyledNotification>
            ) : (
              restricted &&
              !hasExtendedRights && (
                <StyledNotification type="warning">
                  Medewerkers/ketenpartners van Gemeente Amsterdam met extra bevoegdheden kunnen
                  inloggen om alle bouwdossiers te bekijken.
                </StyledNotification>
              )
            )}

            <StyledGridContainer
              as="ul"
              wrap="wrap"
              gutterY={7.5}
              gutterX={7.5}
              hasMarginBottom={hasMore}
              collapse
            >
              {thumbnails.map((file) => {
                const fileTitle = file.match(/[^/]*$/g)[0]
                const fileName = file.replace(/\//g, '-') // Replace all forward slashes to create a filename that can be read by the server

                return (
                  <GridItem
                    key={file}
                    as="li"
                    square
                    width={[
                      '100%',
                      '100%',
                      '100%',
                      '50%',
                      '50%',
                      `${100 / 3}%`,
                      `${100 / 6}%`,
                      `${100 / 6}%`,
                      '315px',
                    ]}
                  >
                    <StyledLink
                      forwardedAs={RouterLink}
                      to={toConstructionFileViewer(id, fileName)}
                      title={fileTitle}
                    >
                      <IIIFThumbnail
                        src={
                          hasExtendedRights || (!restricted && hasRights)
                            ? `${process.env.IIIF_ROOT}iiif/2/edepot:${fileName}/square/300,300/0/default.jpg`
                            : '/assets/images/not_found_thumbnail.jpg' // use the default not found image when user has no rights
                        }
                        title={fileTitle}
                      />
                    </StyledLink>
                  </GridItem>
                )
              })}
            </StyledGridContainer>
            {hasMore &&
              (allThumbnails.length !== thumbnails.length ? (
                <ActionButton
                  iconLeft={<Enlarge />}
                  onClick={() => setThumbnails(allThumbnails)}
                  label={`Toon alle (${allThumbnails.length})`}
                />
              ) : (
                <ActionButton
                  iconLeft={<Minimise />}
                  onClick={() => setThumbnails(lessThumbnails)}
                  label="Minder tonen"
                />
              ))}
          </>
        ) : (
          <Heading as="em">Geen bouwtekening(en) beschikbaar.</Heading>
        )}
      </GridItem>
    </GalleryGridContainer>
  )
}

Gallery.defaultProps = {
  maxLength: 6,
}

Gallery.propTypes = {
  title: PropTypes.string.isRequired,
  allThumbnails: PropTypes.arrayOf(PropTypes.string).isRequired,
  id: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
}

export default Gallery
