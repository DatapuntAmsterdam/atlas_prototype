/* eslint-disable */
import 'angular';
import 'angular-aria';
import 'angular-i18n/nl-nl';
import 'angular-sanitize';
import 'leaflet'; // Required to define window.L before leaflet plugins are imported
import 'leaflet.markercluster';
import 'leaflet-draw';
import 'leaflet-rotatedmarker';
import 'objectFitPolyfill';

import Marzipano from 'marzipano';
import 'imports-loader?d3!bbga_visualisatie_d3';
import * as d3 from 'd3';
import * as Redux from 'redux';
import marked from 'marked';

// TODO: refactor, remove?
window.Marzipano = Marzipano;
window.d3 = d3;
window.Redux = Redux;
window.marked = marked;

// Internet Explorer 11
var isIE = false || !!document.documentMode;
if (isIE) {
  // This solves inconsistency in the leaflet draw for IE11
  window.L.Browser.touch = false;
}
