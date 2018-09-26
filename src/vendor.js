/* eslint-disable */
import 'angular';
import 'angular-aria';
import 'angular-i18n/nl-nl';
import 'angular-sanitize';
import 'imports-loader?angulartics!angulartics-piwik/src/angulartics-piwik';
import 'leaflet.markercluster';
import 'leaflet-draw';
import 'leaflet-rotatedmarker';
import 'objectFitPolyfill';
import 'imports-loader?exports=>false,define=>false!raven-js/dist/raven';
import 'imports-loader?exports=>false,define=>false!raven-js/dist/plugins/angular';

import Marzipano from 'marzipano';
import 'imports-loader?d3!bbga_visualisatie_d3';
import * as d3 from 'd3';
import * as Redux from 'redux';
import marked from 'marked';

window.Marzipano = Marzipano;
window.d3 = d3;
window.Redux = Redux;
window.marked = marked;
