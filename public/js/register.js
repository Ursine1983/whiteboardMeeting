document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.registerSubmit').addEventListener('click', function(e) {
        var name = document.querySelector('.name').value,
            user = document.querySelector('.user').value;
            data = {
                'name': 'room_' + name,
                'user': user
            };

        socket.emit('setup_room', data);

        socket.on('registered', function(data) {
            socket.emit('join', data);
        });
    });
});