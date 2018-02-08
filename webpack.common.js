const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './client/src/index.js',
  plugins: [
    new CleanWebpackPlugin(['./client/dist']),
    new webpack.ProvidePlugin({
     $: 'jquery',
     jQuery: 'jquery'
    })
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'client', 'dist')
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }],
    loaders: [{
      test: /\.json$/,
      loader: 'json'
    }]
  }
};