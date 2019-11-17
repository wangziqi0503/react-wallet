const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const project = require('../project.config');
const baseWebpackConfig = require('./webpack.config');

const inProject = path.resolve.bind(path, project.basePath);
const inProjectSrc = (file) => inProject(project.srcDir, file);

module.exports = merge(baseWebpackConfig, {
    entry: [
        'babel-polyfill',
        'react-hot-loader/patch',
        `webpack-hot-middleware/client?path=/__webpack_hmr&noInfo=true&name=web&overlay=false`,
        inProjectSrc(project.main)
    ],
    output: {
        path: inProject(project.outDir),
        filename: '[name].js',
        publicPath: project.publicPath        
    },
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(), 
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsWebpackPlugin(),

        new HtmlWebpackPlugin({
            template: inProjectSrc('index.html'),            
            inject: true
        }),
    ]
});