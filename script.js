const username = "Guest";

/* ================== KIRIM PESAN ================== */
function sendMessage() {
    const input = document.getElementById("msg");
    const text = input.value.trim();
    if (!text) return;

    addMessage(username, text, true);

    // BOT DUMMY
    if (text.toLowerCase().includes("@bot")) {
        setTimeout(() => {
            addMessage(
                "🤖 Study Hub Bot",
                "Jadwal hari ini: Belajar HTML, CSS, dan JavaScript 📚",
                false,
                true
            );
        }, 600);
    }

    input.value = "";
}

/* ================== TAMBAH PESAN KE CHAT ================== */
function addMessage(name, text, isMe, isBot = false) {
    const box = document.getElementById("chat-box");

    const msgDiv = document.createElement("div");
    msgDiv.className = "message" + (isMe ? " me" : "");

    if (!isMe) {
        const avatar = document.createElement("div");
        avatar.className = "avatar" + (isBot ? " bot" : "");
        avatar.textContent = name[0];
        msgDiv.appendChild(avatar);
    }

    const bubbleWrap = document.createElement("div");

    const nameDiv = document.createElement("div");
    nameDiv.className = "name";
    nameDiv.textContent = name;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;

    bubbleWrap.appendChild(nameDiv);
    bubbleWrap.appendChild(bubble);
    msgDiv.appendChild(bubbleWrap);

    box.appendChild(msgDiv);
    box.scrollTop = box.scrollHeight;
}

/* ================== KIRIM GAMBAR (LOCAL SAJA) ================== */
const imageInput = document.getElementById("imageInput");

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        addImage(username, reader.result, true);
    };
    reader.readAsDataURL(file);

    imageInput.value = "";
});

/* ================== TAMBAH GAMBAR KE CHAT ================== */
function addImage(name, imgSrc, isMe) {
    const box = document.getElementById("chat-box");

    const msgDiv = document.createElement("div");
    msgDiv.className = "message" + (isMe ? " me" : "");

    if (!isMe) {
        const avatar = document.createElement("div");
        avatar.className = "avatar";
        avatar.textContent = name[0];
        msgDiv.appendChild(avatar);
    }

    const bubbleWrap = document.createElement("div");

    const nameDiv = document.createElement("div");
    nameDiv.className = "name";
    nameDiv.textContent = name;

    const bubble = document.createElement("div");
    bubble.className = "bubble image";
    bubble.innerHTML = `
        <img src="${imgSrc}">
        <br>
        <a href="${imgSrc}" download>⬇ Download</a>
    `;

    bubbleWrap.appendChild(nameDiv);
    bubbleWrap.appendChild(bubble);
    msgDiv.appendChild(bubbleWrap);

    box.appendChild(msgDiv);
    box.scrollTop = box.scrollHeight;
}
