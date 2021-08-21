const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = new express();
/*
const options = {
    key: fs.readFileSync('./ssl/privatekey.pem'),
    cert: fs.readFileSync('./ssl/certificate.pem'),
};

const server = https.createServer(options, app).listen(port, function(){
  console.log("Express server listening on port " + port);
});
*/
app.use(express.static(path.join(__dirname, 'web')));

app.get('/', function(request, response){
    response.sendFile(__dirname + '/index.html');
});

app.listen(8080, function () {
    console.log('Listening on port 8080...')
});