import { Container, themeColor } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import type { LocationDescriptorObject } from 'history'
import environment from '../../../environment'
import { toNotFound } from '../../links'
import getImageFromCms from '../../utils/getImageFromCms'
import useDocumentTitle from '../../utils/useDocumentTitle'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

const BodyStyle = styled.div`
  background-color: ${themeColor('tint', 'level1')};
  position: relative;
  width: 100%;
`

export interface EditorialPageProps {
  documentTitle?: string
  loading: boolean
  link?: LocationDescriptorObject | null
  description?: string
  image?: string
  title?: string
  lang?: string
  error: boolean
}

const EditorialPage: FunctionComponent<EditorialPageProps> = ({
  children,
  documentTitle,
  loading,
  link,
  description,
  image,
  title,
  lang,
  error,
}) => {
  const history = useHistory()
  const { setDocumentTitle } = useDocumentTitle()
  const { trackPageView } = useMatomo()

  useEffect(() => {
    if (documentTitle) {
      setDocumentTitle(documentTitle)
      trackPageView({ documentTitle })
    }
  }, [documentTitle])

  useEffect(() => {
    if (error) {
      history.replace(toNotFound())
    }
  }, [error])

  const path = useMemo(() => (link ? history.createHref(link) : null), [link])
  const canonicalUrl = path ? `${environment.ROOT}${path.substr(1)}` : null
  const ogImage = typeof image === 'string' && getImageFromCms(image, 600, 300)

  return (
    <Container>
      <Helmet>
        <html lang={lang || 'nl'} />
        {canonicalUrl && <link data-testid="canonicalUrl" rel="canonical" href={canonicalUrl} />}
        {description && <meta name="description" content={description} />}

        {title && <meta name="og:title" content={title} />}
        {ogImage && <meta name="og:image" content={ogImage} />}
        {canonicalUrl && <meta name="og:url" content={canonicalUrl} />}
        {description && <meta name="og:description" content={description} />}
        {ogImage && <meta property="og:image:width" content="600" />}
        {ogImage && <meta property="og:image:height" content="300" />}

        {title && <meta name="twitter:title" content={title} />}
        {description && <meta name="twitter:description" content={description} />}
        <meta name="twitter:site" content="@DataLabAdam" />
        {ogImage && <meta name="twitter:card" content={ogImage} />}
        {ogImage && <meta name="twitter:image" content={ogImage} />}
      </Helmet>
      <BodyStyle>
        {loading && <LoadingSpinner data-testid="loadingSpinner" />}
        {children}
      </BodyStyle>
    </Container>
  )
}

export default EditorialPage
