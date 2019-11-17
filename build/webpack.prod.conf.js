const webpack = require('webpack');
const moment = require('moment');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const project = require('../project.config');
const baseWebpackConfig = require('./webpack.config');

const inProject = path.resolve.bind(path, project.basePath);
const inProjectSrc = (file) => inProject(project.srcDir, file);
const timestamp = Date.now();
const now = moment(timestamp).format('YYYYMMDDHHmmss'); // 文件时间戳
const time = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
const year = moment(timestamp).format('YYYY');

// const bundles = [];

//     if (project.vendors && project.vendors.length) {
//         bundles.unshift('vendor');
//         config.entry.vendor = project.vendors;
//     }

//     if (project.thirds && project.thirds.length) {
//         bundles.unshift('thirds');
//         config.entry.thirds = project.thirds;
//     }

//     config.plugins.push();

module.exports = merge(baseWebpackConfig, {
    entry: {
        app: [inProjectSrc(project.main)],
        vendor: project.vendors,
        thirds: project.thirds
    },
    output: {
        path: inProject(project.outDir),
        filename: '[name].min.js',
        publicPath: project.publicPath,
        chunkFilename: '[name].chunk.min.js'
    },
    devtool: false,
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true, 
            debug: false
        }),

        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            comments: false,
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
                join_vars: true
            }
        }),
        new HtmlWebpackPlugin({
            template: inProjectSrc('index.prd.html'),            
            inject: false,
            cdn: project.cdn,
            time: now,    
            minify: {
                collapseWhitespace: true
            }
        }),

        new webpack.BannerPlugin(`${project.name} v: ${project.version} | Copyright © ${year} Ifeng.com, Inc. All Rights Reserved | Date - ${time}`),

        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'report.html',
            defaultSizes: 'parsed',
            openAnalyzer: true,
            generateStatsFile: false,
            statsFilename: 'stats.json',
            statsOptions: null,
            logLevel: 'error'            
        }),

        new webpack.optimize.CommonsChunkPlugin({names: ['thirds', 'vendor']})
    ]
});
