const path = require("path");

// injects bundles in html
const HtmlWebpackPlugin = require("html-webpack-plugin");
// cleans up dist folder
const CleanWebpackPlugin = require("clean-webpack-plugin");
// copy files to output directory
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    main: "./src/index.ts"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
      test: /\.m?js$/,
      exclude: /(bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    },
    {
      test: /\.tsx?$/,
      use: "ts-loader",
      exclude: /node_modules/
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[name].[ext]"
          }
        }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".css"]
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new HtmlWebpackPlugin({
      title: "js13k-spaceshooter",
      template: "src/index.html",
      minify: {
        collapseWhitespace: true,
        minifyCSS: true,
        removeComments: true
      }
    })
  ]
};
