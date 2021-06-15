const express = require('express');
const path = require('path');
const app = new express();

app.use(express.static(path.join(__dirname, 'web')));

app.get('/', function(request, response){
    response.sendFile(__dirname + '/index.html');
});

app.listen(8080, function () {
    console.log('Listening on port 8080...')
});