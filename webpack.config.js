const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/soccer-live-hub.js',
  output: {
    filename: 'soccer-live-hub.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: ['web', 'es2022'],
  module: {
    rules: [
      {
        test: /i18n\.js$/,
        include: path.resolve(__dirname, 'src/i18n.js'),
        use: path.resolve(__dirname, 'scripts/compact-i18n-loader.cjs'),
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: path.resolve(__dirname, 'scripts/minify-lit-css-loader.cjs'),
      },
    ],
  },
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        ecma: 2022,
        compress: {
          passes: 5,
          drop_debugger: true,
        },
        format: { comments: false },
      },
      extractComments: false,
    })],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
  ],
  performance: { hints: false },
};
