import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { merge } from 'webpack-merge'
import config from './webpack.prod'

export default merge(config, {
  plugins: [new BundleAnalyzerPlugin()],
  optimization: {
    concatenateModules: false,
  },
})