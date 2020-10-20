function rooms() {
    var dataArr = [];
    socket.emit('room_list', dataArr);

    if(findGetParameter('user') !== null) {
        var room = findGetParameter('name'),
            data = {
                'name': room
            };

        socket.emit('user_list', data);
    }

    socket.on('full_room_list', function(data) {
        if(typeof data === 'object') {
            var container = document.querySelector('.join');

            container.innerHTML = "";

            for (const [key, value] of Object.entries(data)) {
                var wrapper = document.createElement('div'),
                    rooms;
                
                wrapper.classList.add('channel');
                wrapper.setAttribute('name', key);
                wrapper.innerHTML = key.split('_')[1];
                container.append(wrapper);

                rooms = document.querySelectorAll('.channel');

                rooms.forEach(el => el.addEventListener('click', function(e) {
                    var room = e.target.getAttribute('name'),
                        user = findGetParameter('user') || undefined;

                    if(typeof user !== 'undefined') {
                        var data = {
                            'name': room,
                            'user': user
                        };
                        
                        socket.emit('join', data);
                    }
                    else {
                        document.querySelector('[name=roomName]').value = room;
                        document.querySelector('.joinDialog').style.display = 'block';
                    }
                }));
            };

            if(container.childElementCount === 0) {
                var noCurrentChannels = document.createElement('div');

                noCurrentChannels.classList.add('noCurrentChannels');
                noCurrentChannels.innerHTML = "There are currently no meetings registered ...";

                container.append(noCurrentChannels);
            }
        }
    });

    socket.on('full_user_list', function(data) {
        var container = document.querySelector('.userList');

        container.innerHTML = "";

        data.user.forEach(function(user) {
            var wrapper = document.createElement('div');
                
            wrapper.classList.add('userEntry');
            wrapper.setAttribute('name', user);
            wrapper.innerHTML = user
            container.append(wrapper);
        });
    });
}