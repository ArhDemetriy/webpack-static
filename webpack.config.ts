/** @type {import('node')} */
import {
  Configuration, RuleSetRule, RuleSetUseItem, ProvidePlugin,
} from 'webpack';
import { readdirSync } from 'fs';

import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { AutoImportsPlugin } from 'auto-imports-plugin';

import path = require('path');
import HTMLWebpackPlugin = require('html-webpack-plugin');
import MiniCssExtractPlugin = require('mini-css-extract-plugin');
import OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
import TerserWebpackPlugin = require('terser-webpack-plugin');

/**
 * generate Configuration.module
 * @param {boolean} isDev boolean
 * @example
 * webpackConfig.module = (new WebpackConfigModule(isDev)).getModule()
 */
class WebpackConfigModule {
  /**
   * @return {import("webpack").Configuration['module']} Configuration.module
   */
  getModule() {
    return this.module;
  }

  private readonly module: Configuration['module'] = { rules: [] };

  protected readonly rules: Configuration['module']['rules'] = this.module.rules;

  protected readonly importJsonFileName: string = 'imports';

  protected readonly isDev: boolean;

  /**
   * @param {boolean} isDev
   * @constructor
   */
  constructor(isDev: boolean) {
    this.isDev = isDev;
    this.setCssRule();
    this.setScssRule();
    this.setJsRule();
    this.setTsRule();
    this.setPugRule();
    this.setImgRule();
    this.setFontsRule();
  }

  protected getCssRule(): RuleSetRule {
    const cssRule: RuleSetRule = {};
    cssRule.test = /\.css$/;
    const use: RuleSetUseItem[] = [
      MiniCssExtractPlugin.loader,
      'css-loader',
    ];
    cssRule.use = use;
    return cssRule;
  }

  protected setCssRule() {
    this.rules.push(this.getCssRule());
  }

  protected setScssRule() {
    const scssRule: RuleSetRule = this.getCssRule();
    scssRule.test = /\.s[ac]ss$/;
    (scssRule.use as RuleSetUseItem[]).push('sass-loader');
    this.rules.push(scssRule);
  }

  protected getJsRule(): RuleSetRule {
    const jsRule: RuleSetRule = {};
    jsRule.test = /\.m?js$/;
    jsRule.exclude = /node_modules/;
    const use: {
      ident?: string
      loader?: string
      options?: string | { [index: string]: any }
    } = {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    };
    jsRule.use = use;
    return jsRule;
  }

  protected setJsRule() {
    this.rules.push(this.getJsRule());
  }

  protected setTsRule() {
    const tsRule: RuleSetRule = this.getJsRule();
    tsRule.test = /\.ts$/;
    (tsRule.use as {
      ident?: string
      loader?: string
      options?: { presets: string[], [index: string]: any }
    }).options.presets.push(
      '@babel/preset-typescript',
    );
    this.rules.push(tsRule);
  }

  protected setImgRule() {
    const imgRule: RuleSetRule = {};
    imgRule.test = /\.(png|jpg|svg|gif|svg)$/;
    imgRule.type = 'asset/resource';
    imgRule.exclude = path.resolve(__dirname, 'src/assets/fonts');
    const name = this.isDev ? '[name]' : '[contenthash]';
    imgRule.generator = {
      filename: (options) => {
        let dirName = 'img';
        if (path.basename(path.dirname(options.filename)).trim().toLowerCase() === 'ico') {
          dirName = 'ico';
        }
        return `${dirName}/${name}[ext]`;
      },
    };
    this.rules.push(imgRule);
  }

  protected setFontsRule() {
    const fontsRule: RuleSetRule = {};
    fontsRule.test = /\.(svg|ttf|eot|woff|woff2)$/;
    fontsRule.type = 'asset/resource';
    fontsRule.include = path.resolve(__dirname, 'src/assets/fonts');
    fontsRule.generator = {
      filename: (options) => {
        const dirName = path.basename(path.dirname(options.filename)).trim();
        return `fonts/${dirName}/[name][ext]`;
      },
    };
    this.rules.push(fontsRule);
  }

  protected setPugRule() {
    const pugRule: RuleSetRule = {};
    pugRule.test = /\.pug$/;
    pugRule.use = [
      {
        loader: 'pug-loader',
        options: {
          root: path.resolve(__dirname, 'src/components'),
        },
      },
    ];
    this.rules.push(pugRule);
  }
}
/**
 * @param {Configuration} initialConfig
 * overload self config
 * @example
 * webpackConfig = new WebpackConfig()
 */
class WebpackConfig {
  /**
   * Object.assign( this.config, initialConfig )
   * @returns {Configuration} WebpackConfig
   */
  getConfig() {
    return { ...this.config, ...this.initialConfig };
  }

  protected readonly config: Configuration = {};

  protected readonly isDev: boolean;

  protected readonly initialConfig: Configuration;

  // имя этого каталога используется в нескольких методах, потому вынес в отдельную переменную
  // name of this dir is using in many methods, so i transfer him in this var
  protected readonly pagesDir = 'pages';

  protected readonly pages: string[];

  constructor(config: Configuration = {}) {
    this.isDev = this.getIsDev();
    this.initialConfig = config;
    this.pages = this.getDirectoriesInPages();

    // webpack config generation
    this.setMode();
    this.setOptimization();
    this.setModule();
    this.setPlugins();
    this.setResolve();
    this.setOutput();
    this.setEntry();
    this.setTarget();
    this.setContext();
    this.setServe();
    this.setDevtool();
  }

  protected getIsDev() {
    const ENV = process.env.NODE_ENV === 'development';
    const serve = process.env.npm_lifecycle_event.toLocaleLowerCase().includes('serve');
    const watch = process.env.npm_lifecycle_event.toLocaleLowerCase().includes('watch');
    return ENV || serve || watch;
  }

  protected setDevtool() {
    if (this.isDev) { this.config.devtool = 'source-map'; }
  }

  protected setServe() {
    if (!process.env.npm_lifecycle_event.toLocaleLowerCase().includes('serve')) return;
    if (!this.isDev) return;

    this.config.watch = false;
    (this.config as any).devServer = {
      port: 1234,
      contentBase: path.resolve(__dirname, 'dist'),
      compress: true,
      hot: true,
      index: 'index.html',
      writeToDisk: true,
    };
  }

  protected setMode() {
    this.config.mode = this.isDev ? 'development' : 'production';
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
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              // имена npm-пакетов можно, не опасаясь проблем, использовать
              // в URL, но некоторые серверы не любят символы наподобие @
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      },
    };
    if (!this.isDev) {
      this.config.optimization.minimizer = [
        new OptimizeCssAssetsWebpackPlugin(),
        new TerserWebpackPlugin(),
      ];
    }
  }

  protected setModule() {
    const moduleGenerator = new WebpackConfigModule(this.isDev);
    this.config.module = moduleGenerator.getModule();
  }

  protected getHTMLWebpackPluginOptions(pageName: string): HTMLWebpackPlugin.Options {
    const HWPSetup: HTMLWebpackPlugin.Options = {
      template: `${this.pagesDir}/${pageName}/${pageName}.pug`,
      // Не использовать поля класса, например this.pagesDir.
      // Это результирующий файл, его каталог не то-же самое что каталоги в src.
      filename: `${pageName}.html`,
      scriptLoading: 'defer',
      title: pageName,
      showErrors: this.isDev,
      favicon: path.resolve(__dirname, 'src/assets/favicon.png'),
      // TO DO проверить минификацию, если работает без настроек - удалить. Минорно
      // minify: 'auto',
      // TO DO выяснить как работает, настроить или удалить. Минорно
      // chunks: [pageName],
    };
    return HWPSetup;
  }

  protected getHTMLWebpackPluginsForAllPages(): Configuration['plugins'] {
    const HWPs = this.pages.map((pageName) => {
      const options = this.getHTMLWebpackPluginOptions(pageName);
      return new HTMLWebpackPlugin(options);
    });
    return HWPs;
  }

  protected getCleanWebpackPlugin() {
    const options: ConstructorParameters<typeof CleanWebpackPlugin>[0] = {};

    const serve = process.env.npm_lifecycle_event.toLocaleLowerCase().includes('serve');
    const watch = process.env.npm_lifecycle_event.toLocaleLowerCase().includes('watch');
    if (serve || watch) {
      options.cleanStaleWebpackAssets = false;
    }

    return new CleanWebpackPlugin(options);
  }

  protected setPlugins() {
    this.config.plugins = [].concat(
      new MiniCssExtractPlugin({
        filename: `styles/[name]${this.isDev ? '' : '.[contenthash]'}.css`,
      }),
      this.getCleanWebpackPlugin(),
      new ProvidePlugin({
        $: 'jQuery',
        jQuery: 'jQuery',
      }),
      this.getHTMLWebpackPluginsForAllPages(),

      new AutoImportsPlugin({
        sources: ['src/components/complicated', 'src/components/simple'],
        startDirs: this.pages.map((dirName) => path.join('src/pages', dirName)),
        basenameImportFiles: 'imports',
        importsExprGenerators: this.getImportsExprGenerators(),
      }),
    );
  }

  protected getImportsExprGenerators() {
    const pugImportsExprGenerator = (importPath: string) => `include ${importPath.split('\\').join('/')}\n`;
    const jsImportsExprGenerator = (importPath: string) => `import '${importPath.split('\\').join('/')}';\n`;
    const tsImportsExprGenerator = jsImportsExprGenerator;

    const importsExprGenerators: ConstructorParameters<typeof AutoImportsPlugin>['0']['importsExprGenerators'] = new Map();
    importsExprGenerators.set('.pug', pugImportsExprGenerator);
    importsExprGenerators.set('.js', jsImportsExprGenerator);
    importsExprGenerators.set('.ts', tsImportsExprGenerator);

    return importsExprGenerators;
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
    };
  }

  protected setOutput() {
    let filename = 'scripts/[name]';
    if (!this.isDev) {
      filename += '.[contenthash]';
    }
    filename += '.js';

    this.config.output = {
      filename,
      path: path.resolve(__dirname, 'dist'),
      publicPath: './',
    };
  }

  protected setEntry() {
    this.config.entry = {};
    for (const pageName of this.pages) {
      this.config.entry[pageName] = [
        '@babel/polyfill',
        path.resolve(__dirname, `src/${this.pagesDir}/${pageName}/${pageName}.js`),
      ];
    }
  }

  protected setTarget() {
    this.config.target = this.isDev ? 'web' : 'browserslist';
  }

  protected setContext() {
    this.config.context = path.resolve(__dirname, 'src');
  }

  protected getDirectoriesInPages(): string[] {
    return readdirSync(path.resolve(__dirname, 'src', this.pagesDir), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  }
}

const webpackConfigTest = new WebpackConfig();
export default webpackConfigTest.getConfig();
