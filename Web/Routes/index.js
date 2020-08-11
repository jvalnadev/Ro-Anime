
module.exports = function (app) {
  // Rotas
  app.use(require('./anime'))

  // Captura erros é redireciona para o começo

  app.use(function (err, req, res, next) {
    if (err) {
      console.log(err)
    }
    res.json({ error: 'Erro interno no servidor, você não deveria estar aqui, chame o fp.' })
  })
}
