module.exports = {
  "extends": [
    "airbnb",
    "plugin:jsx-a11y/strict"
  ],
  "env": {
    "browser": true,
    "jest": true,
    "node": true
  },
  "plugins": [
    "jsx-a11y"
  ],
  "globals": {
    "jsdom": true // Used in Jest unit test, made available by jest-environment-jsdom-global
  },
  "root": true,
  "rules": {
    "arrow-parens": ["error", "always"],
    "comma-dangle": ["error", "never"],
    "no-nested-ternary": "off",
    "no-underscore-dangle": ["error", {
      "allow": [
        "__REDUX_DEVTOOLS_EXTENSION_COMPOSE__",
        "_bijzondere_rechts_toestand",
        "_display",
        "_embedded",
        "_links",
        "_northEast",
        "_paq",
        "_southWest"
      ]
    }],
    "linebreak-style": "off"
  }
}
