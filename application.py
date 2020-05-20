import os

from flask import Flask, redirect, render_template, request, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


@app.route("/")
def index():
    return render_template('index.html')


usersonline = {}
usersoffline = {}


@socketio.on("status")
def status(data):

    status = data["status"]
    user = data["user"]

    if status == 'online':

        try:
            usersoffline.pop(user)
            usersonline[user] = status
        except:
            usersonline[user] = status
        emit("online", usersonline, broadcast=True)
    elif status == 'offline':

        try:
            usersonline.pop(user)
            usersoffline[user] = status
        except:
            usersoffline[user] = status
        emit("offline", usersonline, broadcast=True)
    else:
        err = 'There was an issue broadcasting you online status.'
        return render_template('index.html', error='y', err=err)