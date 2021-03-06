const path = require("path");

module.exports = {
  entry: "./src/client.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "build"),
  },
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg/,
        use: {
          loader: "svg-url-loader",
        },
      },
    ],
  },
};
