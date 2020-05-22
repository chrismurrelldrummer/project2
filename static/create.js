// // Connect to websocket
// var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

// document.addEventListener("DOMContentLoaded", function () {

//     socket.on('connect', function () {

//         // set form functions to emit an update
//         document.querySelector('#create').onclick = function () {

//             const channel = document.querySelector('#newChannel').value;
//             const cs = document.querySelector('#newCS').value;
//             const descrip = document.querySelector('#newChDes').value;
//             const user = localStorage.getItem('user');
            
//             socket.emit('newChannel', {
//                 'name': channel,
//                 'cs': cs,
//                 'descrip': descrip,
//                 'user': user
//             });
//         };

//     });

// });

function user() {
    let user = localStorage.getItem('user');

    return user
}