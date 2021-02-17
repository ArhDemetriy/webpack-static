/** @type {import('node')} */

import path = require('path')
import webpack = require('webpack')
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin = require('copy-webpack-plugin')
import HTMLWebpackPlugin = require('html-webpack-plugin')
import MiniCssExtractPlugin = require('mini-css-extract-plugin')
import OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
import TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV == 'development'

const mode = isDev => {
  return isDev ? 'development' : 'production'
}
const optimization = isDev => {
  const config = {
    splitChunks: {
      chunks: 'all'
    },
  }
  if (!isDev) {
    (config as any).minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin(),
    ]
  }
  return config
}
const filename = (ext, isDev) => {
  return `[name]${isDev ? '' : '.[contenthash]'}.${ext}`
}
const HTMLfilename = (name, isDev) => {
  return `${name}${isDev ? '' : '.[contenthash]'}.html`
}
const HTMLWebpackPluginSetup = name => {
  return {
    template: `pages/${name}/${name}.pug`,
    filename: HTMLfilename(name, isDev),
  }
}
const cssLoaders = (extra?) => {
  let loaders = [
    MiniCssExtractPlugin.loader,
    'css-loader']
  if (extra)
    loaders.push(extra)
  return loaders
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: mode(isDev),
  target: isDev ? "web" : "browserslist",
  entry: {
    main: ['@babel/polyfill', path.resolve(__dirname,'src/pages/index/index.js')],
  },
  output: {
    filename: filename('js', isDev),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve:{
    alias: {
      '@simple': path.resolve(__dirname, 'src/components/simple'),
      '@complicated': path.resolve(__dirname, 'src/components/complicated'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@pages': path.resolve(__dirname, 'src/pages'),
    },
  },
  optimization: optimization(isDev),
  devServer: {
    port: 1234,
    hot: isDev,
    inline: true
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin({}),
    new HTMLWebpackPlugin(HTMLWebpackPluginSetup('index')),
    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, 'src/index.html'),
    //     to: path.resolve(__dirname, 'dist/ico')
    //   }
    // ]),
    new MiniCssExtractPlugin({
      filename: filename('css',isDev)
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: {
              root: path.resolve(__dirname, 'src'),
              basedir: path.resolve(__dirname, 'src'),
            }
          },
          {
            loader: path.resolve(__dirname, 'auto-input-loader/pug-auto-input-loader.ts'),
            options: {
              nameImportsFile: 'importsFile'
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: cssLoaders(),
      },

      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env','@babel/preset-typescript']
          }
        }
      },
    ]
  }
}
