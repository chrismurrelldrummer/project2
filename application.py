import os

import requests

from datetime import datetime

from flask import Flask, redirect, render_template, request, url_for, jsonify, json
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# initialise global variables
usersonline = {}
usersoffline = {}
chList = []
messages = []
joined = {}
admins = {}


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/validate", methods=["POST"])
def validate():

    # Query to PurgoMalum for profanities check
    txt = request.form.get("txt")
    res = requests.get("https://www.purgomalum.com/service/json",
                       params={"text": txt})

    # Make sure request succeeded
    if res.status_code != 200:
        return jsonify({"success": False})

    # Make sure display name not in blacklist
    data = res.json()
    if '*' in data["result"]:
        return jsonify({"success": False, "txt": data["result"]})

    return jsonify({"success": True})


@app.route("/create", methods=["GET", "POST"])
def create():

    if request.method == 'GET':
        return render_template('create.html')
    else:
        channel = request.form.get('newChannel')
        csb = request.form.get('newCSb')
        cst = request.form.get('newCSt')
        descrip = request.form.get('newChDes')

        details = [channel, descrip, csb, 1, cst]

        for row in chList:
            if channel in row:
                err = 'There is already a channel with this name. Please choose another.'
                return render_template('create.html', error='y', err=err)

        chList.append(details)

        # set welcome message from admin
        welcome = 'Welcome to your new channel! People are now able to join this channel from the "channels" tab. Get your channel off to a good start with a greeting!'

        time = datetime.now()
        time = time.strftime("%x %X")

        data = {
            'room': channel,
            'msg': welcome,
            'user': 'Talk-space Admin',
            'time': time
        }

        messages.append(data)

    return redirect(url_for('channels'))


@app.route("/channels")
def channels():

    return render_template('channels.html', chList=chList, joined=joined)


@socketio.on("join")
def join(data):

    channel = data["channel"]

    if data['status'] == 'newUser':

        try:
            ul = joined[channel]
            ul.append(data['user'])
        except:
            ul = [data['user']]

        joined[channel] = ul

        for row in chList:
            if channel == row[0]:
                row[3] += 1

        emit('redirect', {'url': url_for('chat', ch=channel)})

    elif data['status'] == 'admin':

        ul = [data['user']]

        joined[channel] = ul
        admins[channel] = ul

    else:
        emit('redirect', {'url': url_for('chat', ch=channel)})


@app.route("/chat/<string:ch>")
def chat(ch):

    if chList == []:
        err = 'Sorry! That page does not exist.'
        return render_template('error.html', err=err, code=404)
    else:
        for row in chList:
            if ch in row:
                csb = row[2]
                cst = row[4]
                return render_template('chat.html',
                                       channel=ch,
                                       msg=messages,
                                       joined=joined,
                                       csb=csb,
                                       cst=cst)

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

    maxcount = 100
    count = 0

    room = data['room']

    for row in messages:

        if room == row['room']:
            count += 1

    if count < maxcount:
        messages.append(data)
        emit("sendMsg", data, broadcast=True)
    else:

        for row in messages:
            if room == row['room']:
                messages.remove(row)
                break

        messages.append(data)
        emit("sendMsg", data, broadcast=True)
        emit("delMsg", data, broadcast=True)


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