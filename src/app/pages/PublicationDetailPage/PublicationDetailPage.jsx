import {
  Column,
  CustomHTMLBlock,
  EditorialContent,
  EditorialMetaList,
  Heading,
  Paragraph,
  Row,
} from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import environment from '../../../environment'
import { cmsConfig } from '../../../shared/config/config'
import { toPublicationDetail } from '../../../store/redux-first-router/actions'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import DocumentCover from '../../components/DocumentCover/DocumentCover'
import EditorialPage from '../../components/EditorialPage/EditorialPage'
import ShareBar from '../../components/ShareBar/ShareBar'
import getImageFromCms from '../../utils/getImageFromCms'
import useDownload from '../../utils/useDownload'
import useFromCMS from '../../utils/useFromCMS'

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
