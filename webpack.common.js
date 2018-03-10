const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const fs = require('fs');
const blogPostFiles = fs.readdirSync('./client/blog');
let blogPosts = [];
blogPostFiles.forEach(file => {
  let markdown = fs.readFileSync(`./client/blog/${file}`, 'utf8');
  blogPosts.push(markdown);
});

const outputDir = path.resolve(__dirname, 'client', 'dist');

module.exports = {
  entry: [
    'whatwg-fetch',
    './client/index.js'
  ],
  plugins: [
    new CleanWebpackPlugin([outputDir]),
    new CopyWebpackPlugin([{
      from: './client/*.css',
      to: outputDir,
      flatten: true
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
        context: {
          blogPosts: blogPosts.reverse()
        }
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
