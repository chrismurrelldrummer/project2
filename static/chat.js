// Connect to websocket
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

document.addEventListener("DOMContentLoaded", function () {

    const room = document.querySelector('#channelName').dataset.name;

    localStorage.setItem('room', room)

    try {
        // scroll only working on chrome
        scroll();
        // format existing posts
        indent();
    } catch (err) {
        // edge browser does has error on scroll
        // format existing posts
        indent();
    }

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

        // remember last visited chat page
        const current = localStorage.getItem('room')

        if (data['room'] == current) {
            add(data);
        }

        clearBox(data);
    });

    socket.on('delMsg', function (data) {

        document.querySelector('div.card.w-75').remove();
    });
});

function add(data) {

    if (data['user'] == localStorage.getItem('user')) {

        // Create msg template
        const template = Handlebars.compile(document.querySelector('#postMsg1').innerHTML);

        // Add msg to DOM.
        const content = template({
            'msg': data.msg,
            'user': data.user,
            'time': data.time
        });

        document.querySelector('#msgBox').innerHTML += content;

    } else {
        // Create msg template
        const template = Handlebars.compile(document.querySelector('#postMsg2').innerHTML);

        // Add msg to DOM.
        const content = template({
            'msg': data.msg,
            'user': data.user,
            'time': data.time
        });

        document.querySelector('#msgBox').innerHTML += content;
    };
};

function indent() {

    const user = localStorage.getItem('user');

    document.querySelectorAll(`#${user}`).forEach(function (div) {

        div.className = 'card w-75 ml-auto mt-2 mb-2';
    });
}

function clearBox(data) {

    if (data['user'] == localStorage.getItem('user')) {
        document.querySelector('#txtBox').value = '';
        document.querySelector('#txtBox').focus();
    }
};

function scroll() {

    let box = document.querySelector('#msgBox');
    let height = box.scrollHeight;
    box.scrollBy(0, height);
}