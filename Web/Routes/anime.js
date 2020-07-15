const express = require('express')
const axios = require('axios')
let router = express.Router()
const {Api, Anime} = require('../../anime')
const auth = require('../Middleware/auth');
const api = new Api()
/*
api.buscar('tensei shitara').then(async animes => {
  let anime = animes[0]
  console.log(animes)
  await anime.info().then(info => {
    console.log(info)
  })
  await anime.eps().then(eps=>{
      console.log(eps.reverse()[0])
  })
})
*/
router.get('/', async function (req, res, next) {
  if(req.query.buscar){
    api.buscar(req.query.buscar).then(async animes => {
      if(animes != null){
        res.render('pages/buscar.ejs',{animes: animes, buscado: req.query.buscar})
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
      res.json({status: false, message: 'Anime invalido'})
    }
  }
  else{
    res.render('pages/index.ejs',{erro: false, })
    //res.json({status: false, message: 'Query.buscar invalido'})
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
