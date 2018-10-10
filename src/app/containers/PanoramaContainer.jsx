import React from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { AngularWrapper } from 'react-angular';
import { getStraatbeeld } from '../../shared/ducks/straatbeeld/straatbeeld';

const mapStateToProps = (state) => ({
  straatbeeldState: getStraatbeeld(state),
  isPrintMode: state.ui.isPrintMode,
  isEmbedPreview: state.ui.isEmbedPreview,
  isEmbed: state.ui.isEmbed
});

const PanoramaContainer = ({
  straatbeeldState,
  isPrintMode,
  isEmbedPreview,
  isEmbed,
  visibility,
  columnSizes
}) => (
  <AngularWrapper
    moduleName={'dpStraatbeeldWrapper'}
    component="dpStraatbeeld"
    dependencies={['atlas']}
    bindings={{
      state: straatbeeldState,
      resize: [
        isPrintMode,
        isEmbedPreview,
        isEmbed,
        visibility.error,
        visibility.straatbeeld,
        columnSizes.right
      ]
    }}
  />
);

PanoramaContainer.defaultProps = {
  columnSizes: {
    right: 4
  },
  visibility: {
    error: false,
    straatbeeld: true
  }
};

PanoramaContainer.propTypes = {
  straatbeeldState: PropTypes.shape({}).isRequired,
  isPrintMode: PropTypes.bool.isRequired,
  isEmbedPreview: PropTypes.bool.isRequired,
  isEmbed: PropTypes.bool.isRequired,
  columnSizes: PropTypes.shape({
    right: PropTypes.number
  }),
  visibility: PropTypes.shape({
    error: PropTypes.bool,
    straatbeeld: PropTypes.bool
  })
};

export default connect(mapStateToProps, null)(PanoramaContainer);
