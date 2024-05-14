
const electron = require('electron');
const PUERTO = 9090;


// informacion para enseñar en la practica 4
const nodeVersion = document.getElementById("nodeVersion");
nodeVersion.textContent = process.versions.node;

const chromeVersion = document.getElementById("chromeVersion");
chromeVersion.textContent = process.versions.chrome;

const electronVersion = document.getElementById("electronVersion");
electronVersion.textContent = process.versions.electron;

//numero de usuarios
const num_users = document.getElementById("usuarios");
electron.ipcRenderer.on("usuarios", (event, message) =>{
  num_users.textContent = message;
});

// direccion ip
const ipAddressElement = document.getElementById('ipaddress');
electron.ipcRenderer.on('ipaddress', (event, message) => {
  const url = `http://${message}:${PUERTO}/chat.html`;
  ipAddressElement.textContent = url;

});


// mensaje recibido de main
electron.ipcRenderer.on("msg_client", (event, message )=> {
  display.innerHTML += message + "</br>"
  
});




