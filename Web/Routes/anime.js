const express = require('express')
let router = express.Router()
const {Api, Anime} = require('../../anime')
new Api().init().then(api=>{
  router.get('/', async function (req, res, next) {
    if(req.query.buscar){
      const animes = await api.buscar(req.query.buscar)
      if(animes != null){
        res.render('pages/buscar.ejs',{animes: animes, buscado: req.query.buscar})
      }else{
        res.render('pages/index.ejs',{erro: 'Nenhum anime encontrado'})
      }
    }
    else{
      res.render('pages/index.ejs',{erro: false})
    }
  })
  router.get('/novos', async function (req, res, next) {
    let latest = await api.getLatest()
    res.render('pages/novos.ejs',{latest})
  })
  router.get('/populares', async function (req, res, next) {
    let data = await api.getPopular()
    res.render('pages/categoria_buscar.ejs',{categoria: 'Populares', data})
  })
  router.get('/anime/:id', async function (req, res, next) {
    if(req.params.id){
      let anime = new Anime({category_id: req.params.id})
      let info = await anime.info()
      if(info != null){
        let eps = await anime.eps()
        res.render('pages/eps.ejs',{info,eps})
      }else{
        res.render('pages/index.ejs',{erro: 'Anime invalido'})
      }
    }else{
      res.render('pages/index.ejs',{erro: 'Anime Invalido'})
    }
  })
  router.get('/capa/:id', async function (req, res, next) {
    if(req.params.id){
      let {body,head} = await api.getCapa(req.params.id)
      res.writeHead(200, head);
      res.end(body); 
    }
  })
  router.get('/categorias', async function (req, res, next) {
    if(!req.query.c){
      let categorias = await api.listCategories()
      res.render('pages/categorias.ejs',{categorias})
    }else{
      let data = await api.listCategories(req.query.c)
      if(typeof data[0] == 'string'){
        res.redirect('/categorias')
      }else{
        res.render('pages/categoria_buscar.ejs',{categoria: req.query.c, data})
      }
    }
  })

  router.get('/aviso',(req,res)=>{
    res.render('pages/aviso.ejs')
  })
})
module.exports = router