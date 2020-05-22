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
    return render_template('index.html', online=usersonline, offline=usersoffline)

@app.route("/create", methods=["GET", "POST"])
def create():

    if request.method == 'GET':
        return render_template('create.html')
    else:
        channel = request.form.get('newChannel')
        cs = request.form.get('newCS')
        descrip = request.form.get('newChDes')

        details = [channel, descrip, cs, 1]

        # for chList[][0]???
        # if details[channel] in chList:
        #     err = 'There is already a channel with this name. Please chose another.'
        #     return render_template('create.html', error='y', err=err)
        
        chList.append(details)
    
    return redirect('/channels')

@app.route("/channels")
def channels():
    return render_template('channels.html', chList=chList)

@app.route("/chat/<string:ch>", methods=["GET","POST"])
def chat(ch):
    return render_template('chat.html', channel=ch, msg=messages)


@socketio.on('disconnect')
def disconnect():

    print('User is now offline')


# @socketio.on('lastroom')
# def lastroom(data):

#     print(data)
#     channel = data['room']
#     print(channel)

#     return redirect(url_for('chat', ch=channel))



@socketio.on('sendMsg')
def send(data):

    

    messages.append(data)
    print(messages)

    emit("sendMsg", data, broadcast=True)




@socketio.on("offline")
def offline(data):

    user = data["user"]
  
    usersonline[user] = 'offline'

    print(usersonline)


@socketio.on("status")
def status(data):

    status = data["status"]
    user = data["user"]

    if status == 'online':

        usersonline[user] = status

        emit("online", usersonline, broadcast=True)

    else:
        err = 'There was an issue broadcasting you online status.'
        return render_template('index.html', error='y', err=err)