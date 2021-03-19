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


const ACME = require("acme-client"),
    Express = require("express"),
    Config = require("../../Config.json"),
    SSL = require("../../Storage/SSL/Current.json"),
    { server: Console } = require("../../Utils/Console"),
    FS = require("fs");
const { resolve } = require("path");

module.exports = async () => {
    let app = Express();
    app.disable("x-powered-by");

    app.use((req, res, next) => {
        res.header("X-Robots-Tag", "noindex");
        next();
    });
    
    app.use(Express.static(__dirname + "/../../Public/80"));
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

    const accountKey = await ACME.forge.createPrivateKey();

    const client = new ACME.Client({
        directoryUrl: ACME.directory.letsencrypt.staging,
        accountKey
    });

    const [key, csr] = await ACME.forge.createCsr({
        commonName: Config.domain,
        altNames: [Config.domain]
    });

    return new Promise(async (resolve) => {
        client.auto({
            csr, email: Config.email,
            termsOfServiceAgreed: true,
            challengePriority: ["http-01"],
            challengeCreateFn: (authz, challenge, keyAuthorization) => {
                Console.log("Received the OK from Let's Encrypt.");
                Console.warn("Using HTTP for verification. Make sure your server is available at http://" + Config.domain + ":80!");
                FS.writeFileSync(__dirname + "/../../Public/80/.well-known/acme-challenge/" + challenge.token, challenge.token);
            },
            challengeRemoveFn: (authz, challenge, keyAuthorizatio) => {
                Console.log("Finished HTTP verification.");
                FS.unlinkSync(__dirname + "/../../Public/80/.well-known/acme-challenge/" + challenge.token);
            }
        }).then((cert) => {
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
        
            resolve({ key, cert });
        }).catch((err) => {
            Console.fatal("Couldn't issue a SSL certificate:");
            console.error(err);

            setTimeout(() => {
                // Wait 10 minutes so we don't spam Let's Encrypt.
                Console.fatal("Exiting...");
                process.exit(1);
            }, 600000);
        })
    });
}
