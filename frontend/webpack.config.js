const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const webpack = require('webpack'); // only add this if you don't have yet

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  resolve: {
    fallback: {
      net: false,
      tls: false,
      fs: false,
    }
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),
    new NodePolyfillPlugin(),
    new webpack.DefinePlugin({
      'process.env':{
        'BITMAMA': {
          'NAME':JSON.stringify("bitmama"),
          'BASE_URL': JSON.stringify('https://cico-staging.bitmama.io'),
          'CLIENT_API_KEY': JSON.stringify('xxx'),
        },
        'ONERAMP':{
          'NAME': JSON.stringify("oneramp"),
          'BASE_URL': JSON.stringify('https://sandbox.oneramp.io'),
          'CLIENT_API_KEY': JSON.stringify('xxx'),
        },
        "ADDRESS":JSON.stringify('xxxx')
      }
    }),
  ]
};
