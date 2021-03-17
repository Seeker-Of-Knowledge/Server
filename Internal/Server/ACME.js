const ACME = require("acme-client"),
    Express = require("express"),
    Config = require("../../Config.json"),
    SSL = require("../../Storage/SSL/Current.json"),
    { server: Console } = require("../../Utils/Console"),
    FS = require("fs");

module.exports = async () => {
    let app = Express();
    app.disable("x-powered-by");
    app.use(app.static(__dirname + "/../../Public/80"));
    app.use((req, res) => res.status(404).send());
    app.listen(80);

    Console.log("Listening on port 80.");

    if (!Config.custom_ssl.use_custom_ssl) {
        if (!SSL.cert || !SSL.private || !SSL.private || !SSL.expires) {
            Console.warn("No SSL certificate found.");
            await issue();
        } else if (SSL.expires - Date.now() <= 60000 * 60 * 24 * 15) {
            Console.warn("The SSL certificate has expired, or is about to.");
            await issue();
        }
    } else Console.warn("Currently using a custom SSL certificate.");
}

async function issue () {
    Console.log("Getting a new certificate from Let's Encrypt...");

    const client = new ACME.Client({
        directoryUrl: ACME.directory.letsencrypt.staging,
        accountKey: accountPrivateKey
    });

    const [key, csr] = await ACME.forge.createCsr({
        commonName: Config.doamin,
        altNames: [Config.doamin]
    });

    const cert = await client.auto({
        csr, email: Config.email,
        termsOfServiceAgreed: true,
        challengePriority: ["http-01"],
        challengeCreateFn: (authz, challenge, keyAuthorization) => {
            Console.log("Received the OK from Let's Encrypt.");
            Console.warn("Using HTTP for verification. Make sure your server is available at http://" + Config.domain + "!");
            FS.writeFileSync(__dirname + "/../../Public/80/.well-known/acme-challenge/" + challenge.token, challenge.token);
        },
        challengeRemoveFn: (authz, challenge, keyAuthorizatio) => {
            Console.log("Finished HTTP verification.");
            FS.unlinkSync(__dirname + "/../../Public/80/.well-known/acme-challenge/" + challenge.token);
        }
    });

    let now = Date.now().toString();
    FS.writeFileSync(__dirname + "/../../Storage/SSL/certs/" + now + ".pem", cert);
    FS.writeFileSync(__dirname + "/../../Storage/SSL/private/" + now + ".pem", key);
    FS.writeFileSync(__dirname + "/../../Storage/SSL/Current.json", JSON.stringify({
        cert: __dirname + "/../../Storage/SSL/cert" + now + ".pem",
        private: __dirname + "/../../Storage/SSL/private" + now + ".pem",
        ca: "Let's Encrypt",
        ca_short: "LE",
        generated: now,
        expires: now + (60000 * 60 * 24 * 90)
    }));

    return { key, cert };
}
