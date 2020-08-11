const express = require('express');
const app = require('./Web/index')
const port = process.env.PORT
app.listen(port, async function () {
    console.log(`Logado na porta ${port}`)
});