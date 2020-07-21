import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { merge } from 'webpack-merge'
import configs from './webpack.prod'

export default (env: { [key: string]: string }) => {
  const configName = env.config ?? 'modern'
  const config = configs.find(({ name }) => name === configName)

  if (!config) {
    throw new Error(`Unable to find configuration named '${configName}'.`)
  }

  return merge(config, {
    plugins: [new BundleAnalyzerPlugin()],
    optimization: {
      concatenateModules: false,
    },
  })
}
