const { Socket } = require("net");
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

const END = "END";

const error = (message) => {
    console.error(message);
    process.exit(1);
};

const connect = (host, port) => { //MUESTRA DESDE DONDE ESTA CONECTADO
    console.log(`Conectado desde --- ${host}:${port}`);

    const socket = new Socket();
    socket.connect({ host, port });
    socket.setEncoding("utf-8");

    socket.on("connect", () => { //DIGITA EL NOMBRE PARA ENTRAR
        console.log("---------------------------------------------")
        readline.question("Escriba su nombre :  ", (username) => {
            socket.write(username);
            console.log("---------------------------------------------");
            console.log(`Nota : \n Si desea salir de chat digite  ${END}`);
        });

    readline.on("line", (message) => { //SI ESCRIBE LA CONDICIONAL SALE DEL CHAT
        socket.write("" + message);
        if (message === END) {
            socket.end();
        }
    });

    socket.on("data", (data) => { //MUESTRA LOS MENSAJES 
        console.log(data);
        });
    });

    socket.on("error", (err) => error(err.message)); //MANDA MENSAJE DE ERROR

    socket.on("close", () => {//NOTIFICA CUANDO TERMINAS CONEXION
        console.log("Terminaste Conexion");
        process.exit(0);
    });
};

connect("127.0.0.1" ,4000); // IP Y PUERTO DE CONEXION