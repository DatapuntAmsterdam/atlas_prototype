import { merge } from 'webpack-merge'
import type { WebpackConfiguration } from './webpack.common'
import { createConfig, distPath } from './webpack.common'

export default merge<WebpackConfiguration>(createConfig({ mode: 'development' }), {
  // Workaround needed to enable HMR during development.
  // This should be fixed automatically when webpack-dev-server v4 is used.
  // More information: https://github.com/webpack/webpack-dev-server/issues/2758#issuecomment-710086019
  // TODO: Remove this workaround after upgrading.
  target: 'web',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    disableHostCheck: true,
    contentBase: distPath,
    compress: true,
    watchContentBase: true,
    hot: true,
    port: 3000,
    proxy: {
      '/dcatd_admin': {
        target: 'http://localhost:3001',
        secure: false,
        changeOrigin: true,
        logLevel: 'debug',
      },
    },
  },
})
