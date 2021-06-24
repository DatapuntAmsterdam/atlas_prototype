import path from 'path'
// eslint-disable-next-line import/no-extraneous-dependencies
import TerserPlugin from 'terser-webpack-plugin'
import { merge } from 'webpack-merge'
import { createConfig, srcPath } from './webpack.common'

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
            drop_debugger: false,
          },
        },
      }),
    ],
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
  },
})
