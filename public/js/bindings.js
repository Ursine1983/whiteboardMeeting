document.addEventListener("DOMContentLoaded", function() {
    var saveWhiteboard = document.querySelector('.saveWhiteboard'),
        discardWhiteboard = document.querySelector('.discardWhiteboard'),
        clear = document.getElementById('clearCanvasDialog'),
        closeDialog = document.querySelector('.close'),
        user = findGetParameter('user'),
        prefix = findGetParameter('name').split('_')[1] + '_',
        postfix = "";

    saveWhiteboard.addEventListener('click', function(e) {
        clearWhiteboard(true);
        closeDialogFunc();
    });

    discardWhiteboard.addEventListener('click', function(e) {
        clearWhiteboard(false);
        closeDialogFunc();
    });

    clear.addEventListener('click', function(e) {
        // generate postfix with timestamp
        var timeStamp = Date.now();

        postfix = '_' + timeStamp.toString() + '.jpg';

        // set pre and postfix
        document.querySelector('.prefix').innerHTML = prefix;
        document.querySelector('.postfix').innerHTML = postfix;

        // display the dialog
        document.querySelector('.clearDialog').style.display = "block";

    });

    closeDialog.addEventListener('click', function(e) {
        e.preventDefault();
        closeDialogFunc();
    });

    document.addEventListener('keydown', function(e) {
        if(e.key == 'Enter') {
            var input = document.getElementById('message'),
                time = getFormattedDate();
                message = user + ' [' + time + ']: ' + input.value,
                room = findGetParameter('name'),
                data = {
                    'name': room,
                    'message': message
                };

            input.value = "";

            socket.emit('message', data);
        }
    });

    window.addEventListener('beforeunload', function(e) {
        var data = {
            'name': false
        }
        socket.emit('join', data);
    });
});