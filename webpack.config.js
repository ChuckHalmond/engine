const path = require("path");

exports.default = {
  entry: "./main.ts",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      },
      {
        test: /\.svg/,
        type: "asset/resource"
      },
      {
        test: /\.ttf/,
        type: "asset/resource"
      }
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    modules: [
      path.join(__dirname, "./")
    ],
    alias: {
      "editor": path.resolve(__dirname, "./node_modules/editor/"),
    }
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "./web/dist"),
    libraryTarget: "var",
    library: "main"
  }
};