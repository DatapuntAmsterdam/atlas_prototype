import merge from 'webpack-merge'
import { createConfig, distPath } from './webpack.common'

export default [createConfig({ legacy: false, singleBuild: true, mode: 'development' })].map(
  (config) =>
    merge(config, {
      devtool: 'inline-source-map',
      devServer: {
        historyApiFallback: {
          // allow "." character in URL path: https://stackoverflow.com/a/38576357
          // e.g.: http://localhost:3000/datasets/brk/subject/NL.KAD.Persoon.1234
          disableDotRule: true,
        },
        disableHostCheck: true,
        contentBase: distPath,
        compress: true,
        hot: true,
        port: 3000,
        proxy: {
          '/dcatd_admin': {
            target: 'http://localhost:3000',
            secure: false,
            changeOrigin: true,
            logLevel: 'debug',
          },
        },
      },
    }),
)
