import path from 'path'
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
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
  },
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_debugger: !debugMode,
          },
          sourceMap: true,
        },
      }),
    ],
    namedChunks: true,
    namedModules: true,
    moduleIds: 'named',
    chunkIds: 'named',
  },
})
