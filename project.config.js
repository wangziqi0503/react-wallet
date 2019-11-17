const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  name: 'wallet',
  version: '1.0.0',
  cdn: 'https://p1.ifengimg.com/wallet/v89/',
  /** The environment to use when building the project */
  env: NODE_ENV,
  /** The full path to the project's root directory */
  basePath: __dirname,
  /** The name of the directory containing the application source code */
  srcDir: 'app',
  /** The file name of the application's entry point */
  main: 'index.jsx',
  /** The name of the directory in which to emit compiled assets */
  outDir: 'dist',
  /** The base path for all projects assets (relative to the website root) */
  publicPath: '/',
  /** Whether to generate sourcemaps */
  sourcemaps: true,
  /** A hash map of keys that the compiler should treat as external to the project */
  externals: {},
  /** A hash map of variables and their values to expose globally */
  globals: {},
  /** Whether to enable verbose logging */
  verbose: false,
  /** The list of modules to bundle separately from the core application code */
  vendors: [
    'react',
    'react-dom',
    'react-router'
  ],
  thirds: [
    'classnames',
    'babel-polyfill',
    'react-slick',
    'rc-queue-anim',
    'rc-tween-one',
    'jr-qrcode',
    'js-base64'
  ]
}