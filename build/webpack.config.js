const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const project = require('../project.config');

const inProject = path
    .resolve
    .bind(path, project.basePath);

const inProjectSrc = (file) => inProject(project.srcDir, file);

const __DEV__ = project.env === 'development';
const __TEST__ = project.env === 'test';
const __PROD__ = project.env === 'production';


// CONFIG
const config = {
    resolve: {
        modules: [
            inProject(project.srcDir),
            'node_modules'
        ],
        extensions: ['*', '.js', '.jsx', '.json']
    },

    externals: project.externals,

    module: {
        rules: []
    },

    plugins: [new webpack.DefinePlugin(Object.assign({
            'process.env': {
                NODE_ENV: JSON.stringify(project.env)
            },
            __DEV__,
            __TEST__,
            __PROD__
        }, project.globals))]
};


// JavaScript ------------------------------------
config.module.rules.push({
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [{
        loader: 'babel-loader',
        query: {
            cacheDirectory: true,
            plugins: [
                'babel-plugin-transform-class-properties',
                'babel-plugin-syntax-dynamic-import',
                'babel-plugin-transform-runtime',
                'react-hot-loader/babel',
                'babel-plugin-transform-react-jsx',
                // [
                //     'babel-plugin-transform-runtime',
                //     {
                //         helpers: true,
                //         polyfill: false, // we polyfill needed features in src/normalize.js
                //         regenerator: true,
                //     },
                // ],                
                [
                    'babel-plugin-transform-object-rest-spread',
                    {
                        useBuiltIns: true // we polyfill Object.assign in src/normalize.js
                    },
                ],
            ],
            presets: [
                // 'babel-preset-react',
                ['babel-preset-env', {
                    modules: false,
                    targets: {
                        ie9: true,
                    },
                    uglify: true,
                }],
                'babel-preset-stage-2'
            ]
        },
    }],
});

// Styles ------------------------------------
const extractStyles = new ExtractTextPlugin({
    filename: '[name].min.css',
    allChunks: true,
    disable: __DEV__
});


// Styles ------------------------------------
config.module.rules.push({
    test: /\.less$/,
    loader: extractStyles.extract({
        fallback: 'style-loader',
        use: [
            {
                loader: 'css-loader',
                options: {
                    // sourceMap: project.sourcemaps,
                    minimize: {
                        autoprefixer: {
                            add: true,
                            remove: true,
                            browsers: ['>1%', 'Android >= 3.2', 'iOS >= 8', 'Safari >= 8']
                        },
                        discardComments: {
                            removeAll: true
                        },
                        discardUnused: false,
                        mergeIdents: false,
                        reduceIdents: false,
                        safe: true,
                        // sourcemap: project.sourcemaps
                    }
                }
            }, {
                loader: 'less-loader',
                options: {
                    // sourceMap: project.sourcemaps,
                    // includePaths: [inProjectSrc('styles')]
                }
            }
        ]
    })
});

config.plugins.push(extractStyles);

// Images ------------------------------------
config.module.rules.push({
    test: /\.(png|jpg|gif)$/,
    loader: 'url-loader',
    options: {
        limit: 8192
    }
});

    // Fonts ------------------------------------;
[
    [
        'woff', 'application/font-woff'
    ],
    [
        'woff2', 'application/font-woff2'
    ],
    [
        'otf', 'font/opentype'
    ],
    [
        'ttf', 'application/octet-stream'
    ],
    [
        'eot', 'application/vnd.ms-fontobject'
    ],
    ['svg', 'image/svg+xml']
].forEach((font) => {
    const extension = font[0];
    const mimetype = font[1];

    config.module.rules.push({
        test: new RegExp(`\\.${extension}$`),
        loader: 'url-loader',
        options: {
            name: 'fonts/[name].[ext]',
            limit: 10000,
            mimetype
        }
    });
})


module.exports = config;