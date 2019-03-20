import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { getEmbedButtonLink } from '../../../shared/services/embed-url/embed-url';
import { toggleEmbedButtonAction } from '../../../map/ducks/map/actions';

const MapEmbedButton = ({ toggleEmbedButton }) => (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      toggleEmbedButton();
      setTimeout(() => window.open(getEmbedButtonLink(), '_blank'), 300);
    }}
    title="Naar interactieve kaart (Amsterdam City Data)"
    className="c-embed-button qa-embed-button"
  >
    <span className="c-embed-button__icon c-embed-button__icon--maximize" />
    <span className="c-embed-button__label">City Data</span>
  </button>
);

const mapDispatchToProps = (dispatch) => bindActionCreators({
  toggleEmbedButton: toggleEmbedButtonAction
}, dispatch);

MapEmbedButton.propTypes = {
  toggleEmbedButton: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(MapEmbedButton);
