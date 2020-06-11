// This file is used by Webpack when creating a bundle for browsers that do not support modern ES2015+ syntax.
// It can be used to include code snippets and polyfills for older support targets such as IE11.

// Polyfills needed to run App in IE11
import 'core-js'

// Polyfill for 'object-fit' CSS property support in IE11.
import 'objectFitPolyfill'

// Polyfill for CustomEvent support in IE11.
import 'custom-event-polyfill'

// Polyfill for Fetch API support in IE11.
import 'isomorphic-fetch'

import './index'
