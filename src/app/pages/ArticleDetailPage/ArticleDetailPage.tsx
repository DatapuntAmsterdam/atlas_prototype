import {
  Accordion,
  AccordionWrapper,
  Article,
  breakpoint,
  Column,
  CustomHTMLBlock,
  EditorialBody,
  EditorialContent,
  EditorialMetaList,
  EditorialSidebar,
  Heading,
  Link,
  List,
  ListItem,
  Paragraph,
  Row,
  themeColor,
  themeSpacing,
  Typography,
} from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import usePromise, { isFulfilled, isPending, isRejected } from '@amsterdam/use-promise'
import { Fragment, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import type { FunctionComponent } from 'react'
import environment from '../../../environment'
import normalizeDownloadsObject from '../../../normalizations/cms/normalizeDownloadFiles'
import { EDITORIAL_FIELD_TYPE_VALUES } from '../../../normalizations/cms/normalizeCMSResults'
import cmsConfig from '../../../shared/config/cms.config'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import EditorialPage from '../../components/EditorialPage/EditorialPage'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import ShareBar from '../../components/ShareBar/ShareBar'
import { toArticleDetail } from '../../links'
import getImageFromCms from '../../utils/getImageFromCms'
import useDownload from '../../utils/useDownload'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import { fetchSingleFromCms } from '../../utils/fetchFromCms'

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

  &:disabled {
    cursor: default;
  }
`

const StyledHeading = styled(Heading)<{ isContentType: boolean }>`
  ${({ isContentType }) =>
    isContentType &&
    css`
      margin-bottom: ${themeSpacing(4)};
    `}
`

const StyledAccordionHeading = styled(Heading)`
  margin-top: ${themeSpacing(7)};
`

const StyledContentContainer = styled(ContentContainer)<{ hasImage: boolean }>`
  ${({ hasImage }) =>
    hasImage &&
    css`
      @media screen and ${breakpoint('max-width', 'tabletM')} {
        margin-top: 0;
      }
    `}
`

const StyledRow = styled(Row)`
  @media screen and ${breakpoint('max-width', 'tabletM')} {
    padding-left: 0;
    padding-right: 0;
  }
`

const EditorialBodyStyled = styled(EditorialBody)`
  width: 100%;
`

const StyledAccordion = styled(Accordion)`
  margin-top: ${themeSpacing(2)};
`

const StyledLink = styled(Link)`
  & > * {
    pointer-events: none;
  }
`

const FileInfo = styled(Typography)`
  display: inline-flex;
`

const StyledLoadingSpinner = styled(LoadingSpinner)`
  width: 15px;
  margin-left: ${themeSpacing(2)};
`

const ArticleDetailPage: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>()
  const [retryCount, setRetryCount] = useState(0)

  const [downloadLoading, downloadFile] = useDownload()

  const result = usePromise(
    () => fetchSingleFromCms(cmsConfig.ARTICLE.endpoint(id), cmsConfig.ARTICLE.fields),
    [id, retryCount],
  )

  const { trackEvent } = useMatomo()

  const image = useMemo(
    () =>
      isFulfilled(result) && result.value.coverImage
        ? getImageFromCms(result.value.coverImage, 1200, 600)
        : null,
    [result],
  )

  const link = useMemo(
    () =>
      isFulfilled(result) && result.value.slug
        ? toArticleDetail(result.value.id as string, result.value.slug)
        : null,
    [result],
  )
  const normalizedDownloads = useMemo(
    () =>
      isFulfilled(result) &&
      result.value.field_downloads &&
      normalizeDownloadsObject(result.value.field_downloads),
    [result],
  )

  if (isPending(result)) {
    return <LoadingSpinner />
  }
  if (isRejected(result)) {
    return (
      <ErrorMessage
        absolute
        message="Er is een fout opgetreden bij het laden van deze pagina."
        buttonLabel="Probeer opnieuw"
        buttonOnClick={() => setRetryCount(retryCount + 1)}
      />
    )
  }
  const {
    title,
    localeDate,
    localeDateFormatted,
    body,
    coverImage,
    links,
    field_byline: byline,
    field_accordions: accordions,
    intro,
    field_language: lang,
  } = result.value
  const isContentType = result?.value.field_type === EDITORIAL_FIELD_TYPE_VALUES.CONTENT

  const documentTitle = title && `Artikel: ${title}`

  return (
    <EditorialPage
      error={false}
      loading={false}
      documentTitle={documentTitle}
      link={link}
      title={title}
      lang={lang}
      image={coverImage}
      description={intro}
    >
      <StyledRow>
        <StyledContentContainer hasImage={!!image}>
          {/*
            // @ts-ignore */}
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
                          // @ts-ignore
                          dateTime={localeDate}
                          dateFormatted={localeDateFormatted}
                          // @ts-ignore
                          fields={byline && [{ id: 1, label: byline }]}
                        />
                      )}
                      {intro && <Paragraph strong dangerouslySetInnerHTML={{ __html: intro }} />}
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
                              <Fragment key={`${accordionTitle}_${accordionLabel}`}>
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
                              </Fragment>
                            ),
                          )}
                        </AccordionWrapper>
                      )}
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
                                  disabled={downloadLoading}
                                  forwardedAs="button"
                                  onClick={() => {
                                    trackEvent({
                                      category: 'Download',
                                      action: 'artikel-download',
                                      name: fileName,
                                    })
                                    downloadFile(`${environment.CMS_ROOT}${url}`)
                                  }}
                                  inList
                                >
                                  <ListItemContent>
                                    <span>{fileName}</span>
                                    <FileInfo as="small">
                                      ({`${type} ${size}`})
                                      {downloadLoading && <StyledLoadingSpinner size={15} />}
                                    </FileInfo>
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
                                <StyledLink inList href={`${uri}`}>
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
    </EditorialPage>
  )
}

export default ArticleDetailPage
