
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { commonConfig, dist } = require('./webpack.common.js');

module.exports = function(env) {
  const nodeEnv = env && env.nodeEnv ? env.nodeEnv : 'development';
  const buildId = env && env.buildId ? env.buildId : nodeEnv;
  const publicPath = process.env.ASSETS_PATH ? `${process.env.ASSETS_PATH}` : '';

  return merge(commonConfig({ nodeEnv, buildId, publicPath }), {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
      historyApiFallback: {
        // allow "." character in URL path: https://stackoverflow.com/a/38576357
        // e.g.: http://localhost:8080/datasets/brk/subject/NL.KAD.Persoon.1234
        disableDotRule: true
      },
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
        },
        '/grondexploitatie': {
          target: 'http://localhost:8000',
          secure: false,
          "changeOrigin": true,
          "logLevel": "debug"
        }
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(require("./package.json").version),
        '__BUILD_ID__': JSON.stringify(buildId),
        'process.env': {
          'NODE_ENV': JSON.stringify(nodeEnv),
          'ASSETS_PATH': JSON.stringify(publicPath)
        }
      }),
      new MiniCssExtractPlugin('main.css')
    ]
  });
};
