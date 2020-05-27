// This file is used by Webpack when creating a bundle for browsers that do not support modern ES2015+ syntax.
// It can be used to include code snippets and polyfills for older support targets such as IE11.

// Polyfills needed to run React in IE11 (see: https://reactjs.org/docs/javascript-environment-requirements.html)
import 'core-js/es/map'
import 'core-js/es/set'

// The Symbol polyfill is needed for transformation done by @babel/preset-react.
// For more information see: https://github.com/facebook/react/issues/8379
import 'core-js/es/symbol'

// Polyfill for 'object-fit' CSS property support in IE11.
import 'objectFitPolyfill'

// Polyfill for CustomEvent support in IE11.
import 'custom-event-polyfill'

// Polyfill for Fetch API support in IE11.
import 'isomorphic-fetch'

import './index'
