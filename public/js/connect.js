function connect() {
    var socket  = io.connect('http://192.168.100.235/whiteboard');

    return socket;
}

