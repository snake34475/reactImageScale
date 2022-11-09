/*
 * Author  rhys.zhao
 * Date  2022-01-28 15:23:47
 * LastEditors  rhys.zhao
 * LastEditTime  2022-06-07 10:28:00
 * Description
 */
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      },
      {
        // test: /\.scss|sass$/,
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { modules: true, sourceMap: true },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ]
      }
    ]
  }
};
