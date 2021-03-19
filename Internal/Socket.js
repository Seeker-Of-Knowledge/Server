/*

    OpenSend Server
    Copyright (C) 2021  OpenSend Technologies

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/


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
    const Current = require("../Storage/SSL/Current.json");
    let cert, key;

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

    server.on("request", Express);
    WebSocket(server);

    return new Promise((resolve) => {
        server.listen(443, () => {
            Console.log("Bound to port 443.");
            resolve(server);
        });
    });
}
