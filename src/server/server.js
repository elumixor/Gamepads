const express = require('express');
const fs = require('fs')

const productsPath = './products.json'

let products
let lastChange

function updateProducts() {
    products = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
    lastChange = fs.statSync(productsPath).mtime;
}

updateProducts()

const PORT = process.env.PORT || 5000

const app = new express();

app.use(express.static('./src/client'))
app.use('/images', express.static('./images'))
app.use('/bounds', express.static('./bounds'))
app.use(express.json());

app.get('/products', function (request, response) {
    const ch = fs.statSync(productsPath).mtime;
    if (ch > lastChange) updateProducts()

    response.json(products)
})


app.post('/order', function (request, response) {
    console.log(request.body);      // your JSON
    response.send(request.body);    // echo the result back
});

app.listen(PORT)
