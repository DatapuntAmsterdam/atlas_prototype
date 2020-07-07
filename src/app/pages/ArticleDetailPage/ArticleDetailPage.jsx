import styled, { css } from 'styled-components'
import {
  Article,
  EditorialBody,
  EditorialContent,
  EditorialMetaList,
  EditorialSidebar,
  Column,
  CustomHTMLBlock,
  Heading,
  List,
  ListItem,
  Link,
  Typography,
  Row,
  themeColor,
  Paragraph,
  themeSpacing,
  breakpoint,
  Accordion,
  AccordionWrapper,
} from '@datapunt/asc-ui'
import React from 'react'
import { connect } from 'react-redux'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { getLocationPayload } from '../../../store/redux-first-router/selectors'
import useFromCMS from '../../utils/useFromCMS'
import EditorialPage from '../../components/EditorialPage/EditorialPage'
import { toArticleDetail } from '../../../store/redux-first-router/actions'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import { cmsConfig } from '../../../shared/config/config'
import normalizeDownloadsObject from '../../../normalizations/cms/normalizeDownloadFiles'
import { routing } from '../../routes'
import ShareBar from '../../components/ShareBar/ShareBar'
import getImageFromCms from '../../utils/getImageFromCms'
import EditorialResults from '../../components/EditorialResults'
import useDownload from '../../utils/useDownload'
import { EDITORIAL_FIELD_TYPE_VALUES } from '../../../normalizations/cms/useNormalizedCMSResults'
import { CmsType } from '../../../shared/config/cms.config'
import environment from '../../../environment'

const ListItemContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  & > * {
    font-weight: 700;
    color: inherit;
  }
`

const DownloadLink = styled(Link).attrs({
  type: 'button',
})`
  text-align: left;
  background-color: ${themeColor(
    'tint',
    'level1',
  )}; // Buttons are grey by default on Safari and Firefox

  small {
    text-transform: uppercase;
    color: ${themeColor('tint', 'level6')};
  }
`

const StyledHeading = styled(Heading)`
  ${({ isContentType }) =>
    isContentType &&
    css`
      margin-bottom: ${themeSpacing(4)};
    `}
`

const StyledAccordionHeading = styled(Heading)`
  margin-top: ${themeSpacing(7)};
`

const StyledContentContainer = styled(ContentContainer)`
  ${({ hasImage }) =>
    hasImage &&
    css`
      @media screen and ${breakpoint('max-width', 'tabletM')} {
        margin-top: 0px;
      }
    `}
`

const StyledRow = styled(Row)`
  @media screen and ${breakpoint('max-width', 'tabletM')} {
    padding-left: 0px;
    padding-right: 0px;
  }
`

const EditorialBodyStyled = styled(EditorialBody)`
  width: 100%;
`

const Divider = styled.div`
  width: 200px;
  height: 3px;
  background-color: ${themeColor('secondary')};
  margin: ${themeSpacing(8, 0, 6)};
`

const StyledEditorialResults = styled(EditorialResults)`
  margin-bottom: ${themeSpacing(25)};
`

const StyledAccordion = styled(Accordion)`
  margin-top: ${themeSpacing(2)};
`

const StyledLink = styled(Link)`
  & > * {
    pointer-events: none;
  }
`

const ArticleDetailPage = ({ id }) => {
  const { fetchData, results, loading, error } = useFromCMS(cmsConfig.ARTICLE, id)
  const [, downloadFile] = useDownload()

  React.useEffect(() => {
    fetchData()
  }, [id])

  const {
    title,
    localeDate,
    localeDateFormatted,
    body,
    coverImage,
    field_downloads: downloads,
    links,
    field_byline: byline,
    field_accordions: accordions,
    slug,
    intro,
    field_type: articleType,
    related,
  } = results || {}

  const image = getImageFromCms(coverImage, 1200, 600)

  const { trackEvent } = useMatomo()

  React.useEffect(() => {
    if (error) {
      window.location.replace(routing.niet_gevonden.path)
    }
  }, [error])

  const documentTitle = title && `Artikel: ${title}`
  const linkAction = slug && toArticleDetail(id, slug)

  const normalizedDownloads = normalizeDownloadsObject(downloads)

  const isContentType = articleType === EDITORIAL_FIELD_TYPE_VALUES.CONTENT

  return (
    <EditorialPage
      {...{ documentTitle, loading, linkAction, title }}
      image={coverImage}
      description={intro}
    >
      {!loading && (
        <StyledRow>
          <StyledContentContainer hasImage={!!image}>
            <Article image={image}>
              <Row>
                <EditorialContent>
                  <Column
                    wrap
                    span={{ small: 1, medium: 2, big: 5, large: 11, xLarge: 11 }}
                    push={{ small: 0, medium: 0, big: 1, large: 1, xLarge: 1 }}
                  >
                    <Column span={{ small: 1, medium: 2, big: 4, large: 7, xLarge: 7 }}>
                      <EditorialBodyStyled>
                        <StyledHeading forwardedAs="h1" isContentType={!isContentType}>
                          {title}
                        </StyledHeading>
                        {isContentType && (
                          <EditorialMetaList
                            dateTime={localeDate}
                            dateFormatted={localeDateFormatted}
                            fields={byline && [{ id: 1, label: byline }]}
                          />
                        )}
                        <Paragraph strong dangerouslySetInnerHTML={{ __html: intro }} />
                        {typeof body === 'string' && (
                          <CustomHTMLBlock body={body.replace('http://', 'https://')} />
                        )}
                        {accordions?.length && (
                          <AccordionWrapper>
                            {accordions.map(
                              ({
                                field_accordion_title: accordionTitle,
                                field_accordion_content: accordionContent,
                                field_accordion_intro: accordionIntro,
                                field_accordion_label: accordionLabel,
                              }) => (
                                <>
                                  {accordionTitle && (
                                    <StyledAccordionHeading forwardedAs="h3">
                                      {accordionTitle}
                                    </StyledAccordionHeading>
                                  )}
                                  {accordionIntro?.processed && (
                                    <CustomHTMLBlock body={accordionIntro.processed} />
                                  )}
                                  {accordionLabel && accordionContent?.processed && (
                                    <StyledAccordion title={accordionLabel}>
                                      <CustomHTMLBlock body={accordionContent.processed} />
                                    </StyledAccordion>
                                  )}
                                </>
                              ),
                            )}
                          </AccordionWrapper>
                        )}
                        {related && related.length ? (
                          <>
                            <Divider />
                            <StyledEditorialResults
                              headingLevel="h2"
                              type={CmsType.Article}
                              results={related}
                              errors={[]}
                              title="Verder lezen"
                            />
                          </>
                        ) : null}
                      </EditorialBodyStyled>
                    </Column>
                    <Column
                      span={{ small: 1, medium: 2, big: 2, large: 3, xLarge: 3 }}
                      push={{ small: 0, medium: 0, big: 0, large: 1, xLarge: 1 }}
                    >
                      <EditorialSidebar>
                        {normalizedDownloads && normalizedDownloads.length ? (
                          <>
                            <Heading as="h2">Downloads</Heading>
                            <List>
                              {normalizedDownloads.map(({ fileName, key, type, size, url }) => (
                                <ListItem key={key}>
                                  <DownloadLink
                                    forwardedAs="button"
                                    onClick={() => {
                                      trackEvent({
                                        category: 'Download',
                                        action: 'artikel-download',
                                        name: fileName,
                                      })
                                      downloadFile(`${environment.CMS_ROOT}${url}`)
                                    }}
                                    variant="with-chevron"
                                  >
                                    <ListItemContent>
                                      <span>{fileName}</span>
                                      <Typography as="small">({`${type} ${size}`})</Typography>
                                    </ListItemContent>
                                  </DownloadLink>
                                </ListItem>
                              ))}
                            </List>
                          </>
                        ) : null}
                        {links && links.length ? (
                          <>
                            <Heading as="h2">Links</Heading>
                            <List>
                              {links.map(({ uri, title: linkTitle }) => (
                                <ListItem key={uri}>
                                  <StyledLink variant="with-chevron" href={`${uri}`}>
                                    <span>{linkTitle}</span>
                                  </StyledLink>
                                </ListItem>
                              ))}
                            </List>
                          </>
                        ) : null}
                      </EditorialSidebar>
                    </Column>
                  </Column>
                  <Column
                    span={{ small: 1, medium: 2, big: 4, large: 11, xLarge: 11 }}
                    push={{ small: 0, medium: 0, big: 1, large: 1, xLarge: 1 }}
                  >
                    <ShareBar topSpacing={6} />
                  </Column>
                </EditorialContent>
              </Row>
            </Article>
          </StyledContentContainer>
        </StyledRow>
      )}
    </EditorialPage>
  )
}

const mapStateToProps = (state) => {
  const { id } = getLocationPayload(state)
  return {
    id,
  }
}

export default connect(mapStateToProps, null)(ArticleDetailPage)
