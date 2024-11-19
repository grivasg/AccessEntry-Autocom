const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  mode: 'development',
  entry: {
    'js/app' : './src/js/app.js',
    'js/inicio' : './src/js/inicio.js',
    'js/solicitud/index' : './src/js/solicitud/index.js',
    'js/estado/index' : './src/js/estado/index.js',
    'js/nuevas/index' : './src/js/nuevas/index.js',
    'js/finalizadas/index' : './src/js/finalizadas/index.js',
    'js/usuario/index' : './src/js/usuario/index.js',
    'js/permiso/index' : './src/js/permiso/index.js',
    'js/pendientes/index' : './src/js/pendientes/index.js',
    'js/cambio/index' : './src/js/cambio/index.js',
    'js/ftp/index' : './src/js/ftp/index.js',

  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public/build')
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: 'styles.css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(c|sc|sa)ss$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader
            },
            'css-loader',
            'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        type: 'asset/resource',
      },
    ]
  }
};