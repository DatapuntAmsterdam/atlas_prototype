import { Column, Row } from '@amsterdam/asc-ui'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import cmsConfig, { SpecialType } from '../../../shared/config/cms.config'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import EditorialPage from '../../components/EditorialPage/EditorialPage'
import IFrame from '../../components/IFrame/IFrame'
import { toSpecialDetail } from '../../links'
import Animation from './specials/Animation'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import usePromise, { isFulfilled, isPending, isRejected } from '@amsterdam/use-promise'
import { fetchSingleFromCms } from '../../utils/fetchFromCms'

const SpecialDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [retryCount, setRetryCount] = useState(0)

  const result = usePromise(
    () => fetchSingleFromCms(cmsConfig.SPECIAL.endpoint(id), cmsConfig.SPECIAL.fields),
    [id, retryCount],
  )

  if (isPending(result)) {
    return <LoadingSpinner />
  }

  if (
    isRejected(result) ||
    (isFulfilled(result) && (!result.value.slug || !result.value.specialType))
  ) {
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
    field_content_link: contentLink,
    slug,
    specialType,
    title,
    field_language: lang,
  } = result.value

  const documentTitle = title && `Special: ${title}`
  const link = toSpecialDetail(id, specialType ?? '', slug ?? '')

  return (
    <EditorialPage {...{ documentTitle, link, lang, error: false, loading: false }}>
      <Row>
        <ContentContainer>
          {specialType === SpecialType.Animation && (
            <Animation contentLink={contentLink} title={title} results={result.value} />
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
