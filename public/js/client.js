document.addEventListener("DOMContentLoaded", function() {
    // create mouse object
    var mouse = { 
       click: false,
       move: false,
       pos: {x:0, y:0},
       pos_prev: false
    },

    // get canvas element and create context
    canvas  = document.getElementById('drawing'),
    bounds = canvas.getBoundingClientRect(),
    context = canvas.getContext('2d'),
    width   = 800,
    height  = 400;

    // set canvas to full browser width/height
    canvas.width = width;
    canvas.height = height;

    // register mouse event handlers
    canvas.onmousedown = function(e){
        if(e.target.id === "drawing") {
            mouse.click = true;
        }
    };

    canvas.onmouseup = function(e){
        if(e.target.id === "drawing") {
            mouse.click = false;
        }
    };

    canvas.onmousemove = function(e) {
        if(e.target.id === "drawing") {
            // normalize mouse position to range 0.0 - 1.0 with resulution scaling
            mouse.pos.x = (e.pageX - bounds.left) / width;
            mouse.pos.y = (e.pageY - bounds.top) / height;
            mouse.move = true;
        }
    };

    /*function clearWhiteboard(bool) {
        var room = findGetParameter('name'),
            data;
        if(bool) {
            // create screenshot of the canvas
            var img = canvas.toDataURL(),
            name = prefix + document.querySelector('.whiteboardName').value + postfix,
            
            data = {
                "screenshot": {
                    "img": img,
                    "sc_name": name
                },
                "name": room
            }
        }
        else {
            data = {
                "screenshot": false,
                "name": room
            }
        }
    
        socket.emit('clear', data);
    }*/

    // draw line received from server
    socket.on('draw_line', function (data) {
        var line = data.line;
        
        context.beginPath();

        context.lineWidth = data.lineWidth;
        context.strokeStyle = data.lineColor;
        
        context.moveTo(line[0].x * width, line[0].y * height);
        context.lineTo(line[1].x * width, line[1].y * height);
        
        context.stroke();
    });

    // clear all lines
    socket.on('clear_line', function() {
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

    // display chat messages recived from server
    socket.on('new_message', function (message) {
        var chat = document.getElementById('chat');
            chatValue = chat.value,
            newLine = '';
        
        if(chatValue !== '') {
            newLine = String.fromCharCode(13, 10);
        }

        chatValue = chatValue + newLine + message.message;
        chat.value = chatValue;
    });

    // main loop, running every 25ms
    function mainLoop() {
        if (mouse.click && mouse.move && mouse.pos_prev) {
            // configure line properties
            var lineWidth = document.querySelector('.brushWidth').value,
                lineColor = document.querySelector('.brushColor').value,
                room = findGetParameter('name');

            socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ], "lineWidth": lineWidth, "lineColor": lineColor, "name": room });
            mouse.move = false;
        }

        mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};

        setTimeout(mainLoop, 25);
    }

    

    mainLoop();
    updateRoomsLoop();
    updateUserLoop();
});