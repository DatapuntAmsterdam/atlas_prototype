const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const merge = require('webpack-merge')
const config = require('./webpack.production')

module.exports = merge(config(), {
  plugins: [new BundleAnalyzerPlugin()],
  optimization: {
    concatenateModules: false,
  },
})
