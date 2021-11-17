const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/server.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "bin"),
    libraryTarget: "this",
  },
  optimization: {
    minimize: true,
  },
  target: "webworker",
  module: {
    // Asset modules are modules that allow the use asset files (fonts, icons, etc)
    // without additional configuration or dependencies.
    rules: [
      // asset/source exports the source code of the asset.
      // Usage: e.g., import notFoundPage from "./page_404.html"
      {
        test: /\.(txt|html)/,
        type: "asset/source",
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
      {
        test: /\.svg/,
        use: {
          loader: "svg-url-loader",
        },
      },
    ],
  },
  plugins: [
    // Polyfills go here.
    // Used for, e.g., any cross-platform WHATWG,
    // or core nodejs modules needed for your application.
    new webpack.ProvidePlugin({
      URL: "core-js/web/url",
    }),
  ],
};
