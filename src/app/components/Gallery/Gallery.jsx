/* eslint-disable no-nested-ternary */
import { Enlarge, Minimise } from '@datapunt/asc-assets'
import {
  GridContainer,
  GridItem,
  Heading,
  Link,
  themeColor,
  themeSpacing,
  Alert,
} from '@datapunt/asc-ui'
import { PropTypes } from 'prop-types'
import React from 'react'
import RouterLink from 'redux-first-router-link'
import styled from 'styled-components'
import { SCOPES } from '../../../shared/services/auth/auth'
import getState from '../../../shared/services/redux/get-state'
import { toConstructionFileViewer } from '../../../store/redux-first-router/actions'
import ActionButton from '../ActionButton/ActionButton'
import IIIFThumbnail from '../IIIFThumbnail/IIIFThumbnail'
import NotificationLevel from '../../models/notification'

const StyledAlert = styled(Alert)`
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
const Gallery = ({ title, allFiles, id, maxLength, access }) => {
  const lessFiles = allFiles.slice(0, maxLength)
  const [files, setFiles] = React.useState(lessFiles)

  const { scopes } = getState().user

  const hasRights = scopes.includes(SCOPES['BD/R'])
  const hasExtendedRights = scopes.includes(SCOPES['BD/X'])

  const hasMore = allFiles.length > maxLength
  const restricted = access === 'RESTRICTED'

  return (
    <GalleryGridContainer key={title} direction="column" gutterX={20}>
      <GridItem>
        <StyledHeading color="secondary" forwardedAs="h3">
          {title} {hasMore && `(${allFiles.length})`}
        </StyledHeading>
        {files && files.length ? (
          <>
            {!hasRights && !hasExtendedRights ? (
              <StyledAlert level={NotificationLevel.Attention} compact dismissible>
                Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om bouwdossiers te
                bekijken.
              </StyledAlert>
            ) : (
              restricted &&
              !hasExtendedRights && (
                <StyledAlert level={NotificationLevel.Attention} compact dismissible>
                  Medewerkers/ketenpartners van Gemeente Amsterdam met extra bevoegdheden kunnen
                  inloggen om alle bouwdossiers te bekijken.
                </StyledAlert>
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
              {files.map(({ filename: fileName, url: fileUrl }) => (
                <GridItem
                  key={fileName}
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
                    to={toConstructionFileViewer(id, fileName, fileUrl)}
                    title={fileName}
                  >
                    <IIIFThumbnail
                      src={
                        hasExtendedRights || (!restricted && hasRights)
                          ? `${fileUrl}/square/180,180/0/default.jpg`
                          : '/assets/images/not_found_thumbnail.jpg' // use the default not found image when user has no rights
                      }
                      title={fileName}
                    />
                  </StyledLink>
                </GridItem>
              ))}
            </StyledGridContainer>
            {hasMore &&
              (allFiles.length !== files.length ? (
                <ActionButton
                  iconLeft={<Enlarge />}
                  onClick={() => setFiles(allFiles)}
                  label={`Toon alle (${allFiles.length})`}
                />
              ) : (
                <ActionButton
                  iconLeft={<Minimise />}
                  onClick={() => setFiles(lessFiles)}
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
  allFiles: PropTypes.arrayOf(
    PropTypes.shape({
      filename: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  id: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
}

export default Gallery
