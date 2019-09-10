const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { commonConfig, dist } = require('./webpack.common.js')

module.exports = env => {
  const nodeEnv = env && env.nodeEnv ? env.nodeEnv : 'development'

  return merge(commonConfig({ nodeEnv }), {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
      historyApiFallback: {
        // allow "." character in URL path: https://stackoverflow.com/a/38576357
        // e.g.: http://localhost:8080/datasets/brk/subject/NL.KAD.Persoon.1234
        disableDotRule: true,
      },
      disableHostCheck: true,
      contentBase: dist,
      compress: true,
      hot: true,
      port: 8080,
      proxy: {
        '/dcatd_admin': {
          target: 'http://localhost:3000',
          secure: false,
          changeOrigin: true,
          logLevel: 'debug',
        },
      },
    },
    plugins: [new MiniCssExtractPlugin('main.css')],
  })
}
