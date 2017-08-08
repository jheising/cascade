import Cascade from "../Cascade";

let restify = require("restify");

class WebServer
{
    static server:any;

    static initialize()
    {
        WebServer.server = restify.createServer();
        WebServer.server.use(restify.plugins.bodyParser());
        WebServer.server.use(restify.plugins.queryParser());

        let webPort = Number(process.env.WEB_PORT || 3000);
        WebServer.server.listen(webPort, function() {
            Cascade.logDebug(`Web server started on port ${webPort}`);
        });
    }

    static authorizeUser(req, res, next)
    {
        next();
    }
}
module.exports = WebServer;

Cascade.start(() => {
    WebServer.initialize();
});

