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
