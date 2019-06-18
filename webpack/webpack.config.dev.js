const commonPaths = require("./common-paths");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const protocol = process.env.HTTPS === "true" ? "https" : "http";
const host = process.env.HOST || "localhost";

module.exports = {
  // To enhance the debugging process. More info: https://webpack.js.org/configuration/devtool/
  devtool: "inline-source-map",
  target: "web",
  entry: {
    "react.d3.treemap": "./src/index.tsx"
  },
  output: {
    filename: "static/js/[name].[hash].js",
    path: commonPaths.outputPath,
    pathinfo: true,
    publicPath: "./"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  devServer: {
    hot: true,
    contentBase: commonPaths.contentBasePath, // match the output path
    publicPath: "/",
    host: host,
    https: protocol === "https",
    port: DEFAULT_PORT,
    disableHostCheck: true,
    historyApiFallback: true,
    stats: {
      colors: true, // color is life
      chunks: false, // this reduces the amount of stuff I see in my terminal; configure to your needs
      "errors-only": true
    }
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      inject: 'body'
    }),
    // enable HMR globally
    new webpack.HotModuleReplacementPlugin(),
    // prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin()
  ],
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: "/node_modules/"
      },
      {
        enforce: "pre",
        test: /\.tsx?$/,
        use: "source-map-loader",
        exclude: "/node_modules/"
      },
      {
        test: /\.ts(x?)$/,
        use: [{ loader: "ts-loader" }],
        include: commonPaths.srcPath,
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        exclude: [/node_modules/],
        include: commonPaths.srcPath,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              importLoaders: 1,
              localsConvention: "camelCase",
              modules: {
                localIdentName: "[name]_[local]_[hash:base64:5]"
              }
            }
          }
        ]
      }
    ]
  }
};
