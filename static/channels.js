// Connect to websocket
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

document.addEventListener("DOMContentLoaded", () => {

    const user = localStorage.getItem('user');
    const channels = JSON.parse(localStorage.getItem('channels'));

    document.querySelectorAll('#csbord').forEach((div) => {

        div.style.border = div.dataset.cs;
    });

    document.querySelectorAll('#access').forEach((button) => {


        if (channels != null) {

            let i;

            for (i of channels) {

                if (button.dataset.ch == i) {
                    button.innerHTML = "Let's Chat";
                    button.className = 'btn btn-info'
                }
            }
        }

        button.onclick = () => {

            if (button.innerHTML == 'Join') {

                let store = [];
                let local = JSON.parse(localStorage.getItem('channels'));

                if (local == null) {
                    store.push(button.dataset.ch);
                    localStorage.setItem('channels', JSON.stringify(store));
                } else {
                    local.push(button.dataset.ch);
                    localStorage.setItem('channels', JSON.stringify(local));
                }

                socket.emit('join', {

                    'channel': button.dataset.ch,
                    'user': user,
                    'status': 'newUser'
                });

            } else {

                socket.emit('join', {

                    'channel': button.dataset.ch,
                    'user': user,
                    'status': 'retUser'
                });

            }
        };

    });

    socket.on('redirect', (data) => {
        window.location = data.url;
    });

    socket.on('deleted', (data) => {

        let local = JSON.parse(localStorage.getItem('channels'));

        if (local != null) {

            const index = local.indexOf(data.channel);
            if (index > -1) {
                local.splice(index, 1);
            }

            localStorage.setItem('channels', JSON.stringify(local));
        }

        document.querySelectorAll('#chanContain').forEach((div) => {

            if (div.dataset.ch == data.channel) {

                div.remove();
            }
        });
    });

    socket.on('success', (data) => {

        document.querySelectorAll('.card-text').forEach((p) => {

            if (p.id == data.channel) {

                // update description
                p.innerHTML = data.des;
            }
        });
    });

});