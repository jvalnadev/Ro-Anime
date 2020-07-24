var express = require('express')
var ejs = require('ejs')
var path = require('path')
var app = express()

// Express Sets/Uses
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './Views'))
app.use('/', express.static(path.join(__dirname, './Static')))
app.set('env', 'production')
app.disable('Transfer-Encoding')
app.disable('X-Powered-By')

// Adquire rotas
require('./Routes')(app)

module.exports = app
