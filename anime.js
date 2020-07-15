const p = require('phin')
const api = {
  // Adicione a base em cada endpoint
  base: 'https://animeland.appanimeplus.tk/videoweb/api.php?action=',
  // CDN para as imagens
  CDNUrl: 'https://cdn.appanimeplus.tk/img/',
  categorias: ['Aventura', 'Ação', 'Comédia', 'Dublado', 'Ecchi', 'Escolar', 'Esporte', 'Fantasia', 'Filme', 'Harem', 'Josei', 'Magia', 'Mecha', 'Mistério', 'OVA', 'Poderes', 'Psicológico', 'Romance', 'Sci-Fi', 'Seinen', 'Shoujo', 'Shounen', 'Slice of Life', 'Sobrenatural', 'Suspense', 'Terror', 'Yaoi', 'Yuri'],

  ultimosVideos: 'latestvideos',
  todosOsAnimes: 'all_categories',
  animesPopulares: 'trendingcategory',
  // Agora os mais complexos
  busca: {
    // Nesse concatene algo para buscar
    anime: 'searchcategory&searchword=',
    animeAlt: 'searchvideo&searchword=',
    // Use uma categorias listada na array categorias
    categorias: 'searchgenre&searchword=',

    animeInfo: 'viewcategory&categoryid=',
    animeEps: 'category_videos&category_id='
  },
  // Reporte o anime usando o videoid, retorna Array[0] == sucesso
  report: 'reportvideo&videoid=',

  // Dados pra teste
  debug: {
    categoryid: 33018,
    videoid: 432815,
    searchword: 'Tensei shitara',
    image: 'ebf51cc89fabd1246021aa123704d1bd.jpg'
  }
}
class Api {
  /**
   * Retorna uma array com animes novos
   *
   * @memberof Anime
   * @returns {Array} Retorna uma array com todos os novos episodios.
   */
  constructor () {
    this.categories = api.categorias
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

    try {
      final = JSON.parse(res.body.toString())
    } catch (error) {
      final = error
    }
    return final
  }

  async getPopular () {
    const res = await p(`${api.base}${api.animesPopulares}`)
    let final

    try {
      final = JSON.parse(res.body.toString())
    } catch (error) {
      final = error
    }
    return final
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
}
class Anime {
  constructor (data) {
    this.categoryid = data.category_id
    this.title = data.category_name
    if(data.category_icon){
      this.icon = `${api.CDNUrl}${data.category_icon}`
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
    this.title = data.title
    this.icon = `${api.CDNUrl}${data.image}`
    this.sd = data.location
    this.hd = data.sdlocation
  }
}
module.exports = { Api, Anime }

/*
.buscar('tensei shitara').then(animes => {
  let anime = animes[0]
  anime.info().then(info => {
    functions.embed(`Nome: ${info.category_name}\nGeneros: ${info.genres}\nAno: ${info.ano}\nDescrição: ${info.category_desc}`,'sucesso',call)
  })
})
*/