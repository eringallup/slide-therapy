const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const clientDir = path.resolve(__dirname, 'client');
const outputDir = path.resolve(clientDir, 'dist');

module.exports = {
  entry: [
    'whatwg-fetch',
    './client/index.js'
  ],
  plugins: [
    new CleanWebpackPlugin([outputDir]),
    new CopyWebpackPlugin([{
      from: path.resolve(clientDir, '*.css'),
      to: outputDir,
      flatten: true
    }, {
      from: path.resolve(clientDir, 'images'),
      to: path.resolve(outputDir, 'images'),
      flatten: false
    }]),
    new StaticSiteGeneratorPlugin({
      crawl: true,
      globals: {
        StripeCheckout: {
          configure: () => {}
        }
      },
      paths: [
        '/',
        '/download',
        '/thanks'
      ],
      locals: {
        title: 'Slide Therapy'
      }
    })
  ],
  output: {
    filename: 'bundle-[chunkhash].js',
    path: outputDir,
    libraryTarget: 'umd'
  },
  resolve: {
    alias: {
      'vault.js': 'vault.js/browser.js'
    },
    modules: [
      path.resolve('./client'),
      path.resolve('./'),
      'node_modules'
    ]
  },
  module: {
    rules: [{
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
