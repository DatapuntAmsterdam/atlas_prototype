import { connect } from 'react-redux';
import { getShapeDistanceTxt } from '../../ducks/map/selectors';
import ShapeSummary from './ShapeSummary';
import { cancelDrawing } from '../../../shared/ducks/data-selection/actions';

const mapStateToProps = (state) => ({
  shapeDistanceTxt: getShapeDistanceTxt(state)
});

const mapDispatchToProps = (dispatch) => ({
  onClearDrawing: () => dispatch(cancelDrawing())
});

export default connect(mapStateToProps, mapDispatchToProps)(ShapeSummary);
