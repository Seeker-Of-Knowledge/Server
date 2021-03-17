const { manager: Console } = require("./Utils/Console"),
    Information = require("./Storage/Information.json"),
    { fork } = require("child_process"),
    request = require("request");

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
    request("https://install.opensend.net/versions.json", {
        json: true,
        method: "GET",
        headers: {
            "Accept": "application/json",
            "User-Agent": Information.user_agent || "OpenSend-Server (THIRD-PARTY) (+https://github.com/OpenSend-Technologies/Server)"
        }
    }).then(func).catch(func);
}

Console.warn("Thanks for using OpenSend Server!");

Console.log("Checking for updates...");
checkUpdates(() => {
    Console.log("Loading...");
    start();
});
