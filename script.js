let username = "";
const socket = io();

// ===== LOGIN =====
function enterChat(){
    const input = document.getElementById("usernameInput");
    if(!input.value.trim()) return alert("Nama wajib diisi!");
    username = input.value.trim();
    document.getElementById("login-container").style.display="none";
    document.getElementById("chat-container").style.display="flex";
}

// ===== KIRIM PESAN =====
function sendMessage(){
    const msgInput = document.getElementById("msg");
    if(!msgInput.value.trim()) return;

    const text = msgInput.value.trim();
    addMessage(username, text, true);

    // Bot dummy
    if(text.toLowerCase().includes("@bot")){
        setTimeout(()=>{
            addMessage("🤖 Study Hub Bot", "Jadwal hari ini: Belajar HTML, CSS, JS 📚", false, true);
        },500);
    }

    socket.emit("send_message",{username,message:text});
    msgInput.value="";
}

// ===== TERIMA PESAN =====
socket.on("receive_message",data=>{
    if(data.username!==username) addMessage(data.username,data.message,false);
});

// ===== KIRIM GAMBAR =====
const imageInput=document.getElementById("imageInput");
imageInput.addEventListener("change",()=>{
    const file=imageInput.files[0];
    if(!file) return;
    const reader=new FileReader();
    reader.onload=()=>{
        addImage(username,reader.result,true);
        socket.emit("send_image",{username,image:reader.result});
    };
    reader.readAsDataURL(file);
    imageInput.value="";
});

// ===== TERIMA GAMBAR =====
socket.on("receive_image",data=>{
    if(data.username!==username) addImage(data.username,data.image,false);
});

// ===== ADD PESAN =====
function addMessage(name,text,isMe,isBot=false){
    const box=document.getElementById("chat-box");
    const msgDiv=document.createElement("div");
    msgDiv.className="message"+(isMe?" me":"");

    if(!isMe){
        const avatar=document.createElement("div");
        avatar.className="avatar"+(isBot?" bot":"");
        avatar.textContent=name[0];
        msgDiv.appendChild(avatar);
    }

    const bubbleWrap=document.createElement("div");
    const nameDiv=document.createElement("div");
    nameDiv.className="name";
    nameDiv.textContent=name;

    const bubble=document.createElement("div");
    bubble.className="bubble";
    bubble.textContent=text;

    bubbleWrap.appendChild(nameDiv);
    bubbleWrap.appendChild(bubble);
    msgDiv.appendChild(bubbleWrap);
    box.appendChild(msgDiv);
    box.scrollTop=box.scrollHeight;
}

// ===== ADD GAMBAR =====
function addImage(name,imgSrc,isMe){
    const box=document.getElementById("chat-box");
    const msgDiv=document.createElement("div");
    msgDiv.className="message"+(isMe?" me":"");

    if(!isMe){
        const avatar=document.createElement("div");
        avatar.className="avatar";
        avatar.textContent=name[0];
        msgDiv.appendChild(avatar);
    }

    const bubbleWrap=document.createElement("div");
    const nameDiv=document.createElement("div");
    nameDiv.className="name";
    nameDiv.textContent=name;

    const bubble=document.createElement("div");
    bubble.className="bubble image";
    bubble.innerHTML=`<img src="${imgSrc}"><br><a href="${imgSrc}" download>⬇ Download</a>`;

    bubbleWrap.appendChild(nameDiv);
    bubbleWrap.appendChild(bubble);
    msgDiv.appendChild(bubbleWrap);
    box.appendChild(msgDiv);
    box.scrollTop=box.scrollHeight;
}
