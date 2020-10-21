function closeJoinDialogFunc() {
    document.querySelector('.joinDialog').style.display = "none";
}

function closeDialogFunc() {
    document.querySelector('.whiteboardName').value = "";
    document.querySelector('.clearDialog').style.display = "none";
}

function getFormattedDate() {
    var date = new Date();
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    return str;
}

function clearWhiteboard(bool) {
    var room = findGetParameter('name'),
        data;
    if(bool) {
        // create screenshot of the canvas
        var canvas  = document.getElementById('drawing'),
            img = canvas.toDataURL(),
            prefix = document.querySelector('.prefix').innerHTML,
            postfix = document.querySelector('.postfix').innerHTML,
            name = prefix + document.querySelector('.whiteboardName').value + postfix;

        data = {
            "screenshot": {
                "img": img,
                "sc_name": name
            },
            "name": room
        };
    }
    else {
        data = {
            "screenshot": false,
            "name": room
        };
    }

    socket.emit('clear', data);
}

function generateUrl(url, params) {
    var i = 0, key;
    for (key in params) {
        if (i === 0) {
            url += "?";
        } else {
            url += "&";
        }
        url += key;
        url += '=';
        url += params[key];
        i++;
    }
    return url;
}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [],
        items = location.search.substr(1).split("&");

    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    
    return result;
}

function updateRoomsLoop() {
    var dataArr = [];

    socket.emit('room_list', dataArr);

    setTimeout(updateRoomsLoop, 3000);
}

function updateUserLoop() {
    var room = findGetParameter('name'),
    data = {
        'name': room
    };

    socket.emit('user_list', data);

    setTimeout(updateUserLoop, 3000);
}