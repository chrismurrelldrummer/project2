document.addEventListener("DOMContentLoaded", function () {
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', function () {
        console.log('I\'m online.');

        // check if user has registered before
        if (!localStorage.getItem('user')) {

            console.log('1st time visiting this site.');

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

    socket.on('online', function (data) {
        const li = document.createElement('li');
        li.innerHTML = `${Object.keys(data)}`;
        document.querySelector('#users').append(li);
    });

});

function setreg() {

    let un = document.querySelector('#username').value;
    document.querySelector('#confirm').dataset.name = un;

}