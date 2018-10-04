import React from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { AngularWrapper } from 'react-angular';

const mapStateToProps = (state) => ({
  straatbeeldState: state.straatbeeldState,
  isPrintMode: state.ui.isPrintMode,
  isEmbedPreview: state.ui.isEmbedPreview,
  isEmbed: state.ui.isEmbed
});

const StraatBeeldContainer = ({
  straatbeeldState,
  isPrintMode,
  isEmbedPreview,
  isEmbed,
  visibility,
  columnSizes
}) => (
  <AngularWrapper
    moduleName={'dpStraatbeeldWrapper'}
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
  >
    <div className="u-full-height qa-straatbeeld">
      <dp-straatbeeld
        state="state"
        resize="resize"
      />
    </div>
  </AngularWrapper>
);

StraatBeeldContainer.defaultProps = {
  columnSizes: {
    right: 4
  },
  visibility: PropTypes.shape({
    error: false,
    straatbeeld: true
  })
};

StraatBeeldContainer.propTypes = {
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

export default connect(mapStateToProps, null)(StraatBeeldContainer);
