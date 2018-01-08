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
  "root": true,
  "rules": {
    "arrow-parens": ["error", "always"],
    "comma-dangle": ["error", "never"],
    "no-nested-ternary": "off",
    "no-underscore-dangle": ["error", {
      "allow": [
        "__REDUX_DEVTOOLS_EXTENSION_COMPOSE__",
        "_embedded",
        "_links",
        "_display"
      ]
    }]
  }
}
