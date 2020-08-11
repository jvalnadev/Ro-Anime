const p = require('phin')
const api = JSON.parse(process.env.JSON)
const cache = require('./cache')
const save = false
class Api {
  /**
   * Retorna uma array com animes novos
   *
   * @memberof Anime
   * @returns {Array} Retorna uma array com todos os novos episodios.
   */
  constructor () {
    this.categories = api.categorias
    this.cache = cache
  }

  async init () {
    await this.cache.init()
    if(save == true){
      let todos = await this.getAll()
      await this.cache.setItem('animes.todos',todos)
    }
    //let todos = await this.cache.getItem('animes.todos')
    //console.log(todos[0]);
    return this;
  }

  async getLatest () {
    const res = await p(`${api.base}${api.ultimosVideos}`)
    let final
    let final2 = []

    try {
      final = JSON.parse(res.body.toString().slice(0, -1))
    } catch (error) {
      final = error
    }
    if(final[0].response == 'No results found'){
      return null
    }else{
      final.forEach(element => {
        final2.push(new Latest(element))
      })
      return final2
    }
  }

  async getAll () {
    const res = await p(`${api.base}${api.todosOsAnimes}`)
    let final
    let final2 = []

    try {
      final = JSON.parse(res.body.toString())
    } catch (error) {
      final = error
    }
    if(final[0].response == 'No results found'){
      return null
    }else{
      final.forEach(element => {
        final2.push(new Anime(element))
      })
      return final2
    }
  }

  async getPopular () {
    const res = await p(`${api.base}${api.animesPopulares}`)
    let final
    let final2 = []
    try {
      final = JSON.parse(res.body.toString())
    } catch (error) {
      final = error
    }
    if(final[0].response == 'No results found'){
      return null
    }else{
      final.forEach(element => {
        final2.push(new Anime(element))
      })
      return final2
    }
  }
  async listCategories (categorie) {
    if(!categorie || !api.categorias.includes(categorie)){
      return api.categorias
    }else{
      const res = await p(`${api.base}${api.busca.categorias}${categorie}`)
      let final
      let final2 = []
      try {
        final = JSON.parse(res.body.toString())
      } catch (error) {
        final = error
      }
      if(final[0].response == 'No results found'){
        return null
      }else{
        final.forEach(element => {
          final2.push(new Anime(element))
        })
        return final2
      }
    }
  }

  async report (videoid) {
    if (!videoid) return { status: false, message: 'videoid não existe' }
    const res = await p(`${api.base}${api.report}${videoid}`)
    let final

    try {
      final = JSON.parse(res.body.toString())
    } catch (error) {
      final = error
    }
    if (final[0] === 'success') {
      return { status: true, message: null }
    } else {
      return { status: false, message: 'Erro ao Reportar' }
    }
  }

  async buscar (search) {
    if (!search) return { status: false, message: 'search não existe' }
    const res = await p(`${api.base}${api.busca.anime}${search}`)
    let final
    const final2 = []
    try {
      final = JSON.parse(res.body.toString())
    } catch (error) {
      final = error
    }
    if(final[0].response == 'No results found'){
      return null
    }else{
      final.forEach(element => {
        final2.push(new Anime(element))
      })
      return final2
    }
  }
  async getCapa (imageid) {
    if (!imageid) return { status: false, message: 'imageid não existe' }
    const response = await p({url: `${api.CDNUrl}${imageid}`, parse: 'none'})
    return {body: response.body,head: {'content-type': response.headers['content-type'],'content-length': response.headers['content-length']}}
    
  }
}
class Anime {
  constructor (data) {
    this.categoryid = data.category_id || data.id
    this.title = data.category_name
    if(data.category_icon){
      this.icon = `${api.CDNCF}${this.categoryid}`
      this.iconLocal = `${api.CDNLocal}${this.categoryid}`
    }
    if(data.category_desc){
      this.desc = data.category_desc
    }
    if(data.genres){
      this.genres = data.genres
    }
    if(data.ano){
      this.ano = data.ano
    }
  }

  async info () {
    if (!this.categoryid) return { status: false, message: 'categoryid não existe' }
    const res = await p(`${api.base}${api.busca.animeInfo}${this.categoryid}`)
    let final

    try {
      final = JSON.parse(res.body.toString())
    } catch (error) {
      final = error
    }
    if(final[0].response == 'No results found'){
      return null
    }else{
      return new Anime(final[0])
    }
    
  }
 
  async eps () {
    if (!this.categoryid) return { status: false, message: 'categoryid não existe' }
    const res = await p(`${api.base}${api.busca.animeEps}${this.categoryid}`)
    let final
    let final2 = []

    try {
      final = JSON.parse(res.body.toString())
    } catch (error) {
      final = error
    }
    if(final[0].response == 'No results found'){
      return null
    }else{
      let a = final.sort(function (a, b) {
        return a.title.replace('–', '-').localeCompare(b.title.replace('–', '-'), undefined, {
          numeric: true,
          sensitivity: 'base',
          ignorePunctuation: true
        })
      })
      a.forEach(element => {
        final2.push(new Ep(element))
      })
      return final2
    }
    
  }
}
class Ep {
  constructor (data) {
    this.id = data.video_id
    this.title = data.title
    this.sd = data.location
    this.hd = data.sdlocation
  }
}
class Latest {
  constructor (data) {
    this.id = data.video_id
    this.animeId = data.category_id
    this.title = data.title
    this.icon = `${api.CDNCF}${this.animeId}`
    this.iconLocal = `${api.CDNLocal}${data.animeId}`
    this.sd = data.location
    this.hd = data.sdlocation
  }
}
module.exports = { Api, Anime }