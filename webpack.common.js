const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const clientDir = path.resolve(__dirname, 'client')
const outputDir = path.resolve(clientDir, 'dist')

const isProd = process && process.env && process.env.NODE_ENV === 'production'
const gTagId = isProd ? 'UA-116092135-1' : 'UA-116093458-1'

module.exports = {
  entry: [
    'whatwg-fetch',
    './client/index.js'
  ],
  plugins: [
    new CleanWebpackPlugin([outputDir], {
      exclude: [
        'images'
      ]
    }),
    new CopyWebpackPlugin([{
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
        title: 'Slide Therapy',
        gTagId: gTagId,
        isProd: isProd
      }
    }),
    new ExtractTextPlugin('styles-[contenthash].css')
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
      test: /\.s?(c|a)ss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader'
        }, {
          loader: 'sass-loader'
        }]
      })
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
}
