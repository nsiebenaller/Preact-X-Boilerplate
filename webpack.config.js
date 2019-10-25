const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              importLoaders: 1,
              modules: true //Allows use of CSS modules
            }
          },
        ]
      },
      {
        test: /\.less$/,
        exclude: [ path.resolve(__dirname, "src/style") ],
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              importLoaders: 1,
              modules: true //Allows use of CSS modules
            }
          },
          {
            loader: 'less-loader', // compiles Less to CSS
          },
        ]
      },
      {
        test: /\.less$/,
        exclude: [
          path.resolve(__dirname, "src/@Routes"),
          path.resolve(__dirname, "src/@Shared"),
          path.resolve(__dirname, "src/App")
        ],
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "less-loader"
          }
        ]
      },
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
      "@Api": path.resolve(__dirname, "src/@Api"),
      "@Helpers": path.resolve(__dirname, "src/@Helpers"),
      "@Icons": path.resolve(__dirname, "src/@Icons"),
      "@MockData": path.resolve(__dirname, "src/@MockData"),
      "@Routes": path.resolve(__dirname, "src/@Routes"),
      "@Shared": path.resolve(__dirname, "src/@Shared"),
      "@Static": path.resolve(__dirname, "src/@Static")
    },
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new Dotenv(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
    port: 1111
  }
};
