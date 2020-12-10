import path from 'path'
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
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
  },
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          sourceMap: true,
          compress: {
            // Do not drop debugger statements, we might want to run a production build locally for testing.
            // Linting rules will ensure this never actually happens with true production images.
            drop_debugger: false,
          },
        },
      }),
    ],
    namedChunks: true,
    namedModules: true,
    moduleIds: 'named',
    chunkIds: 'named',
  },
})
