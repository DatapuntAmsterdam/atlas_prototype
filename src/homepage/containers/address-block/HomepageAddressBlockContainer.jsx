import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchDataSelection } from '../../../header/ducks/search/search';

import HomepageAddressBlock from '../../components/address-block/HomepageAddressBlock';
import { switchPage } from '../../../shared/ducks/ui/ui';
import PAGES from '../../../pages';

const mapDispatchToProps = (dispatch) => ({
  onfetchDataSelection: (payload) => {
    dispatch(fetchDataSelection(payload));
    dispatch(switchPage(PAGES.DATASETS));
  }
});

const HomepageAddressBlockContainer = (props) => (
  <HomepageAddressBlock
    onLinkClick={props.onfetchDataSelection}
  />
);

HomepageAddressBlockContainer.contextTypes = {
  store: PropTypes.object.isRequired
};

HomepageAddressBlockContainer.propTypes = {
  onfetchDataSelection: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(HomepageAddressBlockContainer);
