const { Console } = require("console");
const { resolve } = require("path");
const Express = require("./Server/Express"),
    { server: Console } = require("../Utils/Console"),
    WebSocket = require("./Server/WebSocket"),
    Config = require("../Config.json"),
    ACME = require("./Server/ACME"),
    HTTPS = require("https"),
    FS = require("fs");

module.exports = async () => {
    await ACME();

    Console.log("Getting ready to bind to port 443 (secure)...");
    const Current = require("../Storage/SSL/Current.json"),
        cert, key;

    if (Config.custom_ssl.use_custom_ssl) {
        Console.log("Using a custom SSL certificate...");
        cert = FS.readFileSync(Config.custom_ssl.cert);
        key = FS.readFileSync(Config.custom_ssl.private);
    } else {
        Console.log("Using a generated SSL certificate...");
        cert = FS.readFileSync(Current.cert);
        key = FS.readFileSync(Current.private);
    }

    const server = HTTPS.createServer({
        cert: FS.readFileSync(Current.cert),
        key: FS.readFileSync(Current.private),
        minVersion: Config.minTLSVersion || "TLSv1.2"
    });

    WebSocket(server);
    Express(server);

    return new Promise((resolve) => {
        server.listen(443, () => {
            Console.log("Bound to port 443.");
            resolve(server);
        });
    });
}
