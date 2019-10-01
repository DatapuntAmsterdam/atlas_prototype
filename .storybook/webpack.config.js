const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.svg$/,
    use: ['@svgr/webpack', 'url-loader'],
  })

  config.module.rules.push({
    test: /\.(png|svg|cur)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          outputPath: 'assets/',
        },
      },
    ],
  })

  config.module.rules.push({
    test: /\.scss$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
      },
      {
        loader: 'css-loader',
        options: {
          // Todo: eventually turn on modules: true
          // For now we explicitly tell classnames to be local
          localIdentName: '[name]__[local]--[hash:base64:5]',
          url: false, // Disable URL parsing in css for now
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: () => [require('autoprefixer')({ browsers: ['last 3 versions'] })],
        },
      },
      {
        loader: 'sass-loader',
      },
    ],
  })

  config.plugins.push(
    new CopyWebpackPlugin([
      {
        from: './node_modules/@datapunt/asc-assets/lib/assets',
        to: './',
      },
    ]),
    new MiniCssExtractPlugin('main.css'),
  )

  return config
}
