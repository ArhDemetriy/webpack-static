/** @type {import('node')} */
import { Configuration, RuleSetRule, RuleSetUseItem } from "webpack"

import path = require('path')
import { readdirSync } from 'fs'

import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin = require('copy-webpack-plugin')
import HTMLWebpackPlugin = require('html-webpack-plugin')
import MiniCssExtractPlugin = require('mini-css-extract-plugin')
import OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
import TerserWebpackPlugin = require('terser-webpack-plugin')
import { AutoImportsPlugin } from "./AutoImportsPlugin/AutoImportsPlugin";

function getImportsExprGenerator() {
  const scssImportsExprGenerator = (importPath: string) => {
    const beginExpr = "@import '";
    const endExpr = "';\n";
    const ideCompatiblyImportPath = importPath.split('\\').join('/')
    const scssCompatiblyImportPath = ideCompatiblyImportPath.slice(ideCompatiblyImportPath.indexOf('src/'))

    return beginExpr + scssCompatiblyImportPath + endExpr
  }
  const pugImportsExprGenerator = (importPath: string) => `include ${importPath.split('\\').join('/')}\n`

  const importsExprGenerators = new Map() as Map<string, (importPath: string) => string>
  importsExprGenerators.set('.scss',scssImportsExprGenerator)
  importsExprGenerators.set('.pug', pugImportsExprGenerator)

  return importsExprGenerators
}


/**
 * generate Configuration.module
 */
class WebpackConfigModule {
  /**
   * @return {Configuration['module']} Configuration.module
   */
  getModule() {
    return this.module
  }
  private readonly module: Configuration['module'] = { rules: [] }
  protected readonly rules: Configuration['module']['rules'] = this.module.rules
  protected readonly importJsonFileName: string = 'imports'
  protected readonly isDev: boolean

  constructor(isDev: boolean) {
    this.isDev = isDev
    this.rules.push(this.getJsRule())
    this.rules.push(this.getTsRule())
    this.rules.push(this.getCssRule())
    this.rules.push(this.getScssRule())
    this.rules.push(this.getImgRule())
    this.rules.push(this.getPugRule())
  }
  protected getCssRule(): RuleSetRule {
    const cssRule: RuleSetRule = {}
    cssRule.test = /\.css$/
    const use: RuleSetUseItem[] = [
      MiniCssExtractPlugin.loader,
      'css-loader',
    ]
    cssRule.use = use
    cssRule.exclude = path.resolve(__dirname, 'src/assets/fonts')
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
  protected getImgRule(): RuleSetRule {
    const imgRule: RuleSetRule = {}
    imgRule.test = /\.(png|jpg|svg|gif)$/
    const name = this.isDev ? '[name]' : '[contenthash]'
    imgRule.use = [
      {
        loader: 'file-loader',
        options: {
          // require return only name => path gotta in this
          // ticnicly, require(file-loader) returned {default: publickPath + this.name}
          name: (fullPath) => {
            const sourceDirName = path.basename(path.dirname(fullPath)).trim().toLowerCase()
            let dirName = 'img'
            if (sourceDirName == 'ico') {
              dirName = 'ico'
            }
            return `${dirName}/${name}.[ext][query]`
          },
        },
      },
    ]
    return imgRule
  }
  protected getPugRule(): RuleSetRule {
    const pugRule: RuleSetRule = {}
    pugRule.test = /\.pug$/
    pugRule.use = [
      {
        loader: 'pug-loader',
        options: {
          root: path.resolve(__dirname, 'src/components'),
        }
      },
    ]
    return pugRule
  }
  protected empty() { }
}
/**
 * @param {Configuration} initialConfig
 * overload self config
 */
class WebpackConfig {
  /**
   * Object.assign( this.config, initialConfig )
   * @returns {Configuration} WebpackConfig
   */
  getConfig() {
    return Object.assign({}, this.config, this.initialConfig)
  }
  private readonly config: Configuration = {}
  protected readonly isDev = process.env.NODE_ENV == 'development'
  protected readonly initialConfig: Configuration
  // имя этого каталога используется в нескольких методах, потому вынес в отдельную переменную
  // name of this dir is using in many methods, so i transfer him in this var
  protected readonly pagesDir = 'pages'
  protected readonly pages: string[]
  constructor(config?: Configuration) {
    this.initialConfig = config || {}
    this.pages = this.getDirectoriesInPages()

    // webpack config generation
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
        minSize: 0,
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
    const moduleGenerator = new WebpackConfigModule(this.isDev)
    this.config.module = moduleGenerator.getModule()
  }
  protected getHTMLWebpackPluginOptions(pageName: string): HTMLWebpackPlugin.Options {
    const HWPSetup: HTMLWebpackPlugin.Options = {
      template: `${this.pagesDir}/${pageName}/${pageName}.pug`,
      // не использовать поля класса, например this.pagesDir. Это результирующий файл, его каталог не то-же самое что каталоги в src.
      filename: `${pageName}.html`,
      scriptLoading: 'defer',
      title: pageName,
      showErrors: this.isDev,
      favicon: path.resolve(__dirname, 'src/assets/favicon.png',),
      // TO DO проверить минификацию, если работает без настроек - удалить. Минорно
      // minify: 'auto',
      // TO DO выяснить как работает, настроить или удалить. Минорно
      // chunks: [pageName],
    }
    return HWPSetup
  }
  protected getHTMLWebpackPluginsForAllPages(): Configuration['plugins']{
    const HWPs = this.pages.map(pageName => {
      const options = this.getHTMLWebpackPluginOptions(pageName)
      return new HTMLWebpackPlugin(options)
    })
    return HWPs
  }
  protected setPlugins() {
    this.config.plugins = [].concat(
      [
        new MiniCssExtractPlugin({
          filename: `styles/[name]${this.isDev ? '' : '.[contenthash]'}.css`,
        }),
        new CleanWebpackPlugin(),
      ],
      this.getHTMLWebpackPluginsForAllPages(),
      new AutoImportsPlugin({
        sources: ['src/components/complicated', 'src/components/simple',],
        startDirs: this.pages.map(dirName => path.join('src/pages', dirName)),
        basenameImportFiles: 'imports',
        importsExprGenerators: this.getImportsExprGenerators()
      })
    )
  }
  protected getImportsExprGenerators() {
    const scssImportsExprGenerator = (importPath: string) => {
      const beginExpr = "@import '";
      const endExpr = "';\n";
      const ideCompatiblyImportPath = importPath.split('\\').join('/')
      const scssCompatiblyImportPath = ideCompatiblyImportPath.slice(ideCompatiblyImportPath.indexOf('src/'))

      return beginExpr + scssCompatiblyImportPath + endExpr
    }
    const pugImportsExprGenerator = (importPath: string) => `include ${importPath.split('\\').join('/')}\n`

    const importsExprGenerators = new Map() as Map<string, (importPath: string) => string>
    importsExprGenerators.set('.scss',scssImportsExprGenerator)
    importsExprGenerators.set('.pug', pugImportsExprGenerator)

    return importsExprGenerators
  }
  protected setResolve() {
    const alias = {
      '@simple': path.resolve(__dirname, 'src/components/simple'),
      '@complicated': path.resolve(__dirname, 'src/components/complicated'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    };
    // имя этого каталога используется много где, потому вынес в отдельную переменную
    alias[`@${this.pagesDir}`] = path.resolve(__dirname, 'src', this.pagesDir);

    this.config.resolve = {
      alias,
    }
  }
  protected setOutput() {
    this.config.output = {
      filename: `scripts/[name]${this.isDev ? '' : '.[contenthash]'}.js`,
      path: path.resolve(__dirname, 'dist'),
      publicPath: './'
    }
  }
  protected setEntry() {
    this.config.entry = {}
    for (const pageName of this.pages) {
      this.config.entry[pageName] = [
        '@babel/polyfill',
        path.resolve(__dirname, `src/${this.pagesDir}/${pageName}/${pageName}.js`),
      ]
    }
  }
  protected setTarget() {
    this.config.target = this.isDev ? "web" : "browserslist"
  }
  protected setContext() {
    this.config.context = path.resolve(__dirname, 'src')
  }
  protected getDirectoriesInPages(): string[] {
    return readdirSync(path.resolve(__dirname, 'src', this.pagesDir), { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
  }
  // заготовка под другие настройки
  protected setQ() {
    // this.config.q =
  }
}

const webpackConfigTest = new WebpackConfig()
export default webpackConfigTest.getConfig()
