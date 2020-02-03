const path = require('path')
const webpack = require('webpack')
const { root, dist, src, legacy } = require('./webpack.common.js')

const env = require('./test/load-env')

const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next])
  return prev
}, {})

const webpackConfig = {
  context: root,
  output: {
    filename: 'test.bundle.js',
    path: dist,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'],
    modules: ['./node_modules'],
  },
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.html$/,
        include: [legacy],
        use: 'html-loader',
      },
      {
        test: /\.(run\.js|scss|png|svg|cur)$/,
        include: [src, legacy],
        use: [
          {
            loader: 'file-loader',
            options: {
              emitFile: false,
            },
          },
        ],
      },
      {
        test: /\.(t|j)sx?$/,
        include: [src, legacy, /atlas\.run\.js$/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: 'commonjs',
                },
              ],
            ],
            plugins: [
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-transform-runtime',
              [
                'istanbul',
                {
                  exclude: ['**/*.spec.js', '**/*.test.js', 'src/*'],
                },
              ],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version),
      ...envKeys,
    }),
  ],
}

module.exports = function(config) {
  config.set({
    plugins: ['@metahub/karma-jasmine-jquery', 'karma-*'],
    frameworks: ['jasmine-jquery', 'jasmine'],
    files: [
      { pattern: './node_modules/leaflet/dist/leaflet.js', watched: false },
      {
        pattern: './node_modules/leaflet.nontiledlayer/dist/NonTiledLayer.js',
        watched: false,
      },
      { pattern: './node_modules/proj4/dist/proj4.js', watched: false },
      {
        pattern: './node_modules/proj4leaflet/src/proj4leaflet.js',
        watched: false,
      },
      '!src/index.js',
      'src/test-index.js',
    ],
    // possible values: OFF, ERROR, WARN, INFO, DEBUG
    logLevel: 'ERROR',
    reporters: ['progress', 'mocha', 'coverage-istanbul'],
    preprocessors: {
      'src/test-index.js': ['webpack', 'sourcemap'],
    },
    webpack: webpackConfig,
    mochaReporter: {
      output: 'minimal',
    },
    coverageIstanbulReporter: {
      reports: ['html', 'text-summary'],
      dir: path.join(__dirname, 'coverage-legacy'),
      thresholds: {
        emitWarning: false,
        global: {
          statements: 99,
          lines: 99,
          branches: 98,
          functions: 99,
        },
      },
    },
    browsers: ['PhantomJS'],
    singleRun: true,
  })
}
