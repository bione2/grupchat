
from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, emit
from werkzeug.utils import secure_filename

import datetime
import os
import base64

# ================== APP ==================
app = Flask(__name__)
app.secret_key = "studyhub"

socketio = SocketIO(app, async_mode="threading")

# ================== UPLOAD CONFIG ==================
UPLOAD_FOLDER = "static/uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ================== DATA JADWAL ==================
jadwal_kuliah = {
    "senin": [
        {"matkul": "Bahasa Indonesia", "jam": "07.30 - 09.00", "ruang": "303"},
        {"matkul": "Sejarah Peradaban Islam", "jam": "10.30 - 12.00", "ruang": "303"},
        {"matkul": "Interaksi Manusia dan Komputer", "jam": "12.00 - 13.30", "ruang": "305"},
        {"matkul": "E-Commerce", "jam": "13.30 - 15.00", "ruang": "305"}
    ],
    "selasa": [
        {"matkul": "Mitigasi Bencana", "jam": "10.30 - 12.00", "ruang": "305"},
        {"matkul": "Manajemen Organisasi Bisnis", "jam": "13.30 - 15.00", "ruang": "305"},
        {"matkul": "Sistem Operasi", "jam": "15.00 - 16.30", "ruang": "COMP-D"}
    ],
    "rabu": [
        {"matkul": "Bahasa Arab", "jam": "09.00 - 10.30", "ruang": "306"},
        {"matkul": "Analisis Proses Bisnis", "jam": "10.30 - 12.00", "ruang": "305"}
    ],
    "jumat": [
        {"matkul": "Sistem Manajemen Basis Data", "jam": "07.30 - 09.00", "ruang": "Lab 2"}
    ]
}

# ================== ROUTE ==================
@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        session["username"] = request.form["username"]
        return render_template("chat.html", username=session["username"])
    return render_template("login.html")

# ================== CHAT TEXT ==================
@socketio.on("send_message")
def handle_message(data):
    emit("receive_message", data, broadcast=True)

    text = data["message"].lower()
    if "@bot" not in text:
        return

    msg = text.replace("@bot", "").strip()
    hari_list = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"]
    hari_ini = hari_list[datetime.datetime.today().weekday()]

    if msg == "":
        reply = (
            "Hai 👋 Aku Study Hub Bot 🤖\n\n"
            "Ketik:\n"
            "@bot jadwal\n"
            "@bot jadwal hari ini\n"
            "@bot motivasi"
        )

    elif msg == "jadwal":
        reply = "📅 Ketik: @bot jadwal senin / @bot jadwal hari ini"

    elif "jadwal hari ini" in msg:
        if hari_ini in jadwal_kuliah:
            reply = f"📅 Jadwal hari ini ({hari_ini}):\n"
            for m in jadwal_kuliah[hari_ini]:
                reply += f"- {m['matkul']} ({m['jam']})\n"
        else:
            reply = "Tidak ada jadwal hari ini."

    elif "jadwal" in msg:
        hari = msg.replace("jadwal", "").strip()
        if hari in jadwal_kuliah:
            reply = f"📅 Jadwal {hari}:\n"
            for m in jadwal_kuliah[hari]:
                reply += f"- {m['matkul']} ({m['jam']})\n"
        else:
            reply = "Hari tidak ditemukan."

    elif msg == "motivasi":
        reply = "✨ Jangan menyerah, belajar sedikit tapi konsisten 💜"

    else:
        reply = "Aku belum paham 😅 ketik @bot"

    emit("receive_message", {
        "username": "🤖 Study Hub Bot",
        "message": reply
    }, broadcast=True)

# ================== CHAT IMAGE ==================
@socketio.on("send_image")
def handle_image(data):
    username = data["username"]
    image_data = data["image"]

    header, encoded = image_data.split(",", 1)
    ext = header.split("/")[1].split(";")[0]

    if ext not in ALLOWED_EXTENSIONS:
        return

    filename = secure_filename(
        f"{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.{ext}"
    )

    filepath = os.path.join(UPLOAD_FOLDER, filename)

    with open(filepath, "wb") as f:
        f.write(base64.b64decode(encoded))

    image_url = f"/static/uploads/{filename}"

    emit("receive_image", {
        "username": username,
        "image": image_url
    }, broadcast=True)

# ================== RUN ==================
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)