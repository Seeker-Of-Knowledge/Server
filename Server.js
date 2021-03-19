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


const { server: Console } = require("./Utils/Console"),
    Socket = require("./Internal/Socket"),
    FS = require("fs");

if (!FS.existsSync(__dirname + "/.lock")) {
    Console.log("Creating lock file...");
    FS.writeFileSync(__dirname + "/.lock", Date.now().toString());
    
    Console.log("Starting socket manager...");
    Socket().then(() => {
        Console.log("The socket manager has finished setup.");
        Console.log("Ready!");
    }).catch((err) => {
        Console.fatal("A fatal socket error has occurred:");
        console.error(err);
        process.exit(1);
    });
} else {
    Console.fatal("A lock file was found (.lock). Delete it to continue.");
    Console.fatal("Location: " + __dirname);
    process.exit(1);
}
