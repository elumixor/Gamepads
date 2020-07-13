process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const express = require('express');
const fs = require('fs')
const sendMail = require('./mailSender').sendMail
const productsPath = './products.json'
const boundsPath = './bounds/bounds.json'


let products
let bounds
let lastChangeProducts
let lastChangeBounds

function updateProducts() {
    products = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
    lastChangeProducts = fs.statSync(productsPath).mtime;
}

function updateBounds() {
    bounds = JSON.parse(fs.readFileSync(boundsPath, 'utf8'))
    lastChangeBounds = fs.statSync(boundsPath).mtime;
}

updateProducts()
updateBounds()

const PORT = process.env.PORT || 5000

const app = new express();

app.use(express.static('./src/client'))
app.use('/images', express.static('./images'))
app.use('/bounds', express.static('./bounds'))
app.use(express.json());

app.get('/products', function (request, response) {
    const ch = fs.statSync(productsPath).mtime;
    if (ch > lastChangeProducts) updateProducts()

    response.json(products)
})


app.get('/bounds', function (request, response) {
    const ch = fs.statSync(boundsPath).mtime;
    if (ch > lastChangeBounds) updateBounds()

    response.json(bounds)
})


app.post('/order', function (request, response) {
    sendMail(request.body)
});

app.listen(PORT)
