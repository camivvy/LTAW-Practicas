const http = require('http');
const fs = require('fs');


// Definir el puerto a utilizar
const PUERTO = 9090
const pag_principal = 'index.html';
const pag_kanye = 'kanye.html';
const pag_motley = 'motley.html';
const pag_thesmiths = 'thesmiths.html';
const pag_error = 'pag_error.html';
const pagina_error = fs.readFileSync(pag_error);
const pagina_no_reg = fs.readFileSync('usuarionoregistrado.html') //console.log(PUERTO);

// Crear tienda a partir del json
const tiendaenjson = fs.readFileSync("tienda.json");

const server = http.createServer((req, res) => {
    // Construir el objeto URL con la URL de la solicitud
    let url = new URL(req.url, 'http://' + req.headers['host']);
    // console.log(url.pathname)

    //-- Variable para guardar el usuario
    let user;

    // Obtiende las cookies
    const cookie = req.headers.cookie;
    if (cookie) {
    
        //-- Obtener un array con todos los pares nombre-valor
        let pares = cookie.split(";");
    
        //-- Recorrer todos los pares nombre-valor
        pares.forEach((element, index) => {
    
          //-- Obtener los nombres y valores por separado
          let [nombre, valor] = element.split('=');
    
          //-- Leer el usuario
          //-- Solo si el nombre es 'user'
          if (nombre.trim() === 'user') {
            user = valor;
          }
        });
    }

    //-- Cargar pagina web del formulario
    const FORMULARIO = fs.readFileSync('iniciosesion.html','utf-8');
   

    if (url.pathname == '/' || url.pathname.endsWith('/index.html') ) { // PÁGINA PRINCIPAL
        file = pag_principal;

        if (user) {
            fs.readFile(file, function (error, page){

                if (error) {
                    throw error
                } else {
                    var pagprincipal = page.toString();
                    pagprincipal = pagprincipal.replace("<h2> Usuario : Sesion no iniciada</h2>", "<h2> Usuario Registrado: " + user  + "</h2>");
                   
                    // Cuando el user está definido es porque hay cookie de usuario, ya no se puede inciar sesión
                    pagprincipal = pagprincipal.replace("<button ALIGN=\"center\" id=\"iniciosesion\" onclick=\"location.href='iniciosesion.html';\">Iniciar Sesion</button>", "")

                    res.setHeader('Set-Cookie', "user=" + user);
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(pagprincipal);
                    res.end();
    
                }
            });
        } else {
            mandarPagina(file);
        }

        
        
        
    } else if (url.pathname == '/kanye.html'){
        file = pag_kanye;
        mandarPagina(file);
    }else if (url.pathname == '/motley.html'){
        file = pag_motley;
        mandarPagina(file);
    }else if (url.pathname == '/thesmiths.html'){
        file = pag_thesmiths;
        mandarPagina(file);
    }else if (url.pathname == '/procesar'){
        procesamiento();
    }else {
        file = url.pathname.split('/').pop();
        mandarPagina(file);
    }

    function procesamiento(){
        let registrado = false;

        // Coge parámetros de la url
        username = url.searchParams.get("username");
        password = url.searchParams.get("password");
        
        const jsonregistrados = JSON.parse(tiendaenjson);

        for (var a=0; a < jsonregistrados["usuarios"].length; a++){
            let posicion = jsonregistrados["usuarios"][a];

            if (username == posicion["username"] && password == posicion["password"]){
                registrado = true;
                console.log(username)
            }
        }

        if (registrado == true) {
            console.log("entra dentro de registrado")
            
            fs.readFile("index.html", function (error, page){
                console.log("entra al readfle")
                if (error) {
                    throw error
                } else {
                    var pagprincipal = page.toString();
                    pagprincipal = pagprincipal.replace("<h2> Usuario : Sesion no iniciada</h2>", "<h2> Usuario Registrado: " + username  + "</h2>");
                    
                    // Cuando el user está definido es porque hay cookie de usuario, ya no se puede inciar sesión
                    pagprincipal = pagprincipal.replace("<button ALIGN=\"center\" id=\"iniciosesion\" onclick=\"location.href='iniciosesion.html';\">Iniciar Sesion</button>", "")

                    res.setHeader('Set-Cookie', "user=" + username);
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(pagprincipal);
                    res.end();

                }
            });
            
        } else if (registrado == false) {
            fs.readFile("usuarionoregistrado.html", function (error, page){
                if (error) {
                    throw error
                }else{
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(page);
                    res.end();
                    console.log("no te has registrado")  
                }
                
            });
        }
        
    }
    
    function mandarPagina(file) {
        fs.readFile(file, (error, page) => {

            // Obtener la extensión del archivo
            const recurso = url.pathname.split('.').pop();
            console.log('recurso solicitado -> '+ recurso);
    
    
            switch (recurso) {
                case 'css':
                    contentType = 'text/css';
                    break;
                case 'js':
                    contentType = 'text/javascript';
                    break;
                case 'png':
                    contentType = 'image/png';
                    break;
                case 'jpg':
                    contentType = 'image/jpg';
                    break;
                default:
                    contentType = 'text/html';
            }
            // console.log('contenttype -> ' + contentType);
    
    
            if (error) {
                // Si hay un error al leer el archivo, muestra un error 404
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.write(pagina_error);
                res.end();
                return;
            } else {
                 console.log('envio correcto');
                // Si el archivo se lee correctamente, envíalo al cliente
                res.writeHead(200, { 'Content-Type': contentType });
                res.write(page);
                res.end();
            }
            
        });
    } 
});


server.listen(PUERTO, () => {
    console.log("Escuchando en puerto: " + PUERTO);
});