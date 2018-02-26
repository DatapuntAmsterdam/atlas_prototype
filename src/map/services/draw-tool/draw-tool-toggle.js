import {
  disable,
  enable,
  isEnabled,
  setPolygon
} from './draw-tool';

export default (markers) => {
  if (isEnabled()) {
    disable();
  } else {
    if (markers > 0) {
      setPolygon([]);
    }
    enable();
  }
};
