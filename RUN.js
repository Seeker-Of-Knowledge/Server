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


const { manager: Console } = require("./Utils/Console"),
    Information = require("./Storage/Information.json"),
    { fork } = require("child_process"),
    fetch = require("node-fetch");

function start () {
    Console.log("Spawning child process...");
    let child = fork(__dirname + "/Server.js");

    child.on("spawn", () => {
        Console.log("Child process has been spawned.");
    });

    child.on("error", (err) => {
        Console.error("Child process has ran into an error:");
        console.error(err)
    });

    child.on("exit", () => {
        Console.fatal("Child process has exited. Automatically respawning...");
        setTimeout(start, 5000);
    });
}

function checkUpdates (func) {
    fetch("https://install.opensend.net/versions.json", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "User-Agent": Information.user_agent || "OpenSend-Server (THIRD-PARTY) (+https://github.com/OpenSend-Technologies/Server)"
        }
    }).then(x => x.json()).then(func).catch((err) => {
        Console.warn("Couldn't contact OpenSend:");
        console.warn(err);
        func();
    });
}

Console.warn("Thanks for using OpenSend Server!");

Console.log("Checking for updates...");
checkUpdates(() => {
    Console.log("Loading...");
    start();
});
