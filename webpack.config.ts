/** @type {import('node')} */
import { Configuration, RuleSetRule, RuleSetUseItem } from "webpack"

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
  protected readonly rules: Configuration['module']['rules'] = this.module.rules
  protected readonly importJsonFileName: string = 'imports'

  constructor() {
    this.rules.push(this.getJsRule())
    this.rules.push(this.getTsRule())
    this.rules.push(this.getCssRule())
    this.rules.push(this.getScssRule())
    this.rules.push(this.getPugRuleForMainFiles())
    this.rules.push(this.getPugRuleForOtherFiles())
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
  protected getPugRuleForMainFiles(): RuleSetRule {
    const pugImportsExprGenerator = (importPath: string) => `include ${importPath.split('\\').join('/')}\n`

    const ruleForAutoImports: RuleSetRule = this.getRuleForAutoImportsLoader(pugImportsExprGenerator, '.pug')
    const pugRule: RuleSetRule = this.getPugRule()

    ruleForAutoImports.use = (pugRule.use as RuleSetUseItem[]).concat(ruleForAutoImports.use)

    return Object.assign({}, pugRule, ruleForAutoImports)
  }
  protected getPugRuleForOtherFiles(): RuleSetRule {
    const pugRuleForMainFile: RuleSetRule = this.getPugRuleForMainFiles()
    const pugRule: RuleSetRule = this.getPugRule()

    pugRule.exclude = pugRuleForMainFile.include
    pugRule.include = pugRuleForMainFile.exclude

    return pugRule
  }
  protected getRuleForAutoImportsLoader(importExprGenerator: (importPath: string) => string, ext: string, fileName: string = 'imports') {
    const autoImportsLoaderOptions: AutoInputOptions = {
      sources: ['src/components/complicated', 'src/components/simple',],
      startImportFileName: `${fileName}.json`,
      parsedImportFilesGenerators: new Map([
        [`${fileName}${ext}`, importExprGenerator],
      ]),
    }

    const rule: RuleSetRule = { use: [] };
    (rule.use as RuleSetUseItem[]).push({
      loader: 'auto-imports-loader',
      options: autoImportsLoaderOptions,
    })

    const include: RuleSetRule['include'] = {
      and: [path.resolve(__dirname, "src/pages")],
      not: [(s: string) => path.basename(s, path.extname(s)) == fileName],
    }
    rule.include = include

    return rule
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
    const HWPSetup : HTMLWebpackPlugin.Options = {
      template: `pages/${name}/${name}.pug`,
      filename: `${name}${this.isDev ? '' : '.[contenthash]'}.html`,
    }
    this.config.plugins = [
      new HTMLWebpackPlugin(HWPSetup),
      new MiniCssExtractPlugin({
        filename: `[name]${this.isDev ? '' : '.[contenthash]'}.css`
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
      filename: `[name]${this.isDev ? '' : '.[contenthash]'}.js`,
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

const webpackConfigTest = new WebpackConfig()
export default webpackConfigTest.getConfig()
