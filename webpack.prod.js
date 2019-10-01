const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { commonConfig } = require('./webpack.common.js')

module.exports = env => {
  const nodeEnv = env && env.nodeEnv ? env.nodeEnv : 'production'

  const CHUNKS = {
    MAP:
      'leaflet|leaflet-draw|leaflet-rotatedmarker|leaflet.markercluster|leaflet.nontiledlayer|proj4|proj4leaflet',
    DATAPUNT: '@datapunt',
    STYLED: 'styled-components|polished|style-loader|css-loader|sass-loader|postcss-loader',
    PANORAMA: 'marzipano',
    POLYFILL: '@babel/polyfill|objectFitPolyfill',
    ANGULAR: 'angular|angular-aria|angular-i18n|angular-sanitize|react-angular',
    REACT:
      'react|react-dom|redux-first-router|redux-first-router-link|redux-first-router-restore-scroll|reselect|redux|@?redux-saga|react-redux|react-helmet|prop-types',
  }

  const getTestRegex = path => new RegExp(`/node_modules/(${path})/`)

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
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        name: true,
        cacheGroups: {
          vendor: {
            test: new RegExp(
              `/node_modules/(?!${[
                CHUNKS.DATAPUNT,
                CHUNKS.POLYFILL,
                CHUNKS.MAP,
                CHUNKS.STYLED,
                CHUNKS.REACT,
                CHUNKS.PANORAMA,
                CHUNKS.BBGA,
                CHUNKS.ANGULAR,
              ].join('|')})/`,
            ),
            name: 'vendor',
            chunks: 'all',
          },
          datapunt: {
            test: getTestRegex(CHUNKS.DATAPUNT),
            name: 'datapunt',
            chunks: 'all',
            enforce: true,
          },
          polyfill: {
            test: getTestRegex(CHUNKS.POLYFILL),
            name: 'polyfill',
            chunks: 'all',
            enforce: true,
          },
          map: {
            test: getTestRegex(CHUNKS.MAP),
            name: 'map',
            chunks: 'async',
            enforce: true,
          },
          bbga: {
            test: getTestRegex(CHUNKS.BBGA),
            name: 'bbga',
            chunks: 'async',
            enforce: true,
          },
          panorama: {
            test: getTestRegex(CHUNKS.PANORAMA),
            name: 'panorama',
            chunks: 'async',
            enforce: true,
          },
          styled: {
            test: getTestRegex(CHUNKS.STYLED),
            name: 'styled',
            chunks: 'all',
            enforce: true,
          },
          react: {
            test: getTestRegex(CHUNKS.REACT),
            name: 'react',
            chunks: 'all',
            enforce: true,
          },
          angular: {
            test: getTestRegex(CHUNKS.ANGULAR),
            name: 'angular',
            chunks: 'async',
            enforce: true,
          },
          main: {
            chunks: 'all',
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
      },
      runtimeChunk: true,
    },
    plugins: [new MiniCssExtractPlugin('main.[contenthash].css')],
  })
}
