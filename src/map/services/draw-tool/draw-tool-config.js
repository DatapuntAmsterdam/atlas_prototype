export const LeafletDrawConfig = {
  polygon: {
    allowIntersection: false,
    showArea: true,
    showLength: true,
    metric: ['km', 'm'],
    precision: {
      m: 1
    }
  },
  marker: false,
  circle: false,
  rectangle: false,
  polyline: false
};

export const LeafletEditConfig = {};

export const LeafletFormat = {
  numeric: {
    delimiters: {
      thousands: '.',
      decimal: ','
    }
  }
};

export const DRAWING_MODE = {
  NONE: 'none',
  DRAW: 'draw',
  EDIT: 'edit'
};

export const MAX_MARKERS = 12;
export const MARKERS_LEFT_WARNING = 5;
