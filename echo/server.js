var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var positions = {},
    total = 0;
app.use(express.static('public'));

io.on('connection', function (socket) {
    socket.id = ++total;
    socket.emit('message', JSON.stringify(positions));
    socket.on('message', function (msg) {
        try {
            var pos = JSON.parse(msg);
        } catch (e) {
            return
        }
        positions[socket.id] = pos;
        console.log(pos);
        console.log(socket.id);
        socket.broadcast.emit('message', JSON.stringify({type: "position", pos: pos, id: socket.id}))
    });
    socket.on('disconnect', function () {
        delete positions[socket.id];
        socket.broadcast.emit('message', JSON.stringify({type: "disconnect", id: socket.id}))
    })
});

server.listen(3000);