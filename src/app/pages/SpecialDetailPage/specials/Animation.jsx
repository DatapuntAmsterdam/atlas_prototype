import React from 'react'
import {
  Column,
  Paragraph,
  CustomHTMLBlock,
  EditorialContent,
  Heading,
  EditorialMetaList,
  themeColor,
  themeSpacing,
  Link,
} from '@datapunt/asc-ui'
import styled from 'styled-components'
import ShareBar from '../../../components/ShareBar/ShareBar'
import Video from '../../../components/Video/Video'

const StyledColumn = styled(Column)`
  margin-bottom: ${themeSpacing(5)};
  align-self: flex-start;

  // The video tag is target through the column as the Video component is using a complex SASS setup, this can be changed if that component gets refactored in the future
  & video {
    max-width: 100%;
    border: 1px solid ${themeColor('tint', 'level3')};
  }
`

const StyledLink = styled(Link)`
  display: flex;
  margin-bottom: ${themeSpacing(4)};
`

const Animation = ({ contentLink, title, results }) => {
  const {
    body,
    field_intro: intro,
    localeDateFormatted,
    field_subtitle_link: subtitleLink,
    field_subtitle_default: enableSubtitleByDefault,
    field_links: links,
  } = results
  const subtitleUri = subtitleLink?.uri

  return (
    <>
      <Column wrap span={{ small: 1, medium: 4, big: 6, large: 12, xLarge: 12 }}>
        <Column
          span={{
            small: 1,
            medium: 4,
            big: 6,
            large: 12,
            xLarge: 12,
          }}
        >
          <EditorialContent>
            <Heading>{title}</Heading>
            <EditorialMetaList fields={[{ id: 1, label: localeDateFormatted }]} />
          </EditorialContent>
        </Column>

        <StyledColumn span={{ small: 1, medium: 4, big: 3, large: 6, xLarge: 6 }}>
          {contentLink && contentLink.uri && (
            <Video
              src={contentLink.uri}
              type="video/mp4" // For now it's assumed the videos are always in MP4 format
              showControls
            >
              {subtitleUri && (
                <track
                  default={!!enableSubtitleByDefault}
                  src={subtitleUri}
                  kind="subtitles"
                  srcLang="nl"
                  label="Dutch"
                />
              )}
            </Video>
          )}
        </StyledColumn>
        <Column span={{ small: 1, medium: 4, big: 3, large: 6, xLarge: 6 }}>
          <EditorialContent>
            {intro && <Paragraph strong dangerouslySetInnerHTML={{ __html: intro }} />}
            {body && <CustomHTMLBlock body={body} />}
            {links?.length
              ? links.map(({ uri, title: linkTitle }) => (
                  <StyledLink variant="with-chevron" href={uri} title={linkTitle} target="_blank">
                    {linkTitle}
                  </StyledLink>
                ))
              : null}
          </EditorialContent>
        </Column>
      </Column>
      <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
        <ShareBar topSpacing={6} />
      </Column>
    </>
  )
}

export default Animation
