document.addEventListener("DOMContentLoaded", function() {
    socket.on('joined', function(data) {
        var path = window.location.href,
            afterWith = path.substr(0, path.lastIndexOf("/") + 1);

        window.location = generateUrl(afterWith + 'chat.html', data);
    });
});