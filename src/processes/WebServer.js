"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cascade_1 = require("../Cascade");
let restify = require("restify");
class WebServer {
    static initialize() {
        WebServer.server = restify.createServer();
        WebServer.server.use(restify.plugins.bodyParser());
        WebServer.server.use(restify.plugins.queryParser());
        let webPort = Number(process.env.WEB_PORT || 3000);
        WebServer.server.listen(webPort, function () {
            Cascade_1.default.logDebug(`Web server started on port ${webPort}`);
        });
    }
    static authorizeUser(req, res, next) {
        next();
    }
}
module.exports = WebServer;
Cascade_1.default.start(() => {
    WebServer.initialize();
});
//# sourceMappingURL=WebServer.js.map