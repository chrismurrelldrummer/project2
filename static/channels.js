// Connect to websocket
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll('.btn').forEach(function (button) {

        button.style.border = button.dataset.cs;
    });

    // socket.on('newChannel', function (data) {

    //     // Create channel template
    //     const template = Handlebars.compile(document.querySelector('#newCh').innerHTML);
        
    //     console.log(template)

    //     // Add channel to DOM.
    //     const content = template({

    //         'name': data.name,
    //         'cs': data.cs,
    //         'descrip': data.descrip,
    //         'user': data.user
    //     });

    //     console.log(content)

    //     document.querySelector('#channelList').innerHTML += content;

    // });

});