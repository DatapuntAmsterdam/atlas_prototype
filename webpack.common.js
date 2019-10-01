const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin')
const { GenerateSW } = require('workbox-webpack-plugin')

const root = path.resolve(__dirname)
const src = path.resolve(root, 'src')
const legacy = path.resolve(root, 'modules')
const dist = path.resolve(root, 'dist')

function commonConfig(env) {
  const buildId = env && env.buildId ? env.buildId : env.nodeEnv
  const isDev = env.nodeEnv === 'development'
  const isAcc = env.nodeEnv === 'acceptance'

  // Todo: Put this in a .env file: https://datapunt.atlassian.net/browse/DP-7302
  const getApiUrl = (prefix = '') =>
    `https://${isAcc || isDev ? 'acc.' : ''}${prefix}data.amsterdam.nl/`

  const apiUrl = getApiUrl('api.')
  const cmsUrl = getApiUrl('cms.')

  return {
    context: root,
    entry: {
      app: ['isomorphic-fetch', '@babel/polyfill', './src/index.js'],
    },
    output: {
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js',
      publicPath: '/',
      path: dist,
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: ['./node_modules'],
      alias: {
        react: path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom'),
      },
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [src, legacy],
          use: 'babel-loader',
          exclude: /\.stories\.jsx$/,
        },
        {
          test: /\.scss$/,
          include: [src, legacy],
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                // Todo: eventually turn on modules: true
                // For now we explicitly tell classnames to be local
                localIdentName: '[name]__[local]--[hash:base64:5]',
                url: false, // Disable URL parsing in css for now
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [require('autoprefixer')({ browsers: ['last 3 versions'] })],
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
        {
          test: /\.html$/,
          include: [src, legacy],
          use: 'html-loader',
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
              ...(!isDev // speeds up the build time by ~0.4s
                ? {
                    options: {
                      svgo: {
                        plugins: [
                          { removeViewBox: false },
                          { removeDimensions: true },
                          { removeDoctype: true },
                          { removeComments: true },
                          { removeMetadata: true },
                          { removeEditorsNSData: true },
                          { cleanupIDs: true },
                          { removeRasterImages: true },
                          { removeUselessDefs: true },
                          { removeUnknownsAndDefaults: true },
                          { removeUselessStrokeAndFill: true },
                          { removeHiddenElems: true },
                          { removeEmptyText: true },
                          { removeEmptyAttrs: true },
                          { removeEmptyContainers: true },
                          { removeUnusedNS: true },
                          { removeDesc: true },
                          { prefixIds: true },
                        ],
                      },
                    },
                  }
                : {}),
            },
            'url-loader',
          ],
        },
        {
          test: /\.(jpg|png|svg|cur)$/,
          include: [legacy, src],
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'assets/',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin([dist]),
      new SVGSpritemapPlugin(['src/shared/assets/icons/**/*.svg'], {
        output: {
          filename: 'sprite.svg',
          chunk: {
            name: 'sprite',
          },
          svgo: {
            plugins: [
              { removeXMLNS: true },
              { removeViewBox: false },
              { removeDimensions: true },
              { removeDoctype: true },
              { removeComments: true },
              { removeMetadata: true },
              { removeEditorsNSData: true },
              { cleanupIDs: true },
              { removeRasterImages: true },
              { removeUselessDefs: true },
              { removeUnknownsAndDefaults: true },
              { removeUselessStrokeAndFill: true },
              { removeHiddenElems: true },
              { removeEmptyText: true },
              { removeEmptyAttrs: true },
              { removeEmptyContainers: true },
              { removeUnusedNS: true },
              { removeDesc: true },
              { prefixIds: true },
            ],
          },
        },
        styles: {
          filename: path.join(__dirname, 'src/shared/styles/config/mixins/_sprites.scss'),
        },
      }),
      new CopyWebpackPlugin([
        { from: './public/', to: './assets/' },
        { from: './public/static/', to: './' },
        // Dumb copy of all assets for now
        // All root assets files
        {
          context: 'modules/shared/assets',
          from: '*',
          to: 'assets',
        },
        // All assets in sub folders
        {
          context: 'modules/shared/assets',
          from: '**/*',
          to: 'assets',
        },
        {
          from: './node_modules/@datapunt/asc-assets/lib/assets/Fonts',
          to: 'Fonts',
        },
        {
          from: './node_modules/@datapunt/asc-assets/lib/assets/scripts',
          to: './',
        },
      ]),
      new HtmlWebpackPlugin({
        inject: false,
        template: './index.ejs',
        minify: {
          collapseWhitespace: !isDev,
        },
        sortChunks: 'none',
        lang: 'nl',
        title: 'Dataportaal',
        favicon: './favicon.png',
        scripts: ['/mtiFontTrackingCode.min.js'],
      }),
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(require('./package.json').version),
        __BUILD_ID__: JSON.stringify(buildId),
        'process.env': {
          NODE_ENV: JSON.stringify(env.nodeEnv),
          GIT_COMMIT: JSON.stringify(process.env.GIT_COMMIT),
        },
      }),
      new GenerateSW({
        importWorkboxFrom: 'local',
        clientsClaim: true,
        skipWaiting: true,
        exclude: [/\.map$/],
        navigateFallbackBlacklist: [
          // Exclude any URLs whose last part seems to be a file extension
          // as they're likely a resource and not a SPA route.
          // URLs containing a "?" character won't be blacklisted as they're likely
          // a route with query params (e.g. auth callbacks).
          new RegExp('/[^/?]+\\.[^/]+$'),
        ],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: new RegExp(apiUrl),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api',
              expiration: {
                maxAgeSeconds: 60 * 60 * 12, // 12h
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: new RegExp(`${cmsUrl}(?!/jsonapi/node/notification)`),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'cms',
              expiration: {
                maxAgeSeconds: 60 * 60 * 12, // 12h
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      }),
    ],
  }
}

module.exports = {
  commonConfig,
  root,
  src,
  legacy,
  dist,
}
