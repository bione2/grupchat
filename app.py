from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return render_template('index.html')

# ================= SOCKET.IO EVENTS =================
@socketio.on('send_message')
def handle_message(data):
    username = data.get('username')
    message = data.get('message')
    emit('receive_message', {'username': username, 'message': message}, broadcast=True)

@socketio.on('send_image')
def handle_image(data):
    username = data.get('username')
    image = data.get('image')
    emit('receive_image', {'username': username, 'image': image}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
