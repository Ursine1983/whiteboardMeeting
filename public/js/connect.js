function connect() {
    var config = require('../config/connection.json'),
        socket  = io.connect(config.url + ':8080');

    return socket;
}

