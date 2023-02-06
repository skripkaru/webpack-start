const fs = require('fs')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const pages = fs.readdirSync(path.resolve(__dirname, 'src/pages'))

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: ['./js/main.js', './scss/main.scss'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, 'src/assets/'),
      images: path.resolve(__dirname, 'src/assets/images/'),
      icons: path.resolve(__dirname, 'src/assets/icons/'),
      fonts: path.resolve(__dirname, 'src/assets/fonts/')
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    ...pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, `src/pages/${page}`),
          filename: page.replace(/\.njk/, '.html'),
          inject: 'body',
          minify: false
        })
    ),
    new SVGSpritemapPlugin('src/assets/icons/*.svg', {
      output: {
        filename: 'sprite.svg'
      },
      sprite: {
        prefix: false,
        generate: {
          title: false
        }
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/favicon.ico')
        }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(scss|css)$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.njk$/i,
        loader: 'simple-nunjucks-loader',
        options: {
          searchPaths: path.resolve(__dirname, 'src'),
          assetsPaths: path.resolve(__dirname, 'src/assets'),
        }
      },
      {
        test: /\.(svg|png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext][query]'
        }
      }
    ]
  }
}
