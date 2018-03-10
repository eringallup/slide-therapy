const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    https: true,
    host: 'local.slidetherapy.com',
    port: 443,
    open: false,
    contentBase: './client',
    historyApiFallback: {
      // index: 'index.html'
    }
  }
});
