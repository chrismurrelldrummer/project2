// Connect to websocket
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

document.addEventListener("DOMContentLoaded", () => {

    socket.on('connect', () => {

        const user = localStorage.getItem('user');

        document.querySelector('#newChannel').onkeyup = () => {

            const name = document.querySelector('#newChannel').value;

            if (name != '' && allowed(name) == true) {

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
                        const valid = 'This channel name is valid.';
                        document.querySelector('#err').innerHTML = valid;
                        document.querySelector('#valid').className = 'alert alert-success';
                        document.querySelector('#create').disabled = false;
                    } else {
                        const invalid = 'Oops! That channel name is not allowed.';
                        document.querySelector('#err').innerHTML = invalid;
                        document.querySelector('#valid').className = 'alert alert-danger';
                        document.querySelector('#create').disabled = true;
                    }
                }

                // Add data to send with request
                const data = new FormData();
                data.append('txt', name);

                // Send request
                request.send(data);
                return false;

                // end of API ------------------------------------------------------------------------------
            } else {
                const invalid = 'Oops! That channel name is not allowed.';
                document.querySelector('#err').innerHTML = invalid;
                document.querySelector('#valid').className = 'alert alert-danger';
                document.querySelector('#create').disabled = true;
            }

        }

        document.querySelector('#create').onclick = () => {

            let store = [];
            let local = JSON.parse(localStorage.getItem('channels'));

            if (local == null) {
                store.push(document.querySelector('#newChannel').value);
                localStorage.setItem('channels', JSON.stringify(store));
            } else {
                local.push(document.querySelector('#newChannel').value);
                localStorage.setItem('channels', JSON.stringify(local));
            }

            socket.emit('join', {

                'channel': document.querySelector('#newChannel').value,
                'user': user,
                'status': 'admin'
            });
        };

        document.querySelector('#newCSb').onchange = () => {
            document.querySelector('#preview').style.background = document.querySelector('#newCSb').value;
        };
        document.querySelector('#newCSt').onchange = () => {
            document.querySelector('#preview').style.color = document.querySelector('#newCSt').value;
            document.querySelector('.muted').style.color = document.querySelector('#newCSt').value;
        };

    });

});

function allowed(txt) {
    let allow = /^[a-z0-9\s'#]+$/i;
    return allow.test(txt);
}