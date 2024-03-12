const http = require('http');
const fs = require('fs');

//-- Definir el puerto a utilizar
const PUERTO = 9090;


const server = http.createServer((req, res)=>{
  console.log("Petición recibida!");

  //-- Valores de la respuesta por defecto
  let code = 200;
  let code_msg = "OK";
  let page = fs.readFileSync('index.html','utf8');;

  //-- Analizar el recurso
  //-- Construir el objeto url con la url de la solicitud
  const url = new URL(req.url, 'http://' + req.headers['host']);
  console.log(url.pathname);

    
  //-- Cualquier recurso que no sea la página principal
  //-- genera un error
  if (url.pathname != '/') {
      code = 404;
      code_msg = "Not Found";
      page = fs.readFileSync('pag_error.html','utf8');;
  }
  if (url.pathname == "/index.css" | url.pathname == "/mmcd.css" ) {
          res.writeHead(200, {'Content-Type': 'text/css'});
          }

  //-- Generar la respusta en función de las variables
  //-- code, code_msg y page

  res.statusCode = code;
  res.statusMessage = code_msg;
  res.setHeader('Content-Type','text/html');
  res.write(page);
  res.end();


      });



server.listen(PUERTO);

console.log("Escuchando en puerto: " + PUERTO);