import isEqual from 'lodash.isequal';

import {
  mapUpdateShape,
  mapStartDrawing,
  mapEndDrawing
} from '../../../shared/ducks/map/map';
import {
  setDataSelectionGeometryFilter,
  resetDataSelectionGeometryFilter
} from '../../../shared/ducks/data-selection/data-selection';
import { setPageName } from '../../../shared/ducks/page/page';
import { setMapFullscreen } from '../../../shared/ducks/ui/ui';


import drawToolConfig from './draw-tool-config';
import {
  currentShape,
  initialize
} from './draw-tool';

let _dispatch; // eslint-disable-line no-underscore-dangle
let _previousMarkers; // eslint-disable-line no-underscore-dangle

const onFinishShape = (polygon) => {
  const has2Markers = polygon && polygon.markers && polygon.markers.length === 2;
  const moreThan2Markers = polygon && polygon.markers && polygon.markers.length > 2;

  if (moreThan2Markers && !isEqual(_previousMarkers, polygon.markers)) {
    _dispatch(setDataSelectionGeometryFilter({
      markers: polygon.markers,
      description: `${polygon.distanceTxt} en ${polygon.areaTxt}`
    }));

    _dispatch(mapEndDrawing({ polygon }));
    _dispatch(setPageName({ name: null }));

    _dispatch(setMapFullscreen({ isMapFullscreen: false }));
  } else if (has2Markers) {
    _dispatch(mapEndDrawing({ polygon }));
  }
};

const onDrawingMode = (drawingMode) => {
  if (drawingMode !== drawToolConfig.DRAWING_MODE.NONE) {
    _previousMarkers = [...currentShape.markers];
    resetDataSelectionGeometryFilter({ drawingMode });
    _dispatch(mapStartDrawing({ drawingMode }));
  } else {
    _dispatch(mapEndDrawing());
  }
};

const onUpdateShape = (newShape) => {
  _dispatch(mapUpdateShape({
    shapeMarkers: newShape.markers.length,
    shapeDistanceTxt: newShape.distanceTxt,
    shapeAreaTxt: newShape.areaTxt
  }));
};

export default (leafletMap, dispatch) => {
  _dispatch = dispatch;
  _previousMarkers = [];
  initialize(
    leafletMap,
    onFinishShape,
    onDrawingMode,
    onUpdateShape
  );
};
