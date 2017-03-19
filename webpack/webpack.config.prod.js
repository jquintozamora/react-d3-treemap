///////////////////////////////////////////////////////////////////////////////////////////////////
//  WebPack 2 PROD Config
///////////////////////////////////////////////////////////////////////////////////////////////////

const resolve = require('path').resolve;
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    devtool: 'source-map',
    entry: {
        'React.TaxonomyPicker': './app/src/index.tsx'
    },
    context: resolve(__dirname, '../'),
    output: {
        path: resolve(__dirname, './../dist'),
        filename: '[name].js',
        // Possible value - amd, commonjs, commonjs2, commonjs-module, this, var
        libraryTarget: 'umd',
        // library bundle to be available as a global variable when imported
        library: 'TaxonomyPicker'
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js"]
    },
    // Exclude React from the bundle, must be react and react-dom here otherwise will not be excluded
    externals: {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
        umd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
        umd: 'react-dom',
      },
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')      // Reduces 78 kb on React library
            },
            'DEBUG': false,                                 // Doesn´t have effect on my example
            '__DEVTOOLS__': false                           // Doesn´t have effect on my example
        }),
        new ExtractTextPlugin({
            filename: '../dist/[name].css',
            allChunks: true
        }),
        new webpack.NormalModuleReplacementPlugin(/..\/..\/utils\/MockAPI\/SP.Taxonomy$/, "../../utils/API/SP.Taxonomy"),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
                drop_console: true,
                drop_debugger: true,
                global_defs: {
                    __REACT_HOT_LOADER__: undefined // eslint-disable-line no-undefined
                }
            },
            minimize: true,
            debug: false,
            sourceMap: true,
            output: {
                comments: false
            },
        })
    ],
    module: {
        // loaders -> rules in webpack 2
        rules: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: [
                    '/node_modules/'
                ]
            },
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                // transpileOnly: true,
                                // logInfoToStdOut: true
                            }
                        }
                    ]
            },
            {
                test: /\.css$/i,
                include: resolve(__dirname, './../app/stylesheets'),  // Use include instead exclude to improve the build performance
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                importLoaders: 1,
                                minimize: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                plugins: () => [
                                    require("postcss-import")(),
                                    require("postcss-nesting")(),
                                    require("postcss-custom-properties")(),
                                    require("autoprefixer")({
                                        browsers: ['last 2 versions', 'ie >= 9']
                                    })
                                ]
                            }
                        }
                    ]
                })
            },
            {
                test: /\.css$/i,
                include: resolve(__dirname, './../app/src'),
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                importLoaders: 1,
                                modules: true,
                                camelCase: true,
                                localIdentName: '[name]_[local]_[hash:base64:5]',
                                minimize: true
                            }
                        }
                    ]
                })
            }
        ]
    }
};
