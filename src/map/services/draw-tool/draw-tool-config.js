export default {
  MAX_MARKERS: 40,
  MARKERS_LEFT_WARNING: 5,
  DRAWING_MODE: {
    NONE: 'none',
    DRAW: 'draw',
    EDIT: 'edit'
  },
  format: {
    numeric: {
      delimiters: {
        thousands: '.',
        decimal: ','
      }
    }
  },
  edit: {},
  draw: {
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
  }
};
