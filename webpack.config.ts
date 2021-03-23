/** @type {import('node')} */
import {Configuration, RuleSetRule, RuleSetUseItem} from "webpack";

import path = require('path')
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin = require('copy-webpack-plugin')
import HTMLWebpackPlugin = require('html-webpack-plugin')
import MiniCssExtractPlugin = require('mini-css-extract-plugin')
import OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
import TerserWebpackPlugin = require('terser-webpack-plugin')

import { AutoInputOptions } from "auto-imports-loader/types";

class WebpackConfigModule {
    getModule() {
      return this.module
    }
  private readonly module: Configuration['module'] = { rules: [] }
  private readonly rules: Configuration['module']['rules'] = this.module.rules
  protected readonly importFilesGenerators: AutoInputOptions['parsedImportFilesGenerators']
  constructor(options?: { importFilesGenerators: AutoInputOptions['parsedImportFilesGenerators'], importJsonFileName: string }) {
    if (options) {
      this.importFilesGenerators = options.importFilesGenerators
    }
    this.rules.push(this.getJsRule())
    this.rules.push(this.getTsRule())
    this.rules.push(this.getCssRule())
    this.rules.push(this.getScssRule())
    this.rules.push(this.getPugRule())
  }
  protected getPugRule(): RuleSetRule {
    const pugRule: RuleSetRule = {}
    pugRule.test = /\.pug$/
    pugRule.use = [
      {
        loader: 'pug-loader',
        options: {
          root: path.resolve(__dirname, 'src'),
          basedir: path.resolve(__dirname, 'src'),
        }
      },
    ]
    return pugRule
  }
  protected getCssRule(): RuleSetRule {
    const cssRule: RuleSetRule = {}
    cssRule.test = /\.css$/
    const use: RuleSetUseItem[] = [
      MiniCssExtractPlugin.loader,
      'css-loader',
    ]
    cssRule.use = use
    return cssRule
  }
  protected getScssRule(): RuleSetRule {
    const scssRule: RuleSetRule = this.getCssRule()
    scssRule.test = /\.s[ac]ss$/;
    (scssRule.use as RuleSetUseItem[]).push('sass-loader')
    return scssRule
  }
  protected getJsRule(): RuleSetRule {
    const jsRule: RuleSetRule = {}
    jsRule.test = /\.m?js$/
    jsRule.exclude = /node_modules/
    const use: {
      ident?: string
      loader?: string
      options?: string | { [index: string]: any }
    } = {
      loader: "babel-loader",
      options: {
        presets: ['@babel/preset-env']
      }
    }
    jsRule.use = use
    return jsRule
  }
  protected getTsRule(): RuleSetRule {
    const tsRule: RuleSetRule = this.getJsRule()
    tsRule.test = /\.ts$/;
    (tsRule.use as {
      ident?: string
      loader?: string
      options?: { presets: string[], [index: string]: any }
    }).options.presets.push('@babel/preset-typescript')
    return tsRule
  }

  protected empty() { }
}

class WebpackConfig {
  getConfig() {
    return Object.assign({}, this.config, this.initialConfig)
  }
  private readonly config: Configuration = {}
  protected readonly isDev = process.env.NODE_ENV == 'development'
  protected readonly initialConfig: Configuration
  constructor(config?: Configuration) {
    this.initialConfig = config || {}
    this.setMode()
    this.setOptimization()
    this.setModule()
    this.setPlugins()
    this.setResolve()
    this.setOutput()
    this.setEntry()
    this.setTarget()
    this.setContext()
  }
  protected setMode() {
    this.config.mode = this.isDev ? 'development' : 'production'
  }
  protected setOptimization() {
    this.config.optimization = {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 100,
        minSize: 1000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // получает имя, то есть node_modules/packageName/not/this/part.js
              // или node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
              // имена npm-пакетов можно, не опасаясь проблем, использовать
              // в URL, но некоторые серверы не любят символы наподобие @
              return `npm.${packageName.replace('@', '')}`
            },
          },
        },
      },
    }
    if (!this.isDev) {
      this.config.optimization.minimizer = [
        new OptimizeCssAssetsWebpackPlugin(),
        new TerserWebpackPlugin(),
      ]
    }
  }
  protected setModule() {
    const moduleGenerator = new WebpackConfigModule()
    this.config.module = moduleGenerator.getModule()
  }
  protected setPlugins() {
    const name = 'index'
    const HWPSetup = {
      template: `pages/${name}/${name}.pug`,
      filename: `${name}${this.isDev ? '' : '.[contenthash]'}.html`,
    }
    this.config.plugins = [
      new HTMLWebpackPlugin(HWPSetup),
      new MiniCssExtractPlugin({
        filename: filename('css',isDev)
      }),
      new CleanWebpackPlugin(),
    ]
  }
  protected setResolve() {
    this.config.resolve = {
      alias: {
        '@simple': path.resolve(__dirname, 'src/components/simple'),
        '@complicated': path.resolve(__dirname, 'src/components/complicated'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@layouts': path.resolve(__dirname, 'src/layouts'),
        '@pages': path.resolve(__dirname, 'src/pages'),
      },
    }
  }
  protected setOutput() {
    this.config.output = {
      filename: filename('js', isDev),
      path: path.resolve(__dirname, 'dist'),
    }
  }
  protected setEntry() {
    this.config.entry = {
      main: ['@babel/polyfill', path.resolve(__dirname,'src/pages/index/index.js')],
    }
  }
  protected setTarget() {
    this.config.target = this.isDev ? "web" : "browserslist"
  }
  protected setContext() {
    this.config.context = path.resolve(__dirname, 'src')
  }
  protected setQ() {
    // this.config.q =
  }
}
const isDev = process.env.NODE_ENV == 'development'

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

const webpackConfig : Configuration = {
  module: {
    rules: [
      {
        test: /\.pug$/,
        include: [
          path.resolve(__dirname, "src/pages")
        ],
        exclude: [
          s => path.basename(s, path.extname(s)) == 'imports'
        ],
        use: [
          {
            loader: 'pug-loader',
            options: {
              root: path.resolve(__dirname, 'src'),
              basedir: path.resolve(__dirname, 'src'),
            }
          },
          {
            loader: 'auto-imports-loader',
            options: {
              sources: ['src/components/complicated', 'src/components/simple',],
              startImportFileName: 'import.json',
              parsedImportFilesGenerators: new Map([
                ['imports.pug', (importPath) => `include ${importPath.split('\\').join('/')}\n`],
              ]),
            }
          }
        ]
      },
      {
        test: /\.pug$/,
        exclude: {
          and: [
            path.resolve(__dirname, "src/pages")
          ],
          not: [
            s => path.basename(s, path.extname(s)) == 'imports'
          ]
        },
        use: [
          {
            loader: 'pug-loader',
            options: {
              root: path.resolve(__dirname, 'src'),
              basedir: path.resolve(__dirname, 'src'),
            }
          },
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
const webpackConfigTest = new WebpackConfig(webpackConfig)
export default webpackConfigTest.getConfig()
