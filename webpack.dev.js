const merge = require('webpack-merge')
const common = require('./webpack.common.js')
// const path = require('path')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
// const clientDir = path.resolve(__dirname, 'client')
// const outputDir = path.resolve(clientDir, 'dist')

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
  // plugins: [
  //   new CopyWebpackPlugin([{
  //     from: path.resolve(clientDir, 'images'),
  //     to: path.resolve(outputDir, 'images'),
  //     flatten: false
  //   }])
  // ]
})
