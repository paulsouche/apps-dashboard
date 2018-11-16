const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;

const isProd = process.env.npm_lifecycle_event === 'build';
const port = parseInt(process.env.PORT, 10) || 3000;
const host = process.env.HOST || 'localhost';
const version = process.env.VERSION || require('./package.json').version;
const mode = isProd ? 'production' : 'development';
let env;
try {
  env = require('./env.json');
} catch {
  env = JSON.parse(process.env.ENV || '{}');
}

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [process.cwd()].concat(args));
}

const postcssOptions = {
  plugins: [
    autoprefixer({
      browsers: [
        'last 2 versions',
        'iOS >= 8',
        'Android >= 4.4',
        'Explorer >= 11',
        'ExplorerMobile >= 11',
      ],
      cascade: false,
    }),
  ],
};

const makeWebpackConfig = ({
  entry,
  buildEnv = {},
  disableAot = false,
}) => {
  const isAot = isProd && !disableAot;

  const webpackConfig = {
    mode,
    entry,
    output: {
      path: root('www'),
      filename: '[name].[hash].js',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: isAot
            ? [
              { loader: '@ngtools/webpack' },
            ]
            : [
              { loader: 'ng-router-loader' },
              { loader: 'angular2-template-loader' },
              { loader: 'ts-loader' },
            ],
        },
        {
          test: /\.(png|gif|svg)$/,
          include: root('src'),
          loader: 'file-loader?name=images/[name].[ext]?[hash]',
        },
        {
          test: /\.scss$/,
          include: root('src', 'app'),
          use: [
            { loader: 'raw-loader' },
            { loader: 'postcss-loader', options: postcssOptions },
            { loader: 'sass-loader' },
          ],
        },
        {
          test: /\.scss$/,
          exclude: root('src', 'app'),
          use: isProd
            ? [
              { loader: MiniCssExtractPlugin.loader },
              { loader: 'css-loader' },
              { loader: 'postcss-loader', options: postcssOptions },
              { loader: 'sass-loader' },
            ]
            : [
              { loader: 'style-loader' },
              { loader: 'css-loader' },
              { loader: 'postcss-loader', options: postcssOptions },
              { loader: 'sass-loader' },
            ],
        },
        {
          test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
          parser: { system: true },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.scss', '.svg', '.png', '.gif'],
    },
    plugins: [
      new webpack.DefinePlugin({
        // Environment helpers
        build: JSON.stringify({
          ...{
            version,
            mode,
          },
          ...buildEnv,
        }),
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: root('src', 'index.ejs'),
        version,
        isProd,
      }),
    ],
    devServer: {
      host,
      port,
      stats: 'errors-only',
    },
  };

  if (isAot) {
    webpackConfig.plugins.push(
      new AngularCompilerPlugin({
        tsConfigPath: root('tsconfig.aot.json'),
        entryModule: root('src', 'app', 'app.module#AppModule'),
      }));
  } else {
    webpackConfig.plugins.push(
      new webpack.ContextReplacementPlugin(
        /(.+)?angular(\\|\/)core(.+)?/,
        root('src')));
  }

  if (isProd) {
    webpackConfig.plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
        chunkFilename: '[id].[hash].css',
      }));
  }

  return webpackConfig;
};

module.exports = makeWebpackConfig({
  entry: {
    'app': './src/main.ts',
    'ie-polyfills': [
      'core-js/es6/array',
      'core-js/es6/date',
      'core-js/es6/function',
      'core-js/es6/map',
      'core-js/es6/math',
      'core-js/es6/number',
      'core-js/es6/object',
      'core-js/es6/parse-float',
      'core-js/es6/parse-int',
      'core-js/es6/reflect',
      'core-js/es6/regexp',
      'core-js/es6/set',
      'core-js/es6/string',
      'core-js/es6/symbol',
      'core-js/es6/weak-map',
      'whatwg-fetch',
    ],
    'polyfills': [
      'core-js/es7/array',
      'core-js/es7/reflect',
      'reflect-metadata',
      'zone.js/dist/zone',
      'whatwg-fetch',
    ],
  },
  buildEnv: env,
  // TODO: find why
  disableAot: true,
});
