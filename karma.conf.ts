import { Config as KarmaConfig, ConfigOptions as KarmaConfigOptions } from 'karma'
import path from 'path'
import webpack, { Configuration as WebpackConfig } from 'webpack'
import env from './test/load-env'
import { distPath, legacyPath, rootPath, srcPath } from './webpack.common'

const envKeys = Object.entries(env as { [key: string]: string }).reduce((prev, [key, value]) => {
  prev[`process.env.${key}`] = JSON.stringify(value)
  return prev
}, {} as { [key: string]: string })

const webpackConfig: WebpackConfig = {
  context: rootPath,
  output: {
    filename: 'test.bundle.js',
    path: distPath,
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
        include: [legacyPath],
        use: 'html-loader',
      },
      {
        test: /\.(run\.js|scss|png|svg|cur)$/,
        include: [srcPath, legacyPath],
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
        include: [srcPath, legacyPath, /atlas\.run\.js$/],
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

export default (config: KarmaConfig) => {
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
    webpack: webpackConfig as any,
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
  } as KarmaConfigOptions)
}
