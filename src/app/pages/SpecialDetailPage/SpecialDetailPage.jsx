import { Column, Row } from '@datapunt/asc-ui'
import React from 'react'
import { connect } from 'react-redux'
import { getLocationPayload } from '../../../store/redux-first-router/selectors'
import setIframeSize from '../../../shared/services/set-iframe-size/setIframeSize'
import useFromCMS from '../../utils/useFromCMS'
import './SpecialDetailPage.scss'
import EditorialPage from '../../components/EditorialPage/EditorialPage'
import cmsConfig from '../../../shared/config/cms.config'
import { toSpecialDetail } from '../../../store/redux-first-router/actions'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import { routing } from '../../routes'

const SpecialDetailPage = ({ id }) => {
  const { fetchData, results, loading, error } = useFromCMS(cmsConfig.SPECIAL, id)
  const [iframeLoading, setIframeLoading] = React.useState(true)
  const [iframeHeight, setIframeHeight] = React.useState(0)
  const iframeRef = React.useRef(null)

  const handleResize = () => {
    setIframeSize(setIframeHeight)
  }

  const iframeLoaded = () => {
    setIframeLoading(false)

    // Handle resize after the iframe is loaded
    handleResize(setIframeHeight)
  }

  React.useEffect(() => {
    fetchData()
  }, [id])

  React.useEffect(() => {
    window.addEventListener('resize', handleResize)

    return function cleanup() {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  React.useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.height = `${iframeHeight}px`
    }
  }, [iframeHeight])

  React.useEffect(() => {
    if (error) {
      window.location.replace(routing.niet_gevonden.path)
    }
  }, [error])

  const { field_iframe_link: iframeLink, field_slug: slug, field_special_type: type, title } =
    results || {}
  const documentTitle = title && `Special: ${title}`
  const linkAction = toSpecialDetail(id, type, slug)

  return (
    <EditorialPage {...{ documentTitle, linkAction }} loading={iframeLoading || loading}>
      <div className="iframe-container ">
        <Row>
          <ContentContainer>
            <Column wrap span={{ small: 12, medium: 12, big: 12, large: 12, xLarge: 12 }}>
              {iframeLink && iframeLink.uri && (
                <iframe
                  src={iframeLink.uri}
                  title={title}
                  ref={iframeRef}
                  onLoad={iframeLoaded}
                  width="100%"
                  height={iframeHeight}
                  frameBorder="0"
                />
              )}
            </Column>
          </ContentContainer>
        </Row>
      </div>
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
)(SpecialDetailPage)
