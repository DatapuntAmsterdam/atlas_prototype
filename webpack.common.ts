import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import dotenv from 'dotenv'
import HtmlWebpackMultiBuildPlugin from 'html-webpack-multi-build-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import SVGSpritemapPlugin from 'svg-spritemap-webpack-plugin'
import { Configuration, DefinePlugin } from 'webpack'

// Some dependencies are written in ES2015+ syntax and will need to be included explicitly.
// Adding them to this config will transpile and add polyfills to the code if necessary.
const modernModules = [
  path.resolve(__dirname, 'node_modules/@datapunt/asc-assets'),
  path.resolve(__dirname, 'node_modules/@datapunt/asc-ui'),
  path.resolve(__dirname, 'node_modules/body-scroll-lock'),
  path.resolve(__dirname, 'node_modules/escape-string-regexp'),
]

const env = dotenv.config().parsed ?? {}
const envKeys = Object.entries(env).reduce((prev, [key, value]) => {
  prev[`process.env.${key}`] = JSON.stringify(value)
  return prev
}, {} as { [key: string]: string })

export interface CreateConfigOptions {
  /**
   * If enabled a build optimized for legacy browsers with ES5 code and various polyfills will be created,
   * otherwise a more modern build using ES2015 syntax will be used with less polyfills.
   */
  legacy: boolean
  /**
   * Enable production optimizations or development hints.
   */
  mode: Configuration['mode']
}

export const rootPath = path.resolve(__dirname)
export const srcPath = path.resolve(__dirname, 'src')
export const legacyPath = path.resolve(__dirname, 'modules')
export const distPath = path.resolve(__dirname, 'dist')

const svgoConfig = {
  removeXMLNS: true,
  removeViewBox: false,
  removeDimensions: true,
  removeDoctype: true,
  removeComments: true,
  removeMetadata: true,
  removeEditorsNSData: true,
  cleanupIDs: true,
  removeRasterImages: true,
  removeUselessDefs: true,
  removeUnknownsAndDefaults: true,
  removeUselessStrokeAndFill: true,
  removeHiddenElems: true,
  removeEmptyText: true,
  removeEmptyAttrs: true,
  removeEmptyContainers: true,
  removeUnusedNS: true,
  removeDesc: true,
  prefixIds: true,
}

export function createConfig(options: CreateConfigOptions): Configuration {
  return {
    mode: options.mode,
    name: options.legacy ? 'legacy' : 'modern',
    entry: options.legacy ? './src/index-legacy.ts' : './src/index.ts',
    output: {
      filename: options.legacy ? '[name]-legacy.js' : '[name].js',
      path: distPath,
      publicPath: '/',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.(t|j)sx?$/,
          include: [srcPath, legacyPath, ...modernModules],
          use: {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false,
                    useBuiltIns: 'usage',
                    corejs: 3,
                    targets: {
                      esmodules: !options.legacy,
                    },
                  },
                ],
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
              plugins: [
                'transform-commonjs-es2015-modules',
                [
                  '@babel/plugin-transform-runtime',
                  {
                    corejs: 3,
                    useESModules: true,
                  },
                ],
                [
                  'babel-plugin-styled-components',
                  {
                    pure: true,
                  },
                ],
              ],
            },
          },
        },
        {
          test: /\.(sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: options.mode === 'development',
              },
            },
            {
              loader: 'css-loader',
              options: {
                url: false,
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: [require('autoprefixer')],
              },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true },
            },
          ],
        },
        {
          test: /\.html$/,
          use: {
            loader: 'html-loader',
          },
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                svgo: options.mode === 'production',
                svgoConfig,
              },
            },
          ],
        },
        {
          test: /\.(jpg|png|svg|cur)$/,
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
      new CleanWebpackPlugin({
        // Prevent multiple cleanups, since we're using multiple configs (see: https://github.com/johnagan/clean-webpack-plugin/issues/122).
        cleanOnceBeforeBuildPatterns: [],
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: './public/', to: './assets/' },
          { from: './public/static/', to: './' },
          // All assets in sub folders
          {
            context: 'modules/shared/assets',
            from: '**/*',
            to: 'assets',
          },
        ],
      }),
      new DefinePlugin({
        VERSION: JSON.stringify(require('./package.json').version),
        ...envKeys,
      }),
      new SVGSpritemapPlugin(['src/shared/assets/icons/**/*.svg'], {
        output: {
          filename: 'sprite.svg',
          chunk: {
            name: 'sprite',
          },
          svgo: {
            plugins: Object.entries(svgoConfig).map(([key, value]) => ({ [key]: value })),
          },
        },
        styles: {
          filename: path.join(__dirname, 'src/shared/styles/config/mixins/_sprites.scss'),
        },
      }),
      new MiniCssExtractPlugin({
        esModule: true,
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: 'index.ejs',
        lang: 'nl',
        title: 'Data en informatie - Amsterdam',
        description:
          'Data en informatie is dé website voor iedereen die op zoek is naar objectieve, betrouwbare en actuele data en informatie over Amsterdam.',
        favicon: './favicon.png',
        styles: ['https://static.amsterdam.nl/fonts/fonts.css'],
        scripts: ['https://static.amsterdam.nl/fonts/mtiFontTrackingCode.min.js'],
        root: env.ROOT,
        minify:
          options.mode === 'production'
            ? {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: false,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true,
              }
            : false,
      }),
      new HtmlWebpackMultiBuildPlugin(),
    ],
  }
}
