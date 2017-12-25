import path from 'path'
// production
export default {
  target: 'electron-main',

  entry: './src/main/main',

  output: {
    path: __dirname,
    filename: './main.js'
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }]
  },
  
  resolve: {
    extensions: ['.js', '.json'],
    modules: [
        path.join(__dirname, 'src'),
        'node_modules',
    ],
  },
  node: {
    __dirname: false,
    __filename: false
  },
}