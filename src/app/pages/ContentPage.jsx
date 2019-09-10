import React from 'react'
import PropTypes from 'prop-types'
import angular from 'angular'
import { AngularWrapper } from 'react-angular'
import { connect } from 'react-redux'
import Footer from '../components/Footer/Footer'
import ShareBar from '../components/ShareBar/ShareBar'
import { getItem, getTemplateName, getType } from '../../shared/ducks/content/selectors' // TODO: refactor, test
import '../angularModules'

/* istanbul ignore next */ const ContentPage = ({ templateName, item, type, showFooter }) => (
  <div
    style={{ display: 'block' }}
    className="c-dashboard__column  u-col-sm--12 qa-dashboard__column--right"
  >
    <div className="c-dashboard__page o-max-width">
      <div className="c-dashboard__page-inner c-dashboard__content o-max-width__inner u-gutter">
        <div className="qa-page">
          <AngularWrapper
            moduleName="dpPageWrapper"
            component="dpPage"
            angularInstance={angular}
            dependencies={['atlas']}
            interpolateBindings={{
              name: templateName,
              type,
              item,
            }}
          />
          <div className="u-col-sm--offset-1 u-col-sm--7">
            <ShareBar />
          </div>
        </div>
      </div>
      {showFooter && <Footer />}
    </div>
  </div>
)

ContentPage.defaultProps = {
  showFooter: false,
}

ContentPage.propTypes = {
  templateName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  item: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  showFooter: PropTypes.bool,
}

const mapStateToProps = state => ({
  item: getItem(state),
  type: getType(state),
  templateName: getTemplateName(state),
})

export default connect(
  mapStateToProps,
  null,
)(ContentPage)
