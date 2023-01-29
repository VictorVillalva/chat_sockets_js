const net = require("net");
const { send } = require("process");

const server = net.createServer();
const serverPort = 4000;

const connections = new Map();

const sendMessage = (message, origin) => {
    for (const socket of connections.keys()) {
        if (socket !== origin) {
            socket.write(message);
        }
    }
};

server.listen(serverPort, () => {
    console.log("El SuperChat se encuentra el server : ", server.address().port);
    server.on("connection", (socket) => {
        const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
        socket.setEncoding('utf-8')
        socket.on("data", (data) => {
            if ( !connections.has(socket)) {
                let isRegistered =false;
                connections.forEach((nickname) => {
                    if (nickname == data) {
                        socket.write(' ----------------------------------------\n +El nombre ya esta usado+.\nPor favor escriba otro : ');
                        isRegistered=true;
                    }
                });

            if(!isRegistered) {
                connections.set(socket, data);
                console.log(remoteSocket, " se conecto con el nombre de ---> ", data);
                socket.write('********ESTADO: EN LINEA********');
                const userConnected = data;
                sendMessage(userConnected + " se conecto")
            }
            }else {
                console.log('------------------------------------------')
                console.log(`|${connections.get(socket)}| : ${data}`);
                console.log('------------------------------------------')
                const fullMessage = `[${connections.get(socket)}]: ${data}`;
                console.log(`${remoteSocket} -> ${fullMessage}`);
                sendMessage(fullMessage, socket);
            }
        });
        socket.on("error", (err) => {
            console.error(err.message);
            process.exit(1);
        });
    
        socket.on("close", () => {
            console.log(connections.get(socket), " Finalizo la Comunicacion");
            const disconnectedUser = `${connections.get(socket)}`;
            sendMessage(disconnectedUser +" se desconecto");
            connections.delete(socket);
        });
    });
});