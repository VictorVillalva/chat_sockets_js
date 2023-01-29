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

const connect = (host, port) => {
    console.log(`Conectado desde --- ${host}:${port}`);

    const socket = new Socket();
    socket.connect({ host, port });
    socket.setEncoding("utf-8");

    socket.on("connect", () => {
        console.log("---------------------------------------------")
        readline.question("Escriba su nombre :  ", (username) => {
            socket.write(username);
            console.log("---------------------------------------------");
            console.log(`Nota : \n Si desea salir de chat digite  ${END}`);
        });

    readline.on("line", (message) => {
        socket.write("" + message);
        if (message === END) {
            socket.end();
        }
    });

    socket.on("data", (data) => {
        console.log(data);
        });
    });

    socket.on("error", (err) => error(err.message));

    socket.on("close", () => {
        console.log("Terminaste Conexion");
        process.exit(0);
    });
};

connect("127.0.0.1" ,4000);