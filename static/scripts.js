document.addEventListener("DOMContentLoaded", function () {
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('disconnect', function () {
        const user = localStorage.getItem('user')
    
        console.log('user disconnected')

        socket.emit('offline', {
            'user': user
        });
    
    });
});
