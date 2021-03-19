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


const Chalk = require("chalk");

module.exports = {
    manager: {
        log: (msg) => console.log(Chalk.blackBright(d()) + "  " + Chalk.magentaBright("MANAGER") + " " + Chalk.gray("LOG") + "     " + Chalk.magenta(msg)),
        warn: (msg) => console.warn(Chalk.blackBright(d()) + "  " + Chalk.magentaBright("MANAGER") + " " + Chalk.yellow("WARN") + "    " + Chalk.magenta(msg)),
        error: (msg) => console.error(Chalk.blackBright(d()) + "  " + Chalk.magentaBright("MANAGER") + " " + Chalk.redBright("ERR!") + "    " + Chalk.magenta(msg)),
        fatal: (msg) => console.error(Chalk.blackBright(d()) + "  " + Chalk.magentaBright("MANAGER") + " " + Chalk.bgYellow(Chalk.redBright("FATAL")) + "   " + Chalk.magenta(msg))
    },
    server: {
        log: (msg) => console.log(Chalk.blackBright(d()) + "  " + Chalk.gray("LOG") + "     " + Chalk.white(msg)),
        warn: (msg) => console.warn(Chalk.blackBright(d()) + "  " + Chalk.yellow("WARN") + "    " + Chalk.white(msg)),
        error: (msg) => console.error(Chalk.blackBright(d()) + "  " + Chalk.redBright("ERR!") + "    " + Chalk.yellow(msg)),
        fatal: (msg) => console.error(Chalk.blackBright(d()) + "  " + Chalk.bgYellow(Chalk.redBright("FATAL")) + "   " + Chalk.red(msg))
    }
}

function d () {
    let date = new Date();
    return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getSeconds() + "." + date.getMilliseconds();
}
