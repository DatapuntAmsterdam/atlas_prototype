import path from 'path'
// eslint-disable-next-line import/no-extraneous-dependencies
import TerserPlugin from 'terser-webpack-plugin'
import { merge } from 'webpack-merge'
import { createConfig, srcPath } from './webpack.common'

const debugMode = process.env.DEBUG === 'true'

export default merge(createConfig({ mode: 'production' }), {
  bail: true,
  resolve: {
    alias: {
      [path.resolve(srcPath, 'environment.ts')]: path.resolve(srcPath, 'environment.prod.ts'),
    },
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            // Do not drop debugger statements, we might want to run a production build locally for testing.
            drop_debugger: !debugMode,
          },
        },
      }),
    ],
    runtimeChunk: 'single',
    splitChunks: {
      maxInitialRequests: 20,
      chunks: 'async',
      maxSize: 125000,
      minSize: 35000,
      minChunks: 1,
    },
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
  },
})
