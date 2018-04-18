const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { commonConfig, dist } = require('./webpack.common.js');
const nodeEnv = 'development';
const buildId = nodeEnv;

module.exports = merge(commonConfig({ nodeEnv, buildId }), {
  devtool: 'source-map',
  devServer: {
    disableHostCheck: true,
    contentBase: dist,
    compress: true,
    port: 8080,
    proxy: {
      '/dcatd_admin': {
        target: 'http://localhost:3000',
        secure: false,
        "changeOrigin": true,
        "logLevel": "debug"         
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      '__BUILD_ID__': JSON.stringify(buildId),
      'process.env': {
        'NODE_ENV': JSON.stringify(nodeEnv)
      }
    }),
    new ExtractTextPlugin('main.css')
  ]
});
