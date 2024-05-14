//-- Cargar las dependencias
const socketServer = require('socket.io').Server;
const http = require('http');
const express = require('express');
const PUERTO = 9090;
const Fecha = new Date();
const ip = require("ip");


//-- Cargar el módulo de electron
const electron = require('electron');

console.log("Arrancando electron...");

//-- Variable para acceder a la ventana principal
//-- Se pone aquí para que sea global al módulo principal
let win = null;

//-- Crear una nueva aplciacion web
const app = express();

//-- Crear un servidor, asosiaco a la App de express
const server = http.createServer(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = new socketServer(server);

// borrado a ver si soluciona el error
app.get('/', (req, res) => {
    res.redirect("/chat.html");
});


app.use('/', express.static(__dirname +'/'));
app.use(express.static('public'));

const connectedUsers = {};

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexión recibida
io.on('connect', (socket) => {

    console.log('** NUEVA CONEXIÓN **');
    
    //manda mensaje de bienvenida unicamente al usuario que se ha conectado
    socket.emit("message", "¡Bienvenido al chat, escribe para comenzar!");
    connectedUsers[socket.id] = {};
    win.webContents.send("usuarios", Object.keys(connectedUsers).length);

    //-- Mensaje recibido, dependiendo de que se recibe se hace cada cosa
    socket.on("message", (data)=> {
      console.log("Mensaje Recibido!: " + data);
    if (data.endsWith("/")){
        socket.send("Esperando a recibir comando, si quiere consultar los comandos disponibles utilice: /help")
    }else if (data.split("/")[1] == 'help') {
        socket.send("Comandos Disponibles: /list, /hello, /date");
    } else if(data.split("/")[1] == 'list') {
        socket.send("Hay " + io.engine.clientsCount + " clientes conectados");
    }else if(data.split("/")[1] == 'hello'){
        socket.send('Hola! Bienvenido al chat!!')
    }else if (data.split("/")[1] == 'date'){
        socket.send("Fecha: " + Fecha.toLocaleDateString());
    }else{
        io.send(data);
    }
    });

    socket.on("message" , (data) =>{
        win.webContents.send("msg_client", data);
    }) ;
    
    //-- Evento de desconexión
    socket.on('disconnect', function(){
        console.log('** CONEXIÓN TERMINADA **'.yellow);
        delete connectedUsers[socket.id];
        win.webContents.send("usuarios", Object.keys(connectedUsers).length);
      });  

  });


  //-- Punto de entrada. En cuanto electron está listo,
//-- ejecuta esta función
    electron.app.on('ready', () => {
    console.log("Evento Ready!");

    //-- Crear la ventana principal de nuestra aplicación
    win = new electron.BrowserWindow({
        width: 600,  //-- Anchura 
        height: 600,  //-- Altura

        //-- Permitir que la ventana tenga ACCESO AL SISTEMA
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
    
});

 //-- Cargar interfaz gráfica en HTML
 win.loadFile("electron.html");

  win.on('ready-to-show',() =>{
    win.webContents.send('ipaddress', ip.address());
     });

    electron.ipcMain.handle('prueba', async(event, message) => {
    console.log("Enviando mensaje: " + message);
    //-- Enviar mensaje de prueba
    io.send( message);
    win.webContents.send('print', message);
      });

});
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);
