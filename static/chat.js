// Connect to websocket
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

document.addEventListener("DOMContentLoaded", () => {

    const room = document.querySelector('#channelName').dataset.name;
    const admins = document.querySelector('#channelName').dataset.admins;
    const user = localStorage.getItem('user');

    // check and set admin privilages
    if (user == admins) {

        document.querySelector('#toggleAdmin').className = 'nav-item nav-link';

        document.querySelector('#toggleAdmin').onclick = (link) => {

            link.ariaExpanded = true;
            return false;
        };

        document.querySelector('#save').onclick = () => {

            const des = document.querySelector('#chDes').value;

            socket.emit('update', {

                'channel': room,
                'des': des
            });
        };

        document.querySelector('#delete').onclick = () => {

            if (confirm("Warning!\nYou are about to delete this channel. This is permanent and will delete all messages sent in the channel.\nDo you still want to proceed?")) {

                const current = window.location.href;

                socket.emit('delete', {

                    'channel': room,
                    'current': current
                });

            } else {
                document.querySelector('#delete').blur();
            }
        };
    }

    // set colour scheme for msgs
    document.querySelectorAll('#staticMsg').forEach((div) => {
        div.style.background = div.dataset.csb;
        div.style.color = div.dataset.cst;
    });


    localStorage.setItem('room', room);

    try {
        // scroll only working on chrome
        scroll();
        // format existing posts
        indent();
    } catch (err) {
        // edge browser has error on scroll
        // format existing posts
        indent();
    }

    // check for empty input field
    document.querySelector('#txtBox').onkeyup = () => {

        let txt = document.querySelector('#txtBox').value;

        if (txt == '') {
            document.querySelector('#send').disabled = true;
        } else {
            // enable send button
            document.querySelector('#send').disabled = false;
        }
    };

    // toggle switch
    document.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            if (document.querySelector('#switch').checked == true) {

                if (document.querySelector('#send').disabled == false) {
                    // set button function
                    setMsg();
                }
            }
        }
    });

    // set button function
    document.querySelector('#send').onclick = () => {

        setMsg();
    };

    document.querySelectorAll('#delMsg').forEach((button) => {

        button.onclick = () => {

            const time = button.dataset.time;

            socket.emit('remMsg', {

                'channel': room,
                'user': user,
                'time': time
            });
        }
    });

    socket.on('sendMsg', (data) => {

        // remember last visited chat page
        const current = localStorage.getItem('room')

        const user = localStorage.getItem('user')

        if (data['room'] == current) {
            add(data);
        }

        clearBox(data);
        reset();

        if (data['user'] == user) {

            try {
                scroll();
            } catch (e) {
                // error on edge
            }
        }
    });

    socket.on('delMsg', (data) => {

        document.querySelector('div.card.w-75').remove();
    });

    socket.on('remove', (data) => {

        const user = data.user;
        const time = data.time;

        document.querySelectorAll('div.card.w-75').forEach((div) => {

            const un = div.childNodes[1].children[0].children[0].dataset.user;
            const t = div.childNodes[1].children[0].children[0].dataset.time;

            if (user == un && time == t) {

                div.remove();
            }
        });
    });

    socket.on('success', () => {

        // display confirmation to user
        document.querySelector('#success').hidden = false;
        document.querySelector('#save').disabled = true;
    });

    // reset button function
    document.querySelector('#close').onclick = () => {

        document.querySelector('#success').hidden = true;

        // reset save button
        document.querySelector('#save').disabled = false;
        document.querySelector('#save').onclick = () => {

            const des = document.querySelector('#chDes').value;

            socket.emit('update', {

                'channel': room,
                'des': des
            });
        };
    };

    socket.on('deleted', (data) => {

        let local = JSON.parse(localStorage.getItem('channels'));

        if (local != null) {

            const index = local.indexOf(data.channel);
            if (index > -1) {
                local.splice(index, 1);
            }

            localStorage.setItem('channels', JSON.stringify(local));
        }

    });

    socket.on('redirect', (data) => {
        window.location = data.url;
    });

    socket.on('back', (data) => {

        const current = window.location.href;

        if (data.current == current) {

            window.location = data.url;
        }

    });

    socket.on('joinUser', (data) => {

        // Create template
        const template = Handlebars.compile(document.querySelector('#userList').innerHTML);

        // Add user to DOM.
        const item = template({
            'user': data.user
        });

        document.querySelector('#people').innerHTML += item;
    });
});

function setMsg() {

    const room = document.querySelector('#channelName').dataset.name;
    let msg = document.querySelector('#txtBox').value;
    const user = localStorage.getItem('user');
    const time = new Date().toLocaleString();

    // check for profanities

    // API for profanities ---------------------------------------------------------------

    // Initialize new request
    const request = new XMLHttpRequest();
    request.open('POST', '/validate');

    // Callback function for when request completes
    request.onload = () => {

        // Extract JSON data from request
        const apidata = JSON.parse(request.responseText);

        // Update validated message
        if (!apidata.success) {

            msg = apidata.txt;

            socket.emit('sendMsg', {

                'room': room,
                'msg': msg,
                'user': user,
                'time': time
            });
        } else {
            socket.emit('sendMsg', {

                'room': room,
                'msg': msg,
                'user': user,
                'time': time
            });
        }
    }

    // Add data to send with request
    const apidata = new FormData();
    apidata.append('txt', msg);

    // Send request
    request.send(apidata);
    return false;

    // end of API ------------------------------------------------------------------------------
}

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
        CS();

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
        CS();
    };
};

function reset() {
    // reset button functions
    document.querySelectorAll('#delMsg').forEach((button) => {

        button.onclick = () => {

            const room = document.querySelector('#channelName').dataset.name;
            const user = localStorage.getItem('user');
            const time = button.dataset.time;

            socket.emit('remMsg', {

                'channel': room,
                'user': user,
                'time': time
            });
        }
    });
}

function indent() {

    const user = localStorage.getItem('user');

    document.querySelectorAll(`#${user}`).forEach(function (div) {

        div.className = 'card w-75 ml-auto mt-2 mb-2';
        div.childNodes[1].children[0].hidden = false;
    });
}

function clearBox(data) {

    if (data['user'] == localStorage.getItem('user')) {
        document.querySelector('#txtBox').value = '';
        document.querySelector('#txtBox').focus();
        document.querySelector('#send').disabled = true;
    }
};

function scroll() {

    let box = document.querySelector('#msgBox');
    let height = box.scrollHeight;
    box.scrollBy(0, height);
}

function CS() {

    // set colour scheme for msgs
    document.querySelectorAll('#msgBod').forEach((div) => {
        div.dataset.csb = document.querySelector('#staticMsg').dataset.csb;
        div.style.background = div.dataset.csb;

        div.dataset.cst = document.querySelector('#staticMsg').dataset.cst;
        div.style.color = div.dataset.cst;
    });
}