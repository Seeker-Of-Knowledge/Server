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
