document.addEventListener("DOMContentLoaded", function() {
    socket.on('joined', function(data) {
        window.location = generateUrl('file:///C:/xampp/htdocs/digiWhiteboard/public/chat.html', data);
    });
});