const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
// const jsdom = require('jsdom');
// const { JSDOM } = jsdom;
// const dom = new JSDOM('<div/>');
// const { window, document, navigator } = dom;

const outputDir = path.resolve(__dirname, 'client', 'dist');

module.exports = {
  entry: [
    'whatwg-fetch',
    './client/index.js'
  ],
  node: {
    fs: 'empty'
  },
  plugins: [
    new CleanWebpackPlugin([outputDir]),
    new CopyWebpackPlugin([{
      from: './client/*.css',
      to: outputDir,
      flatten: true
    }]),
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, 'client', 'index.html')
    // }),
    new StaticSiteGeneratorPlugin({
      crawl: true,
      globals: {
        StripeCheckout: {
          configure: () => {}
        }
      },
      paths: [
        '/'
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
