const prodConfig = require('./webpack.prod.js')

module.exports = env => {
  const nodeEnv = env && env.nodeEnv ? env.nodeEnv : 'acceptance'

  return prodConfig({ nodeEnv })
}
