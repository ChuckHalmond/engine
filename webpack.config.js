const path = require("path");
const webpack = require("webpack");

exports.default = {
  entry: "./main.ts",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      },
    ],
  },
  plugins: [
    new webpack.WatchIgnorePlugin({
      paths: [/\.js$/, /\.d\.ts$/]
    })
  ],
  resolve: {
    extensions: [".ts", ".js"],
    modules: [
      path.join(__dirname, "./")
    ]
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "./web/dist"),
    libraryTarget: "var",
    library: "main"
  }
};