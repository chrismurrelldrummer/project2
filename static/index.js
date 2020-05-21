// Connect to websocket
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

document.addEventListener("DOMContentLoaded", function () {

    socket.on('connect', function () {

        // check if user has registered before
        if (!localStorage.getItem('user')) {

            // set input field to update button data
            document.querySelector('#username').onkeyup = setreg;

            // set button functions
            document.querySelector('#confirm').onclick = function () {

                const user = document.querySelector('#confirm').dataset.name;

                localStorage.setItem('user', user);

                // display greeting to new user
                document.querySelector('h1').innerHTML = `Hello ${ user }`;

                // disable registration fields
                document.querySelector('#username').disabled = true;
                document.querySelector('#confirm').disabled = true;

                socket.emit('status', {
                    'status': 'online',
                    'user': user
                });
            };
        } else {

            // display greeting to existing user
            var user = localStorage.getItem('user')
            document.querySelector('h1').innerHTML = `Welcome back ${ user }`;

            // disable registration fields
            document.querySelector('#username').disabled = true;
            document.querySelector('#confirm').disabled = true;

            socket.emit('status', {
                'status': 'online',
                'user': user
            });
        }


    });

});

// socket.on('online', function (data) {

//     let list = document.querySelector("#offline");
//     list.removeChild(list.childNodes[data]);

//     // if (!localStorage.getItem('user') == Object.keys(data)) {
//     const li = document.createElement('li');
//     li.innerHTML = `${Object.keys(data)}`;
//     document.querySelector('#users').append(li);
//     // }
// });

// socket.on('offline', function (data) {

//     let list = document.querySelector("#users");
//     list.removeChild(list.childNodes[data]);

//     const li = document.createElement('li');
//     li.innerHTML = `${Object.keys(data)}`;
//     document.querySelector('#offline').append(li);
// });

function setreg() {

    let un = document.querySelector('#username').value;
    document.querySelector('#confirm').dataset.name = un;

}