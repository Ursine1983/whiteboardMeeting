function connect() {
    fetch("../config/connection.json")
        .then(function(response){
            var config = response.json(),
                socket  = io.connect(config.url + ':8080');

                return socket;
        });
}

