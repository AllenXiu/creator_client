const express = require('express');
const http = require('http');
const io = require("socket.io");
const bodyParser = require("body-parser")

// http
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.send({ msg: "hello" });
});

const server = http.createServer(app);

// socketio
const sio = io(server);

sio.on('connection', (socket) => {
    // socket.send('Hello Cocos2d-JS');

    socket.on('data', (data) => {
        console.log(data);
        try {
            data = JSON.parse(data);
            data.msg_name += "_ret";
            socket.emit('data', JSON.stringify(data));
        } catch (error) {
            console.log(error);
        }
    });
});

server.listen(8080, function listening() {
    console.log('Listening on %d', server.address().port);
});