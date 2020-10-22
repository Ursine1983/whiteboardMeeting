function connect() {
    var socket  = io.connect('http://192.168.100.235:8080');

    return socket;
}

