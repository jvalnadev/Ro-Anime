const express = require('express');
const app = require('./Web/index')
const port = process.env.PORT
app.listen(port, async function () {
    console.log(`Logado na porta ${port}`)
});
/*
const cache = require('./cache')
;(async ()=>{
    await cache.init();
    //await cache.setItem('name',{test: 2, a: 'c'})
    let value = await cache.getItem('name')
    console.log(value.test);
})()
*/