const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
// const CriticalPlugin = require('webpack-plugin-critical').CriticalPlugin
const HtmlCriticalPlugin = require('html-critical-webpack-plugin')
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const clientDir = path.resolve(__dirname, 'client')
const outputDir = path.resolve(clientDir, 'dist')

const processEnv = process && process.env
const nodeEnv = processEnv.NODE_ENV
const processImages = processEnv.ST_IMAGES === 'true'
const isProd = nodeEnv === 'production'
const isPreview = nodeEnv === 'preview'

let domain = 'https://local.slidetherapy.com'
if (isPreview) {
  domain = 'http://preview.slidetherapy.com.s3-website-us-west-2.amazonaws.com'
} else if (isProd) {
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
      '/download',
      '/promotions',
      '/free-color-palettes'
    ],
    locals: {
      title: 'Slide Therapy',
      domain: domain,
      isProd: isProd
    }
  }),
  new ExtractTextPlugin('styles-[contenthash].css')
]

if (isPreview || isProd) {
  // plugins.push(new CriticalPlugin({
  //   src: 'index.html',
  //   inline: true,
  //   minify: true,
  //   dest: 'index.html'
  // }))
  plugins.push(new HtmlCriticalPlugin({
    base: outputDir,
    src: 'index.html',
    dest: 'index.html',
    inline: true,
    minify: true,
    // extract: true,
    width: 2000,
    height: 3000,
    penthouse: {
      blockJSRequests: false
    }
  }))
}

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
          loader: 'css-loader',
          options: {
            minimize: false
          }
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
