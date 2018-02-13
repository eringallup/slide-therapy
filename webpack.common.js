const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './client/src/index.js',
  plugins: [
    new CleanWebpackPlugin(['./client/dist'])
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'client', 'dist')
  },
  resolve: {
    alias: {
      'vault.js': 'vault.js/browser.js'
    }
  },
  module: {
    rules: [{
      test: /\.html$/,
      loader: 'html-loader'
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react']
      }
    }],
    loaders: [{
      test: /\.json$/,
      loader: 'json'
    }]
  }
};