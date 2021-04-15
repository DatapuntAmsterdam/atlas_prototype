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
import { useMemo, useState } from 'react'
import usePromise, { isFulfilled, isPending, isRejected } from '@amsterdam/use-promise'
import { useParams } from 'react-router-dom'
import environment from '../../../environment'
import cmsConfig from '../../../shared/config/cms.config'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import DocumentCover from '../../components/DocumentCover/DocumentCover'
import EditorialPage from '../../components/EditorialPage/EditorialPage'
import ShareBar from '../../components/ShareBar/ShareBar'
import { toPublicationDetail } from '../../links'
import getImageFromCms from '../../utils/getImageFromCms'
import useDownload from '../../utils/useDownload'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import { fetchSingleFromCms } from '../../utils/fetchFromCms'

const PublicationDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [retryCount, setRetryCount] = useState(0)

  const result = usePromise(
    () => fetchSingleFromCms(cmsConfig.PUBLICATION.endpoint(id), cmsConfig.PUBLICATION.fields),
    [id, retryCount],
  )

  const [downloadLoading, downloadFile] = useDownload()
  const { trackEvent } = useMatomo()

  const link = useMemo(
    () =>
      isFulfilled(result) && result.value.slug ? toPublicationDetail(id, result.value.slug) : null,
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
    localeDateFormatted,
    body,
    coverImage,
    fileUrl,
    field_file_size: fileSize,
    field_file_type: fileType,
    field_publication_source: source,
    field_intro: intro,
    field_language: lang,
  } = result.value
  const documentTitle = title && `Publicatie: ${title}`

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
      <Column wrap span={{ small: 1, medium: 4, big: 6, large: 12, xLarge: 12 }}>
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
                      { id: 1, label: source ?? '' },
                      { id: 4, label: localeDateFormatted ?? '' },
                      { id: 2, label: fileSize ?? '' },
                      { id: 3, label: (fileType ?? '').toUpperCase() },
                    ]}
                  />
                </EditorialContent>
              </Column>

              <Column span={{ small: 1, medium: 4, big: 3, large: 6, xLarge: 6 }}>
                <DocumentCover
                  imageSrc={coverImage ? getImageFromCms(coverImage, 600, 0, 'fit') : ''}
                  description={`Download PDF (${fileSize ?? ''})`}
                  loading={downloadLoading}
                  title={title ?? ''}
                  onClick={() => {
                    trackEvent({
                      category: 'Download',
                      action: 'publicatie-download',
                      name: title,
                    })
                    downloadFile(`${environment.CMS_ROOT}${(fileUrl ?? '').substring(1)}`)
                  }}
                />
              </Column>
              <Column span={{ small: 1, medium: 4, big: 3, large: 6, xLarge: 6 }}>
                <EditorialContent>
                  {intro && <Paragraph strong dangerouslySetInnerHTML={{ __html: intro }} />}
                  {body && <CustomHTMLBlock body={body.value} />}
                </EditorialContent>
              </Column>
            </Column>
            <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
              <ShareBar topSpacing={6} />
            </Column>
          </Row>
        </ContentContainer>
      </Column>
    </EditorialPage>
  )
}

export default PublicationDetailPage
