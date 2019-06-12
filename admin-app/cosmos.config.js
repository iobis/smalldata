const overrides = require('react-app-rewired/config-overrides')

module.exports = {
  containerQuerySelector: '#root',
  webpackConfigPath:      'react-scripts/config/webpack.config',
  webpack:                config => overrides.webpack(config),
  globalImports:          ['./src/index.scss'],
  publicPath:             'public'
}
