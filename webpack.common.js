const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const clientDir = path.resolve(__dirname, 'client')
const outputDir = path.resolve(clientDir, 'dist')

const processEnv = process && process.env
const nodeEnv = processEnv.NODE_ENV
const processImages = processEnv.ST_IMAGES === 'true'
const isProd = nodeEnv === 'production'

let domain = 'https://local.slidetherapy.com'
if (nodeEnv === 'preview') {
  domain = 'http://preview.slidetherapy.com.s3-website-us-west-2.amazonaws.com'
} else if (nodeEnv === 'production') {
  domain = 'https://slidetherapy.com'
}

let plugins = [
  new CleanWebpackPlugin([outputDir], {
    exclude: processImages ? [] : ['images']
  }),
  new StaticSiteGeneratorPlugin({
    crawl: true,
    globals: {
      StripeCheckout: {
        configure: () => {}
      }
    },
    paths: [
      '/',
      '/download'
    ],
    locals: {
      title: 'Slide Therapy',
      domain: domain,
      isProd: isProd
    }
  }),
  new ExtractTextPlugin('styles-[contenthash].css')
]

if (processImages) {
  plugins.push(new CopyWebpackPlugin([{
    from: path.resolve(clientDir, 'images'),
    to: path.resolve(outputDir, 'images'),
    flatten: false
  }]))
}

module.exports = {
  entry: [
    'whatwg-fetch',
    './client/index.js'
  ],
  plugins: plugins,
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
