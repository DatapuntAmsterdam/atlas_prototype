import { Alert, Container, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { LocationDescriptorObject } from 'history'
import { FunctionComponent, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import { To } from 'redux-first-router-link'
import styled from 'styled-components'
import environment from '../../../environment'
import linkAttributesFromAction from '../../../shared/services/link-attributes-from-action/linkAttributesFromAction'
import { routing } from '../../routes'
import getImageFromCms from '../../utils/getImageFromCms'
import useDocumentTitle from '../../utils/useDocumentTitle'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

const BodyStyle = styled.div`
  background-color: ${themeColor('tint', 'level1')};
  position: relative;
  width: 100%;
`

const StyledAlert = styled(Alert)`
  margin-top: ${themeSpacing(2)};
`

export interface EditorialPageProps {
  documentTitle?: string
  loading: boolean
  // TODO: Remove 'linkAction' when it is no longer used.
  linkAction?: To
  link?: LocationDescriptorObject
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
  linkAction,
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
      window.location.replace(routing.niet_gevonden.path)
    }
  }, [error])

  const path = useMemo(() => {
    if (link) {
      return history.createHref(link)
    }

    if (linkAction) {
      return linkAttributesFromAction(linkAction).href as string
    }

    return null
  }, [link, linkAction])

  const canonicalUrl = path ? `${environment.ROOT}${path.substr(1)}` : null
  const ogImage = typeof image === 'string' && getImageFromCms(image, 600, 300)

  return (
    <Container>
      <Helmet>
        <html lang={lang || 'nl'} />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
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
        <StyledAlert level="error">
          Er is een storing waardoor niet alle publicaties, afbeeldingen en overige bestanden
          beschikbaar zijn. Onze excuses, wij werken aan een oplossing.
        </StyledAlert>
        {loading && <LoadingSpinner />}
        {children}
      </BodyStyle>
    </Container>
  )
}

export default EditorialPage
