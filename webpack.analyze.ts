import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { merge } from 'webpack-merge'
import configs from './webpack.prod'

const config = configs.find(({ name }) => name === 'modern')

if (!config) {
  throw new Error('Unable to find configuration to analyze.')
}

export default merge(config, {
  plugins: [new BundleAnalyzerPlugin()],
  optimization: {
    concatenateModules: false,
  },
})