const express = require('express');
const products = require('../../products.json')

const app = new express();

app.use(express.static('./src/client'))
app.use('/images', express.static('./images'))

app.get('/products', function (request, response) {
    response.json(products)
})

app.listen(8080)
