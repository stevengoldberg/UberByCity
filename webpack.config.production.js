var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
var csswring = require('csswring');

module.exports = {

  entry: {
    app: './src/index.js'
  },

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/dist/'),
    publicPath: '/UberByCity/dist/'
  },

  plugins: [
    new ExtractTextPlugin('bundle.css'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      jQuery: "jquery"
    })
  ],

  resolve: {
    extensions: ['', '.jsx', '.js', '.json'],
    modulesDirectories: ['src', 'node_modules'],
    alias: {
        config: path.join(__dirname, 'config', process.env.NODE_ENV)
    }
  },

  module: {
    loaders: [{
      test: /bootstrap\/js\//,
      loader: 'imports?jQuery=jquery'
    }, {
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url?limit=10000&minetype=application/font-woff"
    }, {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url?limit=10000&minetype=application/font-woff2"
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url?limit=10000&minetype=application/octet-stream"
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: "file"
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url?limit=10000&minetype=image/svg+xml"
    }, {
      test: /\.js$/,
      loaders: ['babel-loader?optional[]=runtime&stage=0'],
      exclude: /node_modules/
    }, {
      test: /\.scss$/,
      loader: "css!postcss-loader!sass"
    }]
  },

  devtool: '#source-map',

  postcss: function() {
    return [autoprefixer, csswring];
  }
};