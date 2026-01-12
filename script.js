const socket = io();

/* ================== TAMBAH PESAN TEKS ================== */
function addMessage(user, text) {
    const box = document.getElementById("chat-box");
    const msg = document.createElement("div");

    msg.className = "message " + (user === username ? "me" : "");

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerHTML = `<div class="name">${user}</div>${text}`;

    msg.appendChild(bubble);
    box.appendChild(msg);
    box.scrollTop = box.scrollHeight;
}

/* ================== TERIMA PESAN TEKS ================== */
socket.on("receive_message", data => {
    addMessage(data.username, data.message);
});

/* ================== KIRIM PESAN TEKS ================== */
function send() {
    const input = document.getElementById("msg");
    if (!input.value.trim()) return;

    socket.emit("send_message", {
        username: username,
        message: input.value
    });

    input.value = "";
}

/* ================== KIRIM GAMBAR ================== */
const imageInput = document.getElementById("imageInput");

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        socket.emit("send_image", {
            username: username,
            image: reader.result
        });
    };
    reader.readAsDataURL(file);

    imageInput.value = "";
});

/* ================== TERIMA GAMBAR ================== */
socket.on("receive_image", data => {
    const box = document.getElementById("chat-box");

    const msg = document.createElement("div");
    msg.className = "message";

    const bubble = document.createElement("div");
    bubble.className = "bubble image";
    bubble.innerHTML = `
        <div class="name">${data.username}</div>
        <img src="${data.image}">
        <br>
        <a href="${data.image}" download>⬇ Download</a>
    `;

    msg.appendChild(bubble);
    box.appendChild(msg);
    box.scrollTop = box.scrollHeight;
});
