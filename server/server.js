const express = require('express');
const app = new express();

app.get('/', function(request, response){
    response.sendFile('client/main.html', {'root': './'});
});

app.listen(8080)
