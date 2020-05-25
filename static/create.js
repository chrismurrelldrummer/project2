// // set form functions to emit an update
// document.querySelector('#create').onclick = function () {

//     const channel = document.querySelector('#newChannel').value;
//     const cs = document.querySelector('#newCS').value;
//     const descrip = document.querySelector('#newChDes').value;
//     const user = localStorage.getItem('user');

//     socket.emit('newChannel', {
//         'name': channel,
//         'cs': cs,
//         'descrip': descrip,
//         'user': user
//     });


// Connect to websocket
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

document.addEventListener("DOMContentLoaded", () => {

    socket.on('connect', () => {

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
    });

});

function allowed(txt) {
    let allow = /^[a-z0-9\s'#]+$/i;
    return allow.test(txt);
}

function user() {
    let user = localStorage.getItem('user');

    return user
}