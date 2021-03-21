const resolve = require("path").resolve;
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  devtool: "source-map",
  entry: {
    "react.d3.treemap": "./src/indexPackage.ts"
  },
  context: resolve(__dirname, "../"),
  output: {
    path: resolve(__dirname, "./../dist"),
    filename: "[name].js",
    libraryTarget: "umd",
    library: "ReactD3Treemap"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  externals: {
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react",
      umd: "react"
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs2: "react-dom",
      commonjs: "react-dom",
      amd: "react-dom",
      umd: "react-dom"
    }
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production") 
      },
      DEBUG: false, 
      __DEVTOOLS__: false 
    }),
    
    new MiniCssExtractPlugin({
      filename: "../dist/[name].css",
    })
  ],
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: ["/node_modules/"]
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.package.json"
            }
          }
        ]
      },
      {
        test: /\.css$/i,
        include: resolve(__dirname, "./../src"),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader"
          }
        ]
      }
    ]
  }
};
