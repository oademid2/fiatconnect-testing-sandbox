const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const webpack = require('webpack'); // only add this if you don't have yet
const env = require('./env-vars.js')

console.log(env)

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
      'process.env':env
    }),
  ]
};
