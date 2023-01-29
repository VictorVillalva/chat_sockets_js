const net = require("net");
const { send } = require("process");

const server = net.createServer();
const serverPort = 4000;

const connections = new Map();

const sendMessage = (message, origin) => { //ESTE AYUDA A ENVIAR LOS MENSAJES QUE RECIBE EL SERVER A LOS DEMAS
    for (const socket of connections.keys()) {
        if (socket !== origin) {
            socket.write(message);
        }
    }
};

server.listen(serverPort, () => {
    console.log("El SuperChat se encuentra el puerto : ", server.address().port); //SEÑALA EL PUERTO DE CONEXION
    server.on("connection", (socket) => {
        const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`; //Muestra la direccion junto con el puerto del servidor
        socket.setEncoding('utf-8')
        socket.on("data", (data) => {
            if ( !connections.has(socket)) { //AQUI COMPRUBEA QUE NO SE REPITA EL NOMBRE AL ENTRAR
                let isRegistered =false;
                connections.forEach((nickname) => {
                    if (nickname == data) {
                        socket.write(' ----------------------------------------\n +El nombre ya esta usado+.\nPor favor escriba otro : ');
                        isRegistered=true;
                    }
                });

            if(!isRegistered) {
                connections.set(socket, data); //AQUI MUESTRA EL NOMBRE CON EL CUAL SE REGISTRO Y LE MANDO UN MENSAJE QUE SE ENCUENTRA EN LINEA
                console.log(remoteSocket, " se conecto con el nombre de ---> ", data);
                socket.write('********ESTADO: EN LINEA********');
                const userConnected = data;
                sendMessage(userConnected + " se conecto") //ENVIA A LAS DEMAS PERSONAS CONECTADAS, QUE SE ACABA DE CONECTAR
            }
            }else {
                console.log('------------------------------------------')
                console.log(`|${connections.get(socket)}| : ${data}`); //Muestra los mensajes enviados en el server
                console.log('------------------------------------------')
                const fullMessage = `[${connections.get(socket)}]: ${data}`; //MUESTRA EL MENSAJE A LOS DEMAS CONECTADOS
                console.log(`${remoteSocket} -> ${fullMessage}`);
                sendMessage(fullMessage, socket);
            }
        });
        socket.on("error", (err) => { //MUESTRA ALGUN ERROR 
            console.error(err.message);
            process.exit(1);
        });
    
        socket.on("close", () => { //AQUI NOTIFICA SI EXISTE ALGUNA DESCONEXION DEL CHAT
            console.log(connections.get(socket), " Finalizo la Comunicacion");
            const disconnectedUser = `${connections.get(socket)}`;
            sendMessage(disconnectedUser +" se desconecto");
            connections.delete(socket);
        });
    });
});