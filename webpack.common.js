const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin')

const root = path.resolve(__dirname)
const src = path.resolve(root, 'src')
const legacy = path.resolve(root, 'modules')
const dist = path.resolve(root, 'dist')

const dotenv = require('dotenv')

const env = dotenv.config().parsed

const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next])
  return prev
}, {})

function commonConfig() {
  const isDev = env.nodeEnv === 'development'

  return {
    context: root,
    entry: {
      app: [
        'isomorphic-fetch',
        'core-js/features/url',
        'core-js/features/url-search-params',
        'core-js/features/array/flat',
        '@babel/polyfill',
        './src/index.js',
      ],
    },
    output: {
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js',
      publicPath: '/',
      path: dist,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'],
      modules: ['./node_modules'],
      alias: {
        react: path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(t|j)sx?$/,
          include: [src, legacy],
          use: 'babel-loader',
          exclude: /\.stories\.(j|t)sx$/,
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
                // Todo: eventually turn on modules
                // For now we explicitly tell classnames to be local
                // localIdentName: '[name]__[local]--[hash:base64:5]',
                url: false, // Disable URL parsing in css for now
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [require('autoprefixer')],
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
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader',
        },
      ],
    },
    plugins: [
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
          from: './node_modules/@datapunt/asc-assets/static/fonts',
          to: '',
        },
      ]),
      new HtmlWebpackPlugin({
        minify: {
          collapseWhitespace: !isDev,
        },
        lang: 'nl',
        title: 'Data en informatie - Amsterdam',
        description:
          'Data en informatie is dé website voor iedereen die op zoek is naar objectieve, betrouwbare en actuele data en informatie over Amsterdam.',
        favicon: './favicon.png',
        root: env.ROOT,
        scripts: ['/mtiFontTrackingCode.min.js'],
      }),
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(require('./package.json').version),
        ...envKeys,
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
