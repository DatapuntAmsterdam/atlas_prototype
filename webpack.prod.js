const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { commonConfig } = require('./webpack.common.js')

module.exports = env => {
  const nodeEnv = env && env.nodeEnv ? env.nodeEnv : 'production'

  return merge(commonConfig({ nodeEnv }), {
    output: {
      filename: '[name].[chunkhash].js',
      chunkFilename: '[name].[chunkhash].bundle.js',
    },
    mode: 'production',
    devtool: 'source-map',
    optimization: {
      minimizer: [
        new UglifyJSPlugin({
          // Do not minify our legacy code (app.bundle.js); this doesn't work with
          // angular dependancy injection
          exclude: /modules/,
          sourceMap: true,
        }),
      ],
    },
    plugins: [new MiniCssExtractPlugin('main.[contenthash].css')],
  })
}
