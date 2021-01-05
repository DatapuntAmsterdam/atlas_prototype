import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import { merge } from 'webpack-merge'
import { createConfig, srcPath } from './webpack.common'
import { GenerateSW } from 'workbox-webpack-plugin'

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
            // Linting rules will ensure this never actually happens with true production images.
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
      runtimeCaching: [
        {
          // All responses from the static assets server
          // Can be cache for a longer period of time, because of the nature of those assets
          urlPattern: /static\.amsterdam\.nl\/.+$/,
          handler: 'CacheFirst',
          options: {
            cacheableResponse: {
              statuses: [0, 200],
            },
            cacheName: 'static',
            expiration: {
              maxAgeSeconds: 60 * 60 * 12, // 12 hours
            },
          },
        },
        {
          // Exclude all requests to the tracking script
          urlPattern: /analytics\.data\.amsterdam\.nl\/(?!matomo\.php).+$/,
          handler: 'CacheFirst',
          options: {
            cacheableResponse: {
              statuses: [0, 200],
            },
            cacheName: 'analytics',
            expiration: {
              maxAgeSeconds: 60 * 60 * 4, // 4 hours
            },
          },
        },
        {
          // All images coming from the CMS since they have `cache-control: no-cache` headers and have relatively large file sizes
          urlPattern: /(cms\.data\.amsterdam.nl|localhost)\/[^.]+\.(png|jpg|jpeg|svg)$/,
          handler: 'CacheFirst',
          options: {
            cacheableResponse: {
              statuses: [0, 200],
            },
            cacheName: 'images',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 2, // 2 hours
            },
          },
        },
        {
          // Every call to the API, except oAuth2
          urlPattern: /api\.data\.amsterdam\.nl\/(?!oauth2).+$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheableResponse: {
              statuses: [0, 200],
            },
            cacheName: 'api',
            expiration: {
              maxAgeSeconds: 60 * 60 * 1, // 1 hours
            },
          },
        },
      ],
    }),
  ],
})
