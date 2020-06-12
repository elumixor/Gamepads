const express = require('express');
const app = new express();

app.use(express.static('./src/client'))

app.get('/test', function (request, response) {
    response.send("Test works!")
})

app.listen(8080)
