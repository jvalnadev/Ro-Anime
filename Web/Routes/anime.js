const express = require('express')
const axios = require('axios')
let router = express.Router()
const {Api, Anime} = require('../../anime')
const api = new Api()

router.get('/', async function (req, res, next) {
  if(req.query.buscar){
    api.buscar(req.query.buscar).then(async animes => {
      if(animes != null){
        res.render('pages/buscar.ejs',{animes: animes, buscado: req.query.buscar})
      }else{
        res.render('pages/index.ejs',{erro: 'Nenhum anime encontrado'})
      }
    });
  }
  else if(req.query.anime){
    let anime = new Anime({category_id: req.query.anime})
    let info = await anime.info()
    if(info != null){
      let eps = await anime.eps()
      res.render('pages/eps.ejs',{info,eps})
    }else{
      res.render('pages/index.ejs',{erro: 'Anime invalido'})
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
router.get('/capa/:id', async function (req, res, next) {
  if(req.params.id){
    //
    const response = await axios.get('https://cdn.appanimeplus.tk/img/'+req.params.id,  { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data, "utf-8")
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': buffer.length
    });
    res.end(buffer); 
  }
})

module.exports = router
