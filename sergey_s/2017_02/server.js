var https = require('https');
var fs = require('fs');
var static = require('node-static');
var Room = require('./room.js');
var file = new (static.Server)();

var options = {
    key: fs.readFileSync('/etc/httpd/ssl/main.key'),
    cert: fs.readFileSync('/etc/httpd/ssl/main.crt')
};

var app = https.createServer(options, function (req, res) {
    file.serve(req, res);
}).listen(2014);

var io = require('socket.io').listen(app);

var people = {};
var rooms = {};
var sockets = [];
const SM_STATUS_ONLINE = 'online';
const SM_STATUS_OFFLINE = 'offline';
const SM_STATUS_BUSY = 'busy';
const MJ_PATH = '/manager/meetingroom';
const NUM_OF_CLIENTS = 1;

Array.prototype.contains = function (k, callback) {
    var self = this;
    return (function check(i) {
        if (i >= self.length) {
            return callback(false);
        }
        if (self[i] === k) {
            return callback(true);
        }
        return process.nextTick(check.bind(null, i + 1));
    }(0));
};

Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

io.sockets.on('connection', function (socket) {

    function log() {
        var array = [">>> "];
        for (var i = 0; i < arguments.length; i++) {
            array.push(arguments[i]);
        }
        socket.emit('log', array);
    }

    socket.on('message', function (data) {
        socket.broadcast.emit('message', data);
    });

    socket.on("join", function (data) {

        var room = null;

        if (people[socket.id] == null) {

            for (prop in people) {
                if (people[prop].id == data.id && people[prop].name == data.username) {
                    delete people[prop];
                }
            }

            people[socket.id] = {
                id: data.id,
                name: data.username,
                room: room,
                role: data.role
            };

            sockets.push(socket);
        }

        if (rooms[data.roomID] != undefined && rooms[data.roomID].people != undefined) {

            var room = rooms[data.roomID];
            var numClients = room.people.length;

            if (
                numClients == NUM_OF_CLIENTS &&
                room.owner == room.people[0] &&
                room.owner == people[socket.id]
            ) {

                io.sockets.socket(room.owner).emit('created');

            } else if (
                numClients == NUM_OF_CLIENTS &&
                (room.status == SM_STATUS_ONLINE || room.status == SM_STATUS_BUSY) &&
                people[socket.id].role == 'VISITOR'
            ) {

                io.sockets.socket(socket.id).emit('joinEmit', data.roomID);
                io.sockets.socket(room.owner).emit('joined');
                io.sockets.emit('change sm status', {
                    status: SM_STATUS_BUSY,
                    roomId: data.roomID
                });
            }

        } else {

            if (people[socket.id].room === null && people[socket.id].role == 'MANAGER') {

                rooms[data.roomID] = new Room(data.roomID, data.roomID, socket.id);

                socket.name = socket.room = data.roomID;
                socket.join(socket.room);

                rooms[data.roomID].addPerson(socket.id);
                rooms[data.roomID].setManager(data.user);

                people[socket.id].room = data.roomID;

                io.sockets.emit('change sm status', {
                    status: SM_STATUS_ONLINE,
                    roomId: data.roomID
                });
                io.sockets.socket(socket.id).emit('created');
            }
        }
    });

    socket.on('joinRoom', function (data) {

        var room = rooms[data.roomId];

        room.people.contains(socket.id, function (found) {

            if (!found && people[socket.id].inroom == null) {

                people[socket.id].inroom = data.roomId;

                socket.name = socket.room = room.id;
                socket.join(socket.room);

                room.status = 'busy';
                room.addPerson(socket.id);
                room.setVisitor(data.user);

                io.sockets.in(room.id).emit('channel ready', room);
                io.sockets.emit('change sm status', {
                    status: room.status,
                    roomId: data.roomId
                });
            }
        });
    });

    socket.on("leaveRoomOwner", function (id) {

        var room = rooms[id];

        if (room != null && room != undefined) {

            if (room.owner != 'undefined' && room.owner != null && socket.id === room.owner) {

                var i = 0;

                while (i < sockets.length) {

                    if (sockets[i].id == room.people[i]) {
                        people[sockets[i].id].inroom = null;
                        sockets[i].leave(room.name);
                    }

                    ++i;
                }

                delete rooms[id];
                people[room.owner].owns = null;

            } else {

                room.people.contains(socket.id, function (found) {

                    if (found) {
                        var personIndex = room.people.indexOf(socket.id);
                        room.people.splice(personIndex, 1);
                        socket.leave(room.name);
                    }

                });
            }
        }
        io.sockets.emit('change sm status', {status: SM_STATUS_OFFLINE, roomId: id});
    });

    socket.on("delete inroom visitors", function (data) {

        if (people[socket.id]) {

            var room = rooms[data.room];
            var i = 0;

            while (i < sockets.length) {

                if ((room != null && room != undefined) && room.people.length) {

                    for (var j = 0; j < room.people.length; j++) {

                        if (room.people[j] == sockets[i].id && sockets[i].id != room.owner) {

                            if (data.redirect) {
                                io.sockets.emit('change sm status', {status: SM_STATUS_BUSY, roomId: data.room});
                                io.sockets.socket(sockets[i].id).emit('close mj connection');
                            }

                            people[sockets[i].id].inroom = null;
                            room.people.remove(sockets[i].id);
                            sockets[i].leave(room.name);
                            delete people[sockets[i]];
                            delete sockets[sockets[i]];
                        } else {
                            if (people[room.owner] != undefined) {
                                people[room.owner].room = null;
                            }
                        }
                    }
                    delete room.visitor;
                }
                ++i;
            }
        }

        if (data.delete && rooms[data.room] != null) {
            delete rooms[data.room];
        } else {
            io.sockets.emit('change sm status', {status: SM_STATUS_BUSY, roomId: data.room});
        }
    });

    socket.on('change tmp sm status', function (data) {

        var room = rooms[data.roomId];

        if (room != null) {
            room.status = data.status;
            io.sockets.emit('change sm status', data);
        } else {
            io.sockets.emit('change sm status', data)
        }
    });

    socket.on('proccess manager data', function (data) {
        socket.broadcast.to(data.room).emit('get manager data', data);
    });

    socket.on('typing', function (data) {
        socket.broadcast.to(data.room).emit('typing', data.username);
    });

    socket.on('stop typing', function (data) {
        socket.broadcast.to(data.room).emit('stop typing');
    });

    socket.on('conference', function (room) {
        socket.broadcast.to(room).emit('start conference');
    });

    socket.on('stop conference', function (data) {
        io.sockets.in(data.room).emit('stop conference');
    });

    socket.on('visitor video call', function (data) {
        socket.broadcast.to(data.room).emit('accept visitor video call');
    });

    socket.on('reconnect data channel conference', function (room) {
        socket.broadcast.to(room).emit('start reconnect data channel conference');
    });

    socket.on('show', function (data) {
        io.sockets.in(data.room).emit('show', {item: data.item, user: data.user});
    });

    socket.on('invite user', function (data) {
        socket.broadcast.emit('suggest user', data);
    });

    socket.on('forced closing connection', function (room) {
        io.sockets.in(room).emit('forced closing connection');
    });

    socket.on('visitor reject offer', function (room) {
        io.sockets.in(room).emit('visitor reject offer', room);
    });

    socket.on('notification', function (data) {
        io.sockets.in(data.room).emit('notification', data.text);
    });

    socket.on('close notification popup', function (visitorId) {
        socket.broadcast.emit('close notification popup force', visitorId);
    });

    socket.on('continue conference', function (data) {
        io.sockets.in(data.room).emit('continue conference');
    });

});

var mjnsp = io.of(MJ_PATH);
mjnsp.on('connection', function (socketManager) {

    function managerLog() {
        var array = [">>> "];
        for (var i = 0; i < arguments.length; i++) {
            array.push(arguments[i]);
        }
        socketManager.emit('log', array);
    }

    socketManager.on('visitors in queue', function (standId) {
        mjnsp.emit('visitor wait', standId);
    });

    socketManager.on('add visitor in queue', function (standId) {
        mjnsp.emit('visitor announce', standId);
    });

    socketManager.on('changing managers on stand amount', function(standId){
        mjnsp.emit('changing managers on stand amount', standId);
    });
});
