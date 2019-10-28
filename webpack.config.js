const webpack = require('webpack');

module.exports = {
entry: './src/index.js',
module: {
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: ['babel-loader']
    }
  ]
},
resolve: {
  alias: {
    "react": "preact/compat",
    "react-dom/test-utils": "preact/test-utils",
    "react-dom": "preact/compat",
  },
  extensions: ['*', '.js', '.jsx']
},
output: {
  path: __dirname + '/dist',
  publicPath: '/',
  filename: 'bundle.js'
},
plugins: [
  new webpack.HotModuleReplacementPlugin()
],
devServer: {
  contentBase: './dist',
  hot: true
}
};
