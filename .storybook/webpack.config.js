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
        from: './node_modules/@amsterdam/asc-assets/static',
        to: './',
      },
    ]),
    new MiniCssExtractPlugin('main.css'),
  )

  config.module.rules.push({
    test: /\.(ts|tsx)$/, // Storybook can already handle .js and .jsx
    loader: require.resolve('babel-loader'),
    options: {
      presets: [['react-app', { typescript: true }]],
    },
  })

  config.resolve.extensions.push('.js', '.ts', '.tsx', '.css')

  return config
}
