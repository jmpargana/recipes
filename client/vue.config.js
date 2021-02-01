module.exports = {
  configureWebpack: {
    devServer: {
      proxy: 'http://localhost:3001'
    }
  },

  transpileDependencies: [
    'vuetify'
  ]
}
