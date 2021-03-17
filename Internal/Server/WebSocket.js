const WebSocket = require("ws");

module.exports = (server) => {
    server = new WebSocket.Server({
        server, perMessageDeflate: {
            zlibDeflateOptions: {
                chunkSize: 1024,
                memLevel: 7,
                level: 3
            },
            zlibInflateOptions: {
                chunkSize: 10 * 1024
            },
            clientNoContextTakeover: true,
            serverNoContextTakeover: true,
            serverMaxWindowBits: 10,
            concurrencyLimit: 10,
            threshold: 512
        }
    });

    server.on("connection", (ws) => {
        ws.on("open", () => require("../Handlers/WebSocket/Open")(ws));
        ws.on("message", (message) => require("../Handlers/WebSocket/Message")(ws, message));
        ws.on("close", (code, reason) => require("../Handlers/WebSocket/Close")(ws, code, reason));
    });

}
