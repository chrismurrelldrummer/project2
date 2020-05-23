import os

from flask import Flask, redirect, render_template, request, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

usersonline = {}
usersoffline = {}
chList = []
messages = []

@app.route("/")
def index():
    return render_template('index.html',
                           online=usersonline,
                           offline=usersoffline)


@app.route("/create", methods=["GET", "POST"])
def create():

    if request.method == 'GET':
        return render_template('create.html')
    else:
        channel = request.form.get('newChannel')
        cs = request.form.get('newCS')
        descrip = request.form.get('newChDes')

        details = [channel, descrip, cs, 1]

        for row in chList:
            if channel in row:
                err = 'There is already a channel with this name. Please choose another.'
                return render_template('create.html', error='y', err=err)

        chList.append(details)

    return redirect(url_for('channels'))


@app.route("/channels")
def channels():
    return render_template('channels.html', chList=chList)


@app.route("/chat/<string:ch>", methods=["GET", "POST"])
def chat(ch):

    # get method for when user types in url
    if request.method == 'GET':

        if chList == []:
            err = 'Sorry! That page does not exist.'
            return render_template('error.html', err=err, code=404)
        else:
            for row in chList:
                if ch in row:
                    return render_template('chat.html', channel=ch, msg=messages)
                
            err = 'Sorry! That page does not exist.'
            return render_template('error.html', err=err, code=404)
    else:
        # post method will have chList because it comes from button on channels page
        for row in chList:
            if ch in row:
                return render_template('chat.html', channel=ch, msg=messages)
        
        err = 'Sorry! That page does not exist.'
        return render_template('error.html', err=err, code=404)

@socketio.on('disconnect')
def disconnect():

    print('User is now offline')


@socketio.on('lastroom')
def lastroom(data):

    channel = data['room']

    if chList == []:
        emit('redirect', {'url': url_for('channels')})
    else:
        for row in chList:
            if channel in row:
                emit('redirect', {'url': url_for('chat', ch=channel)})
            else:
                emit('redirect', {'url': url_for('channels')})


@socketio.on('sendMsg')
def send(data):

    max = 5
    count = 0

    room = data['room']

    for row in messages:

        if room == row['room']:
            count += 1

    if count < max:
        messages.append(data)
        emit("sendMsg", data, broadcast=True)
    else:
        # messages.remove(room)
        messages.append(data)
        # print(messages)
        emit("sendMsg", data, broadcast=True)
        # emit("delMsg", data, broadcast=True)


# @socketio.on('newChannel')
# def newChannel(data):

#     emit("newChannel", data, broadcast=True)


@socketio.on("offline")
def offline(data):

    user = data["user"]

    usersonline[user] = 'offline'


@socketio.on("status")
def status(data):

    status = data["status"]
    user = data["user"]

    usersonline[user] = status

    emit("online", usersonline, broadcast=True)