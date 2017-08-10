import Cascade from "../Cascade";

let restify = require("restify");

class WebServer {
    static server: any;
    static userManager;

    static initialize() {
        WebServer.userManager = Cascade.requireProcess("UserManagement");

        WebServer.server = restify.createServer();
        WebServer.server.use(restify.plugins.bodyParser());
        WebServer.server.use(restify.plugins.queryParser());
        WebServer.server.use(restify.plugins.authorizationParser());

        let webPort = Number(process.env.WEB_PORT || 3000);
        WebServer.server.listen(webPort, function () {
            Cascade.logDebug(`Web server listening on port ${webPort}`);
        });
    }

    static authorizeUser(req, res, next) {

        function unauthorized()
        {
            res.header("www-authenticate", 'Basic realm="cascade"');
            res.send(401, "Unauthorized");
        }

        if(!req.authorization || !req.authorization.basic)
        {
            unauthorized();
            return;
        }

        WebServer.userManager.authorizeUser(
            req.authorization.basic.username,
            req.authorization.basic.password,
            (isAuthorized, isReadOnly) => {
                if(!isAuthorized)
                {
                    unauthorized();
                    return;
                }

                req.authorization.isReadOnly = isReadOnly;

                next();
            });
    }
}

module.exports = WebServer;

Cascade.start(() => {
    WebServer.initialize();
});

