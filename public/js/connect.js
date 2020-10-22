function connect() {
    import config from('../config/connection.json');
    
    var socket  = io.connect(config.url + ':8080');

    return socket;
}

