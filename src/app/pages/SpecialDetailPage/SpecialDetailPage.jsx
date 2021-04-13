import { Column, Row } from '@amsterdam/asc-ui'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import cmsConfig, { SpecialType } from '../../../shared/config/cms.config'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import EditorialPage from '../../components/EditorialPage/EditorialPage'
import IFrame from '../../components/IFrame/IFrame'
import { toSpecialDetail } from '../../links'
import useFromCMS from '../../utils/useFromCMS'
import Animation from './specials/Animation'

const SpecialDetailPage = () => {
  const { id } = useParams()
  const { fetchData, results, loading, error } = useFromCMS(cmsConfig.SPECIAL, id)

  useEffect(() => {
    fetchData()
  }, [id])

  const { field_content_link: contentLink, slug, specialType, title, field_language: lang } =
    results || {}
  const documentTitle = title && `Special: ${title}`
  const link = toSpecialDetail(id, specialType, slug)

  return (
    <EditorialPage {...{ documentTitle, link, lang, error, loading }}>
      <Row>
        <ContentContainer>
          {specialType === SpecialType.Animation && (
            <Animation contentLink={contentLink} title={title} results={results} />
          )}
          {(specialType === SpecialType.Dashboard || specialType === SpecialType.Story) && (
            <Column wrap span={{ small: 12, medium: 12, big: 12, large: 12, xLarge: 12 }}>
              <IFrame contentLink={contentLink} title={title} />
            </Column>
          )}
        </ContentContainer>
      </Row>
    </EditorialPage>
  )
}

export default SpecialDetailPage
