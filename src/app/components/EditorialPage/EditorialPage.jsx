import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { Container, themeColor } from '@datapunt/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import useDocumentTitle from '../../utils/useDocumentTitle'
import linkAttributesFromAction from '../../../shared/services/link-attributes-from-action/linkAttributesFromAction'
import LoadingIndicator from '../../../shared/components/loading-indicator/LoadingIndicator'
import getImageFromCms from '../../utils/getImageFromCms'
import environment from '../../../environment'

const BodyStyle = styled.div`
  background-color: ${themeColor('level', 'level1')}
  position: relative;
  width: 100%;
`

const EditorialPage = ({
  children,
  documentTitle,
  loading,
  linkAction,
  description,
  image,
  title,
}) => {
  const { setDocumentTitle } = useDocumentTitle()
  const { trackPageView } = useMatomo()

  React.useEffect(() => {
    if (documentTitle) {
      setDocumentTitle(documentTitle)
      trackPageView({ documentTitle })
    }
  }, [documentTitle])

  const href = linkAction && linkAttributesFromAction(linkAction).href

  const canonical = href && `${environment.ROOT}${href.substr(1)}`

  const ogImage = image && getImageFromCms(image, 600, 300)

  return (
    <Container>
      <Helmet>
        {canonical && <link rel="canonical" href={canonical} />}
        {description && <meta name="description" content={description} />}

        {title && <meta name="og:title" content={title} />}
        {ogImage && <meta name="og:image" content={ogImage} />}
        {canonical && <meta name="og:url" content={canonical} />}
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
        {loading && <LoadingIndicator />}
        {children}
      </BodyStyle>
    </Container>
  )
}

EditorialPage.defaultProps = {
  documentTitle: '',
  loading: false,
  linkAction: null,
}

EditorialPage.propTypes = {
  documentTitle: PropTypes.string,
  linkAction: PropTypes.shape({}),
  loading: PropTypes.bool,
}

export default EditorialPage
