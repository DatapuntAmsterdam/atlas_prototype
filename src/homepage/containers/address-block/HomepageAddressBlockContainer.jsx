import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchDataSelection } from '../../../header/ducks/search/search';

import HomepageAddressBlock from '../../components/address-block/HomepageAddressBlock';
import { routing } from '../../../app/routes';
import DATASETS from '../../../shared/ducks/data-selection/data-selection-datasets';

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    onfetchDataSelection: fetchDataSelection
  }, dispatch),
  openAdressenPage: () => dispatch({
    type: routing.adressen.type
  }),
  openVestigingenPage: () => dispatch({
    type: routing.vestigingen.type
  })
});

const HomepageAddressBlockContainer = (props) => {
  const onLinkClick = (payload) => {
    props.onfetchDataSelection(payload);
    if (payload.dataset === DATASETS.BAG) {
      props.openAdressenPage();
    } else {
      props.openVestigingenPage();
    }
  };
  return (
    <HomepageAddressBlock
      onLinkClick={onLinkClick}
    />
  );
};

HomepageAddressBlockContainer.contextTypes = {
  store: PropTypes.object.isRequired
};

HomepageAddressBlockContainer.propTypes = {
  onfetchDataSelection: PropTypes.func.isRequired,
  openAdressenPage: PropTypes.func.isRequired,
  openVestigingenPage: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(HomepageAddressBlockContainer);
