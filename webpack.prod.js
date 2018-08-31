const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {commonConfig} = require('./webpack.common.js');

module.exports = function(env) {
  const nodeEnv = env && env.nodeEnv ? env.nodeEnv : 'production';
  const buildId = env && env.buildId ? env.buildId : nodeEnv;

  return merge(commonConfig({ nodeEnv, buildId }), {
    output: {
      filename: '[name].[chunkhash].js'
    },
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(require("./package.json").version),
        '__BUILD_ID__': JSON.stringify(buildId),
        'process.env': {
          'NODE_ENV': JSON.stringify(nodeEnv)
        }
      }),
      new UglifyJSPlugin({
        // Do not minify our legacy code (app.bundle.js); this doesn't work with
        // angular dependancy injection
        exclude: /app/,
        sourceMap: true
      }),
      new ExtractTextPlugin('main.[contenthash].css')
    ]
  });
};
