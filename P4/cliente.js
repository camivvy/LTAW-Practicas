//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const usernameInput = document.getElementById("username");

const socket = io();


socket.on("message", (msg)=>{
  display.innerHTML += '<p style="color:blue">' + msg + '</p>';
});

// para que se guarde el nombre de usuario para enviar mensajes
let user = "";
usernameInput.onchange = () => {
    if (usernameInput.value) {
      user = usernameInput.value;
    }
  }

//-- Al apretar el botón se envía un mensaje al servidor
  msg_entry.onchange = () => {
    if (msg_entry.value) {
      const message = msg_entry.value.trim();
      const username = usernameInput.value.trim();
      if (username && message) {
        socket.send( username + ": " + message);
      } else {
        alert("Por favor, introduce tu nombre de usuario y un mensaje válido.");
      }
    }
    
    //-- Borrar el mensaje actual
    msg_entry.value = "";
  }

