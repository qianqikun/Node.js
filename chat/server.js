var express = require('express'),
    bodyParser = require('body-parser'),
    sio = require('socket.io'),
    request = require('superagent');
var app = express();
var server = require('http').Server(app);
var io = sio(server);

app.use(bodyParser.urlencoded());
app.use(express.static('public'));
server.listen(3000);
var currentSong, dj;

function elect(socket) {
    dj = socket;
    socket.broadcast.emit('announcement', socket.name + ' is the new dj');
    socket.emit('elected');
    socket.dj = true;
    socket.on('disconnect', function () {
        dj = null;
        socket.broadcast.emit('announcement', 'the dj left -next one to join becomes dj');

    })

}

io.on('connection', function (socket) {


    socket.on('join', function (name) {
        socket.nickname = name;
        socket.broadcast.emit('announcement', name + ' joined the chat.')
        if (!dj) {
            elect(socket);
        } else {
            socket.emit('song', currentSong)
        }
    });
    socket.on('text', function (msg, fn) {
        socket.broadcast.emit('text', socket.nickname, msg);
        fn(Date.now());
    })

});