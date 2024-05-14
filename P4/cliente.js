//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const usernameInput = document.getElementById("username");

const Io = require('socket.io');
//-- Crear un websocket. Se establece la conexión con el servidor
const socket = Io();


socket.on("message", (msg)=>{
  display.innerHTML += '<p style="color:blue">' + msg + '</p>';
});

//-- Al apretar el botón se envía un mensaje al servidor
  msg_entry.onchange = () => {
    if (msg_entry.value) {
      const message = msg_entry.value.trim();
      const username = usernameInput.value.trim();
      if (username && message) {
        //let texto = username + ": " + message;
        //electron.ipcRenderer.invoke(username + ": " + message); // Envía nombre de usuario junto con el mensaje
        //display.innerHTML += "\n" + username + ": " + message;
        socket.send( username + ": " + message);
      } else {
        alert("Por favor, introduce tu nombre de usuario y un mensaje válido.");
      }
    }
    
    //-- Borrar el mensaje actual
    msg_entry.value = "";
  }


function nombreDeUsuario() {
  var usernameInput = document.getElementById("username");
  var username = usernameInput.value.trim();

  if (username !== "") {
    document.getElementById("username_input").style.display = "none";
    document.getElementById("chat_container").style.display = "block";
    localStorage.setItem("username", username); 
  } else {
    alert("Por favor, introduce un nombre de usuario válido.");
  }}