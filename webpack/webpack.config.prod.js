const resolve = require("path").resolve;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  devtool: "source-map",
  entry: {
    "react.d3.treemap": "./src/indexPackage.ts",
  },
  context: resolve(__dirname, "../"),
  output: {
    path: resolve(__dirname, "./../dist"),
    filename: "[name].js",
    libraryTarget: "umd",
    library: "ReactD3Treemap",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  externals: {
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react",
      umd: "react",
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs2: "react-dom",
      commonjs: "react-dom",
      amd: "react-dom",
      umd: "react-dom",
    },
  },
  mode: "production",
  optimization: {
    usedExports: true,
    minimize: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "../dist/[name].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.package.json",
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        include: resolve(__dirname, "./../src"),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
        ],
      },
    ],
  },
};
