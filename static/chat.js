// Connect to websocket
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

document.addEventListener("DOMContentLoaded", () => {

    const room = document.querySelector('#channelName').dataset.name;

    localStorage.setItem('room', room)

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
    }

    // set button function
    document.querySelector('#send').onclick = () => {

        let msg = document.querySelector('#txtBox').value;
        const user = localStorage.getItem('user');
        const time = new Date().toLocaleString();

        // check for profanities
        // profanity(txt);

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

        // reassigned to msg because profanity changes #txtBox
        // const msg = document.querySelector('#txtBox').value;
        // const user = localStorage.getItem('user');
        // const time = new Date().toLocaleString();

        // socket.emit('sendMsg', {

        //     'room': room,
        //     'msg': msg,
        //     'user': user,
        //     'time': time
        // });

    };

    socket.on('sendMsg', (data) => {

        // remember last visited chat page
        const current = localStorage.getItem('room')

        if (data['room'] == current) {
            add(data);
        }

        clearBox(data);
    });

    socket.on('delMsg', (data) => {

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
        document.querySelector('#send').disabled = true;
    }
};

function scroll() {

    let box = document.querySelector('#msgBox');
    let height = box.scrollHeight;
    box.scrollBy(0, height);
}

// function profanity(data) {

//     // API for profanities ---------------------------------------------------------------

//     // Initialize new request
//     const request = new XMLHttpRequest();
//     request.open('POST', '/validate');

//     // Callback function for when request completes
//     request.onload = () => {

//         // Extract JSON data from request
//         const apidata = JSON.parse(request.responseText);

//         // Update validated message
//         if (!apidata.success) {

//             document.querySelector('#txtBox').value = apidata.txt;
//         }
//     }

//     // Add data to send with request
//     const apidata = new FormData();
//     apidata.append('txt', data);
//     console.log(apidata.txt)

//     // Send request
//     request.send(apidata);
//     return false;

//     // end of API ------------------------------------------------------------------------------
// }