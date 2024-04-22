const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      // Generates an HTML file from a template
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html'
      }),

      // Extract CSS to files
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),

      // Creates a service worker injecting the precache manifest
      new InjectManifest({
        swSrc: './src/sw.js', // path to the source service worker file
        swDest: 'service-worker.js', // output service worker file
        exclude: [/\.map$/, /^manifest.*\.js(?:on)?$/]
      }),

      // Generates a 'manifest.json'
      new WebpackPwaManifest({
        name: 'Text Editor PWA',
        short_name: 'TextEditor',
        description: 'An offline capable text editor!',
        background_color: '#ffffff',
        crossorigin: 'use-credentials',
        icons: [
          {
            src: path.resolve('src/assets/icon.png'),
            sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
          }
        ]
      })
    ],

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ],
    },
  };
};

