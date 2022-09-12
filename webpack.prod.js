const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const ZopfliPlugin = require("zopfli-webpack-plugin");


module.exports = merge(common, {
  mode: "production",
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }]
  },
  plugins: [
    new ZopfliPlugin({
      asset: "[path].gz[query]",
      algorithm: "zopfli",
      test: /.*/,
      deleteOriginalAssets: false
    })
  ]
});
