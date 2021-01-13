import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import { merge } from 'webpack-merge'
import { GenerateSW } from 'workbox-webpack-plugin'
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
  plugins: [
    new GenerateSW({
      mode: debugMode ? 'development' : 'production',
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
      sourcemap: true,
      inlineWorkboxRuntime: false,
      exclude: [
        // Don't pre-cache any font files or images; we need a more fine-grained caching strategy (see below in runtimeCaching)
        /.+\.(?:woff|woff2|eot|ttf)$/,
        /.+\.(?:png|jpg|jpeg|svg|webp)$/,
        /.*\.(?:html|map|txt|htaccess)$/,
        /manifest$/,
      ],
      cleanupOutdatedCaches: true,
    }),
  ],
})
