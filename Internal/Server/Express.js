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


const Express = require("express"),
    app = Express();

app.get("/ping", (req, res) => {
    res.status(200).json({
        message: "Pong!",
        time: Date.now()
    });
});

app.use((req, res, next) => {
    res.header("X-Robots-Tag", "noindex");
    next();
});

app.use(Express.static(__dirname + "/../../Public/443"));
app.use((req, res) => res.status(404).send());
module.exports = app;
