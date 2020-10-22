var express = require('express'), 
    app = express(),
    http = require('http'),
    socketIo = require('socket.io'),
    fs = require('fs'),

// array of registered rooms and its data
    room_history = {},

// start webserver on port 8080
    server = http.createServer(app),
    io = socketIo.listen(server);

server.listen(8080);

// add directory with our static files
app.use(express.static(__dirname + '/public'));
console.log("Server running on port 8080");

// event-handler for new incoming connections
io.on('connection', function (socket) {
    console.log("Incomming connection handler set up");

    // add handler for message type "draw_line".
    socket.on('draw_line', function (data) {
        room_history[data.name]['line_history']
            .push(
                { 
                    line: data.line, 
                    "lineWidth": data.lineWidth, 
                    "lineColor": data.lineColor 
                }
            );
                
        io.in(data.name).emit('draw_line', { line: data.line, "lineWidth": data.lineWidth, "lineColor": data.lineColor });
    });

    // add handler for clear canvas
    socket.on('clear', function(data) {
        if (typeof data["screenshot"] !== 'undefined' && data["screenshot"] !== null && data["screenshot"] !== false){
            var img = Buffer.from(data["screenshot"].img.replace(/^data:image\/png;base64,/, ""), 'base64');
            
            fs.writeFile('archive/img/' + data["screenshot"]['sc_name'], img, 'base64', function(err) {
                if (err) return console.log('err: ' + err);
                console.log(data["screenshot"]['sc_name'] + ' saved ...');
            });
        }

        room_history[data.name]['line_history'] = [];
        io.in(data.name).emit('clear_line', false);
    });

    socket.on('message', function(data) {
        room_history[data.name]['chat_history'].push(data['message']);
        io.in(data.name).emit('new_message', {"message": data['message']});
    });

    socket.on('setup_room', function(data) {
        if(!room_history.hasOwnProperty(data.name)) {
            room_history[data.name] = {
                'user': [],
                'chat_history': [],
                'line_history': []
            };
        }
        
        socket.join(data.name);
        io.in(data.name).emit('registered', data);
    });

    socket.on('join', function(data) {
        for (const [key, value] of Object.entries(room_history)) {
            if(key !== data.name) {
                socket.leave(key);

                for(var user in value['user']) {
                    if(room_history[key]['user'][user] === data.user) {
                        room_history[key]['user'].splice(user, 1);

                        if(room_history[key]['user'].length === 0) {
                            delete room_history[key];
                        }
                    }
                }
            } 
        }
        
        if(room_history.hasOwnProperty(data.name) && !room_history[data.name]['user'].includes(data.user)) {
            room_history[data.name]['user'].push(data.user);
        }
        
        if(data.name === false) {
            if(room_history.hasOwnProperty(data.room)) {
                room_history[data.room]['user'].splice(data.user, 1);
            }
            
            if(room_history[data.room]['user'].length === 0) {
                delete room_history[data.room]
            }
        }
        else {
            socket.join(data.name);
            io.in(socket.id).emit('joined', data);
        }
    });

    socket.on('join_room', function(data) {
        socket.join(data.name);

        for (const [key, value] of Object.entries(room_history)) {
            if(key !== data.name) {
                socket.leave(key);

                for(var user in value['user']) {
                    if(room_history[key]['user'][user] === data.user) {
                        room_history[key]['user'].splice(user, 1);

                        if(room_history[key]['user'].length === 0) {
                            delete room_history[key];
                        }
                    }
                }
            } 
        }
        
        if(room_history.hasOwnProperty(data.name) && !room_history[data.name]['user'].includes(data.user)) {
            room_history[data.name]['user'].push(data.user);
        }

        // send the history to the new client
        for (const [key, value] of Object.entries(room_history)) {
            var room = key,
                line_history = value['line_history'];
    
            for (var i in line_history) {
                io.in(socket.id).emit('draw_line', line_history[i] );
            }
        }
        
        for (const [key, value] of Object.entries(room_history)) {
            var room = key,
                chat_history = value['chat_history'];
    
            for (var i in chat_history) {
                io.in(socket.id).emit('new_message', { "message": chat_history[i] } );
            }
        }
    });

    socket.on('room_list', function(data) {
        socket.emit('full_room_list', room_history);
    });

    socket.on('user_list', function(data) {
        socket.emit('full_user_list', room_history[data.name]);
    });
});