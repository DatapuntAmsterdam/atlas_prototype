import React from 'react'
import { connect } from 'react-redux'
import download from 'downloadjs'
import {
  Column,
  Row,
  CustomHTMLBlock,
  EditorialHeader,
  EditorialMetaList,
  DocumentCover,
  EditorialContent,
  Paragraph,
} from '@datapunt/asc-ui'
import { getLocationPayload } from '../../../store/redux-first-router/selectors'
import useFromCMS from '../../utils/useFromCMS'
import EditorialPage from '../../components/EditorialPage/EditorialPage'
import cmsConfig from '../../../shared/services/cms/cms-config'
import { toPublicationDetail } from '../../../store/redux-first-router/actions'
import ContentContainer from '../../components/ContentContainer/ContentContainer'

const PublicationDetailPage = ({ id }) => {
  const { fetchData, results, loading } = useFromCMS(cmsConfig.PUBLICATION, id)

  React.useEffect(() => {
    fetchData()
  }, [id])

  const {
    title,
    localeDate,
    body,
    coverImageUrl,
    fileUrl,
    field_file_size: fileSize,
    field_file_type: fileType,
    field_publication_source: source,
    field_intro: intro,
    field_slug: slug,
  } = results || {}

  const documentTitle = title && `Publicatie: ${title}`
  const linkAction = toPublicationDetail(id, slug)

  return (
    <EditorialPage {...{ documentTitle, loading, linkAction }} description={intro}>
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
                    <EditorialHeader title={title} />
                    <EditorialMetaList
                      fields={[
                        { id: 1, label: source },
                        { id: 4, label: localeDate },
                        { id: 2, label: fileSize },
                        { id: 3, label: fileType.toUpperCase() },
                      ]}
                    />
                  </EditorialContent>
                </Column>
                <Column span={{ small: 1, medium: 4, big: 3, large: 6, xLarge: 6 }}>
                  <DocumentCover
                    imageSrc={coverImageUrl}
                    description={`Download PDF (${fileSize})`}
                    onClick={() => {
                      download(fileUrl)
                    }}
                  />
                </Column>
                <Column span={{ small: 1, medium: 4, big: 3, large: 6, xLarge: 6 }}>
                  <EditorialContent>
                    {intro && (
                      <Paragraph hasLongText strong>
                        {intro}
                      </Paragraph>
                    )}
                    {body && <CustomHTMLBlock body={body} />}
                  </EditorialContent>
                </Column>
              </Column>
            </Row>
          </ContentContainer>
        </Column>
      )}
    </EditorialPage>
  )
}

const mapStateToProps = state => {
  const { id } = getLocationPayload(state)
  return {
    id,
  }
}

export default connect(
  mapStateToProps,
  null,
)(PublicationDetailPage)
