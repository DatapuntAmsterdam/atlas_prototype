import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from './Modal';
import { closeModalAction, reportFeedbackAction, reportProblemAction } from '../../../header/ducks/actions';

const mapDispatchToProps = (dispatch) => bindActionCreators({
  closeModalAction,
  reportFeedbackAction,
  reportProblemAction
}, dispatch);

export default connect(null, mapDispatchToProps)(Modal);
