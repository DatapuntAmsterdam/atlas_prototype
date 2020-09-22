import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import { merge } from 'webpack-merge'
import { createConfig, srcPath } from './webpack.common'

const CHUNKS = {
  MAP:
    'leaflet|leaflet-draw|leaflet-rotatedmarker|leaflet.markercluster|leaflet.nontiledlayer|proj4|proj4leaflet',
  DATAPUNT: '@datapunt',
  AMSTERDAM: '@amsterdam',
  STYLED: 'styled-components|polished|style-loader|css-loader|sass-loader|postcss-loader',
  PANORAMA: 'marzipano',
  POLYFILL: 'objectFitPolyfill|core-js|core-js-pure',
  ANGULAR: 'angular|angular-aria|angular-sanitize|react-angular',
  REACT:
    'react|react-dom|redux-first-router|redux-first-router-link|redux-first-router-restore-scroll|reselect|redux|@?redux-saga|react-redux|react-helmet|prop-types',
}

const getTestRegex = (path: string) => new RegExp(`/node_modules/(${path})/`)

export default [
  createConfig({ legacy: false, mode: 'production' }),
  createConfig({ legacy: true, mode: 'production' }),
].map((config) =>
  merge(config, {
    resolve: {
      alias: {
        [path.resolve(srcPath, 'environment.ts')]: path.resolve(srcPath, 'environment.prod.ts'),
      },
    },
    output: {
      filename: config.name === 'legacy' ? '[name].[hash]-legacy.js' : '[name].[hash].js',
      chunkFilename:
        config.name === 'legacy' ? '[name].[chunkhash]-legacy.js' : '[name].[chunkhash].js',
    },
    devtool: 'source-map',
    optimization: {
      minimizer: [
        new TerserPlugin({
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
                CHUNKS.AMSTERDAM,
                CHUNKS.POLYFILL,
                CHUNKS.MAP,
                CHUNKS.STYLED,
                CHUNKS.REACT,
                CHUNKS.PANORAMA,
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
          amsterdam: {
            test: getTestRegex(CHUNKS.AMSTERDAM),
            name: 'amsterdam',
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
    },
  }),
)
