import { paths } from "./common-paths"
import webpack from 'webpack'
import HtmlWebpackPlugin from "html-webpack-plugin"

// in case you run into any typescript error when configuring `devServer`
import 'webpack-dev-server';

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const host = process.env.HOST || "localhost";

const config: webpack.Configuration = {
  mode: "development",
  devtool: "inline-source-map",
  target: "web",
  entry: {
    "react.d3.treemap": "./src/index.tsx",
  },
  output: {
    filename: "static/js/[name].[fullhash].js",
    path: paths.outputPath,
    pathinfo: true,
    publicPath: "./",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  stats: "verbose",
  devServer: {
    host: host,
    devMiddleware: {
      publicPath: "/",
      stats: {
        colors: true,
        chunks: false,
        errors: true,
      },
    },
    port: DEFAULT_PORT,
    historyApiFallback: true,
  },
  optimization: {
    moduleIds: "named",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      inject: "body",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: "/node_modules/",
      },
      {
        enforce: "pre",
        test: /\.tsx?$/,
        use: "source-map-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.ts(x?)$/,
        use: [{ loader: "ts-loader" }],
        include: paths.srcPath,
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        exclude: [/node_modules/],
        include: paths.srcPath,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
    ],
  },
};

export default config;