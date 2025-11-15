const path = require('path');

module.exports = {
  mode: 'development', // hoặc 'production' khi build chính thức
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      { test: /\.css$/i, use: ['style-loader', 'css-loader'] }
    ],
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    open: true,  // tự động mở trình duyệt
    hot: true,   // hot reload
  },
};