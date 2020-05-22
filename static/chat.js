// Connect to websocket
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

document.addEventListener("DOMContentLoaded", function () {

    const room = document.querySelector('#channelName').dataset.name;

    localStorage.setItem('room', room)

    // set button function
    document.querySelector('#send').onclick = function () {

        const msg = document.querySelector('#txtBox').value;
        const user = localStorage.getItem('user');
        const time = new Date().toLocaleString();

        socket.emit('sendMsg', {

            'room': room,
            'msg': msg,
            'user': user,
            'time': time
        });
    };

    socket.on('sendMsg', function (data) {

        add(data);
        clearBox();
    });
});

function add(data) {

    // Create msg template
    const template = Handlebars.compile(document.querySelector('#postMsg').innerHTML);

    // Add msg to DOM.
    const content = template({
        'msg': data.msg,
        'user': data.user,
        'time': data.time
    });

    document.querySelector('#msgBox').innerHTML += content;
};

function clearBox() {

    document.querySelector('#txtBox').value = '';
};