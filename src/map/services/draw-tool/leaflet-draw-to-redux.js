//
// Connects leaflet draw to Redux state changes
//
import isEqual from 'lodash.isequal';

import { DRAWING_MODE } from './draw-tool-config';
import {
  currentShape,
  initialize
} from './draw-tool';

let _previousMarkers; // eslint-disable-line no-underscore-dangle

export default ({
  mapUpdateShape,
  mapStartDrawing,
  mapEndDrawing,
  setDataSelectionGeometryFilter,
  resetDataSelectionGeometryFilter,
  setPageName,
  setMapFullscreen
  }, leafletMap) => {
  const onFinishPolygon = (polygon) => {
    // console.log('onFinishPolygon');
    const has2Markers = polygon && polygon.markers && polygon.markers.length === 2;
    const moreThan2Markers = polygon && polygon.markers && polygon.markers.length > 2;

    if (moreThan2Markers && !isEqual(_previousMarkers, polygon.markers)) {
      setDataSelectionGeometryFilter({
        markers: polygon.markers,
        description: `${polygon.distanceTxt} en ${polygon.areaTxt}`
      });

      mapEndDrawing({ polygon });
      setPageName({ name: null });
      setMapFullscreen({ isMapFullscreen: false });
    } else if (has2Markers) {
      mapEndDrawing({ polygon });
    }
  };

  const onDrawingMode = (drawingMode) => {
    // console.log('onDrawingMode');
    if (drawingMode !== DRAWING_MODE.NONE) {
      _previousMarkers = [...currentShape.markers];
      resetDataSelectionGeometryFilter({ drawingMode });
      mapStartDrawing(drawingMode);
    } else {
      mapEndDrawing();
    }
  };

  const onUpdateShape = (newShape) => {
    // console.log('onUpdateShape: ', newShape);
    mapUpdateShape({
      markers: newShape.markers,
      shapeMarkers: newShape.markers.length,
      shapeDistanceTxt: newShape.distanceTxt,
      shapeAreaTxt: newShape.areaTxt
    });
  };

  _previousMarkers = [];
  return initialize(
    leafletMap,
    onFinishPolygon,
    onDrawingMode,
    onUpdateShape
  );
};
