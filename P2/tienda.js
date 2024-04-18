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
//console.log(PUERTO);

const server = http.createServer((req, res) => {
    // Construir el objeto URL con la URL de la solicitud
    let url = new URL(req.url, 'http://' + req.headers['host']);
    // console.log(url.pathname)


    //cosas nuevas P2
    //las cookies
    const cookie = req.headers.cookie;
    if(cookie){    
        console.log("Cookie: " + cookie );
    }else{
        console.log("No hay cookies en esta peticion");
        }

    //-- Cargar pagina web del formulario
    const FORMULARIO = fs.readFileSync('iniciosesion.html','utf-8');
   

    if (url.pathname == '/') {
        file = pag_principal;
    } else if (url.pathname == '/kanye.html'){
        file = pag_kanye;
    }else if (url.pathname == '/motley.html'){
        file = pag_motley;
    }else if (url.pathname == '/thesmiths.html'){
        file = pag_thesmiths;
    }else if (url.pathname == '/procesar'){
        procesamiento();
    }else {
        file = url.pathname.split('/').pop();
    }
    function procesamiento(){
        let registrado = false;
        username = url.searchParams.get("username");
        password = url.searchParams.get("password");
        usuariosregistrados = fs.readFileSync("tienda.json");
        var jsonregistrados = JSON.parse(usuariosregistrados);
        for (var a=0; a< jsonregistrados["usuarios"].length; a++){
            let posicion = jsonregistrados["usuarios"][a];
            if (username == posicion["username"] && password == posicion["password"]){
                registrado = true;
                console.log("llega aki")
                // res.setHeader('Set-Cookie', "user = " + username);
            }
            if (registrado) {
                console.log("entra dentro de registrado")
                
                fs.readFile("index.html", function (error, page){
                    if (error) throw error;
                    var pagprincipal = page.toString();
                    pagprincipal = pagprincipal.replace("<h2> Usuario : Sesion no iniciada</h2>", "<h2> Usuario Registrado: " + username  + "</h2>");
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(pagprincipal);
                    res.end();
                    file = pagprincipal;
                });
                
            } else {
                fs.readFile("usuarionoregistrado.html", function (error, page){
                    if (error) throw error;
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(page);
                    res.end();
                });

            }
        }
    }
    
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
});

server.listen(PUERTO, () => {
    console.log("Escuchando en puerto: " + PUERTO);
});