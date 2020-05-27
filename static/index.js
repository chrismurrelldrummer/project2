// Connect to websocket
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

document.addEventListener("DOMContentLoaded", () => {

    socket.on('connect', () => {

        // check if user has registered before
        if (!localStorage.getItem('user')) {

            // disable navigation until signed up
            document.querySelector('#chanLink').className = 'nav-item nav-link disabled';
            document.querySelector('#createLink').className = 'nav-item nav-link disabled';

            // set input field to update button data
            document.querySelector('#username').onkeyup = setreg;

            // set button functions
            document.querySelector('#confirm').onclick = () => {

                const user = document.querySelector('#confirm').dataset.name;

                localStorage.setItem('user', user);

                // display greeting to new user
                document.querySelector('h1').innerHTML = `Hello ${ user }!`;
                document.querySelector('#greet').hidden = false;
                document.querySelector('#valid').hidden = true;

                // disable registration fields
                document.querySelector('#username').value = user;
                document.querySelector('#username').disabled = true;
                document.querySelector('#confirm').disabled = true;

                // enable navigation
                document.querySelector('#chanLink').className = 'nav-item nav-link';
                document.querySelector('#createLink').className = 'nav-item nav-link';

            };
        } else {

            const user = localStorage.getItem('user')

            if (localStorage.getItem('room')) {

                const room = localStorage.getItem('room');

                socket.emit('lastroom', {
                    'room': room
                });
            } else {

                const room = '';

                socket.emit('lastroom', {
                    'room': room
                });
            }

            socket.on('redirect', (data) => {
                window.location = data.url;
            });
        };

    });

});

function setreg() {

    let inpt = document.querySelector('#username').value;

    const un = inpt.split(" ").join("")
    document.querySelector('#confirm').dataset.name = un;

    if (un == '') {
        const note = '<i>Note: Display names cannot be changed once submitted.</i>';
        document.querySelector('#err').innerHTML = note;
        document.querySelector('#valid').className = 'alert alert-warning';
        document.querySelector('#confirm').disabled = true;
    } else {

        document.querySelector('#confirm').disabled = false;

        // API for profanities ---------------------------------------------------------------

        // Initialize new request
        const request = new XMLHttpRequest();
        request.open('POST', '/validate');

        // Callback function for when request completes
        request.onload = () => {

            // Extract JSON data from request
            const data = JSON.parse(request.responseText);

            // Update validation message
            if (data.success) {
                const valid = 'This display name is valid';
                document.querySelector('#err').innerHTML = valid;
                document.querySelector('#valid').className = 'alert alert-success';
                document.querySelector('#confirm').disabled = false;
            } else {
                const invalid = 'Oops! That display name is not allowed.';
                document.querySelector('#err').innerHTML = invalid;
                document.querySelector('#valid').className = 'alert alert-danger';
                document.querySelector('#confirm').disabled = true;
            }
        }

        // Add data to send with request
        const data = new FormData();
        data.append('txt', un);

        // Send request
        request.send(data);
        return false;

        // end of API ------------------------------------------------------------------------------
    }

}