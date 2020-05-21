// Connect to websocket
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

document.addEventListener("DOMContentLoaded", function () {

    // set button function
    document.querySelector('#send').onclick = function () {

        const msg = document.querySelector('#txtBox').value;
        const user = localStorage.getItem('user');

        socket.emit('sendMsg', {

            'msg': msg,
            'user': user
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
        'user': data.user
    });

    document.querySelector('#msgBox').innerHTML += content;
};

function clearBox() {

    document.querySelector('#txtBox').value = '';
};