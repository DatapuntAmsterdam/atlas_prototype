import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import styled from '@datapunt/asc-core'
import { Container, themeColor } from '@datapunt/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import useDocumentTitle from '../../utils/useDocumentTitle'
import linkAttributesFromAction from '../../../shared/services/link-attributes-from-action/linkAttributesFromAction'
import '../../../map/components/loading-indicator/LoadingIndicator.scss'
import LoadingIndicator from '../../../shared/components/loading-indicator/LoadingIndicator'

const StyledContainer = styled(Container)`
  min-height: 50vh; // Makes sure the loading indicator is displayed inside the page
`
const BodyStyle = styled.div`
  background-color: ${themeColor('level', 'level1')}
  position: relative;
  width: 100%;
`

const EditorialPage = ({ children, documentTitle, loading, linkAction, description }) => {
  const { setDocumentTitle } = useDocumentTitle()
  const { trackPageView } = useMatomo()

  React.useEffect(() => {
    if (documentTitle) {
      setDocumentTitle(documentTitle)
      trackPageView({ documentTitle })
    }
  }, [documentTitle])

  const href = linkAction && linkAttributesFromAction(linkAction).href

  return (
    <StyledContainer>
      <Helmet>
        {href && <link rel="canonical" href={href} />}
        {description && <meta name="description" content={description} />}
      </Helmet>
      <BodyStyle>
        {loading && <LoadingIndicator />}
        {children}
      </BodyStyle>
    </StyledContainer>
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
