module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.svg$/,
    use: ['@svgr/webpack', 'url-loader'],
  })

  return config
}
