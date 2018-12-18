const path = require('path');
const webpack = require('webpack');
const { root, dist, src, legacy } = require('./webpack.common.js');
const nodeEnv = 'development';

const webpackConfig = {
  context: root,
  output: {
    filename: 'test.bundle.js',
    path: dist
  },
  resolve: {
    modules: ['./node_modules']
  },
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.html$/,
        include: [
          legacy
        ],
        use: 'html-loader'
      },
      {
        test: /\.(run\.js|scss|png|svg|cur)$/,
        include: [
          src,
          legacy
        ],
        use: [{
          loader: 'file-loader',
          options: {
            emitFile: false
          }
        }]
      },
      {
        test: /\.jsx?$/,
        include: [
          src,
          legacy,
          /atlas\.run\.js$/
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react-app', 'env'],
            plugins: ['transform-object-rest-spread',
                ['istanbul', {
                  'exclude': [
                    '**/*.spec.js',
                    '**/*.test.js',
                    'src/*'
                  ]
                }]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require("./package.json").version),
      '__BUILD_ID__': JSON.stringify(nodeEnv),
      'process.env': {
        'NODE_ENV': JSON.stringify(nodeEnv)
      }
    })
  ]
};

module.exports = function (config) {
  config.set({
    plugins: ['@metahub/karma-jasmine-jquery', 'karma-*'],
    frameworks: ['jasmine-jquery', 'jasmine'],
    files: [
      { pattern: './node_modules/leaflet/dist/leaflet.js', watched: false },
      { pattern: './node_modules/leaflet.nontiledlayer/dist/NonTiledLayer.js', watched: false },
      { pattern: './node_modules/proj4/dist/proj4.js', watched: false },
      { pattern: './node_modules/proj4leaflet/src/proj4leaflet.js', watched: false },
      '!src/index.js',
      'src/test-index.js'
    ],
    // possible values: OFF, ERROR, WARN, INFO, DEBUG
    logLevel: 'ERROR',
    reporters: ['progress', 'mocha', 'coverage-istanbul'],
    preprocessors: {
      'src/test-index.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    mochaReporter: {
      output: 'minimal'
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
          functions: 99
        }
      }
    },
    browsers: ['PhantomJS'],
    singleRun: true
  });
};
