import {
  Column,
  CustomHTMLBlock,
  EditorialContent,
  EditorialMetaList,
  Heading,
  Paragraph,
  Row,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import environment from '../../../environment'
import { cmsConfig } from '../../../shared/config/config'
import useNormalizedCMSResults from '../../../normalizations/cms/useNormalizedCMSResults'
import { toPublicationDetail } from '../../../store/redux-first-router/actions'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import DocumentCover from '../../components/DocumentCover/DocumentCover'
import EditorialPage from '../../components/EditorialPage/EditorialPage'
import EditorialResults from '../../components/EditorialResults'
import ShareBar from '../../components/ShareBar/ShareBar'
import getImageFromCms from '../../utils/getImageFromCms'
import useDownload from '../../utils/useDownload'
import useFromCMS from '../../utils/useFromCMS'

const Divider = styled.hr`
  width: 200px;
  height: 3px;
  background-color: ${themeColor('secondary')};
  margin: ${themeSpacing(8, 0, 6)};
`

const StyledEditorialResults = styled(EditorialResults)`
  margin-bottom: ${themeSpacing(25)};
`

const PublicationDetailPage = () => {
  const { id } = useParams()
  const { fetchData, results, loading, error } = useFromCMS(cmsConfig.PUBLICATION, id)
  const [downloadLoading, downloadFile] = useDownload()
  const { trackEvent } = useMatomo()

  useEffect(() => {
    fetchData()
  }, [id])

  const {
    title,
    localeDateFormatted,
    body,
    coverImage,
    fileUrl,
    field_file_size: fileSize,
    field_file_type: fileType,
    field_publication_source: source,
    field_intro: intro,
    field_language: lang,
    slug,
    related,
  } = results || {}

  const documentTitle = title && `Publicatie: ${title}`
  const linkAction = toPublicationDetail(id, slug)

  return (
    <EditorialPage {...{ documentTitle, loading, linkAction, lang, error }} description={intro}>
      {!loading && (
        <Column wrap="true" span={{ small: 1, medium: 4, big: 6, large: 12, xLarge: 12 }}>
          <ContentContainer>
            <Row>
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
                    <Heading as="h1">{title}</Heading>
                    <EditorialMetaList
                      fields={[
                        { id: 1, label: source },
                        { id: 4, label: localeDateFormatted },
                        { id: 2, label: fileSize },
                        { id: 3, label: fileType.toUpperCase() },
                      ]}
                    />
                  </EditorialContent>
                </Column>

                <Column span={{ small: 1, medium: 4, big: 3, large: 6, xLarge: 6 }}>
                  <DocumentCover
                    imageSrc={getImageFromCms(coverImage, 600, 0, 'fit')}
                    description={`Download PDF (${fileSize})`}
                    loading={downloadLoading}
                    title={title}
                    onClick={() => {
                      trackEvent({
                        category: 'Download',
                        action: 'publicatie-download',
                        name: title,
                      })
                      downloadFile(`${environment.CMS_ROOT}${fileUrl && fileUrl.substring(1)}`)
                    }}
                  />
                </Column>
                <Column span={{ small: 1, medium: 4, big: 3, large: 6, xLarge: 6 }}>
                  <EditorialContent>
                    {intro && <Paragraph strong dangerouslySetInnerHTML={{ __html: intro }} />}
                    {body && <CustomHTMLBlock body={body} />}
                  </EditorialContent>
                </Column>

                {related?.length ? (
                  <Column span={{ small: 1, medium: 4, big: 4, large: 7, xLarge: 7 }}>
                    <EditorialContent>
                      <Divider />
                      <StyledEditorialResults
                        headingLevel="h2"
                        results={useNormalizedCMSResults(related)}
                        errors={[]}
                        title="Verder lezen"
                      />
                    </EditorialContent>
                  </Column>
                ) : null}
              </Column>
              <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
                <ShareBar topSpacing={6} />
              </Column>
            </Row>
          </ContentContainer>
        </Column>
      )}
    </EditorialPage>
  )
}

export default PublicationDetailPage
